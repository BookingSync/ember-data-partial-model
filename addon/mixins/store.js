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
    let factory = this.modelFor(modelName);
    let relationshipsToBeAssigned = {};
    let attributesFromPartialModels = [];

    if (factory._isPartialModel) {
      factory.eachRelationship((relationshipKey, descriptor) => {
        if (descriptor.options.isPartialExtension === true) {
          // TODO: check for properties in parent model and do not set them in partial models
          let partialModelName = `${modelName}-${relationshipKey}`;
          let partialModel = this._super(partialModelName, inputProperties);

          attributesFromPartialModels = attributesFromPartialModels.concat(Object.keys(descriptor.options.classHash));
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

  _generatePartialExtensionModel: function(factoryName, factory) {
    factory.eachRelationship((relationshipKey, descriptor) => {
      let partialExtensionModelName = `${factoryName}-${relationshipKey}`;
      if (descriptor.options.isPartialExtension === true) {
        if (!this.container.has(`model:${partialExtensionModelName}`)) {
          let partialExtensionModel = Model.extend(descriptor.options.classHash)
            .reopenClass({ _extendPartialModel: factoryName });
          this.container.register(`model:${partialExtensionModelName}`, partialExtensionModel);
        }
      }
    });
  },

  _generatePartialExtensionSerializer: function(factoryName, factory) {
    factory.eachRelationship((relationshipKey, descriptor) => {
      let partialExtensionSerializerName = `${factoryName}-${relationshipKey}`;
      if (descriptor.options.isPartialExtension === true) {
        if (!this.container.has(`serializer:${partialExtensionSerializerName}`)) {
          let parentSerializerClass = this.serializerFor(factoryName).constructor;
          let partialExtensionSerializer = parentSerializerClass.extend({
            modelNameFromPayloadKey: function(/* key */) {
              return this._super(partialExtensionSerializerName);
            }
          });
          this.container.register(`serializer:${partialExtensionSerializerName}`,
            partialExtensionSerializer);
        }
      }
    });
  }
});
