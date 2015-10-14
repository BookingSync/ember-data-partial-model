import Ember from 'ember';
import DS from 'ember-data';
const { Mixin } = Ember;
const { Model } = DS;

export default Mixin.create({
  modelFor: function(key) {
    let factory = this._super(key);
    if (factory._isPartialModel === true) {
      this._generatePartialExtensionModel(key, factory);
      this._generatePartialExtensionSerializer(key, factory);
    }
    return factory;
  },

  createRecord: function(modelName, inputProperties) {
    inputProperties = inputProperties || {};
    let factory = this.modelFor(modelName);
    let relationshipsToBeAssigned = {};
    let attributesFromPartialModels = [];

    if (factory._isPartialModel) {
      factory.eachRelationship((relationshipKey, descriptor) => {
        if (descriptor.options.isPartialExtension === true) {
          let partialModelName = `${modelName}-${relationshipKey}`;
          let attributesFromPartialModel = Object.keys(descriptor.options.classHash);
          let propertiesForPartialModel = this._extractPropertiesForPartialModel(inputProperties, attributesFromPartialModel);
          let partialModel = this._super(partialModelName, propertiesForPartialModel);

          attributesFromPartialModels = attributesFromPartialModels.concat(attributesFromPartialModel);
          relationshipsToBeAssigned[relationshipKey] = partialModel;
        }
      });
    }

    let propertiesForModel = this._extractPropertiesForModel(inputProperties, attributesFromPartialModels);
    let newRecord = this._super(modelName, propertiesForModel);

    for (let relationshipKey in relationshipsToBeAssigned) {
      newRecord.set(relationshipKey, relationshipsToBeAssigned[relationshipKey]);
    }
    return newRecord;
  },

  _extractPropertiesForModel: function(inputProperties, attributesFromPartialModels) {
    let propertiesForModel = {};
    for (let prop in inputProperties) {
      if (attributesFromPartialModels.indexOf(prop) === -1) {
        propertiesForModel[prop] = inputProperties[prop];
      }
    }
    return propertiesForModel;
  },

  _extractPropertiesForPartialModel: function(inputProperties, attributesFromPartialModel) {
    let propertiesForPartialModel = {};
    attributesFromPartialModel.forEach((prop) => {
      propertiesForPartialModel[prop] = inputProperties[prop];
    });
    return propertiesForPartialModel;
  },

  _generatePartialExtensionModel: function(factoryName, factory) {
    let registry = _getRegistry(this);
    factory.eachRelationship((relationshipKey, descriptor) => {
      let partialExtensionModelName = `${factoryName}-${relationshipKey}`;
      if (descriptor.options.isPartialExtension === true) {
        if (!registry.has(`model:${partialExtensionModelName}`)) {
          let partialExtensionModel = Model.extend(descriptor.options.classHash)
            .reopenClass({ _extendPartialModel: factoryName });
          registry.register(`model:${partialExtensionModelName}`, partialExtensionModel);
        }
      }
    });
  },

  _generatePartialExtensionSerializer: function(factoryName, factory) {
    let registry = _getRegistry(this);
    factory.eachRelationship((relationshipKey, descriptor) => {
      let partialExtensionSerializerName = `${factoryName}-${relationshipKey}`;
      if (descriptor.options.isPartialExtension === true) {
        if (!registry.has(`serializer:${partialExtensionSerializerName}`)) {
          let parentSerializerClass = this.serializerFor(factoryName).constructor;
          let partialExtensionSerializer = parentSerializerClass.extend({
            modelNameFromPayloadKey: function(/* key */) {
              return this._super(partialExtensionSerializerName);
            }
          });
          registry.register(`serializer:${partialExtensionSerializerName}`,
            partialExtensionSerializer);
        }
      }
    });
  }
});

function _getRegistry(store) {
  // support pre Ember 2.1.x (Ember 2.0.x, 1.13.x)
  if (store.container._registry) {
    return store.container._registry;
  } else {
    return store.container.registry;
  }
}
