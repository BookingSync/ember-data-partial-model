import Ember from 'ember';
import DS from 'ember-data';
const { Mixin } = Ember;
const { Model } = DS;

export default Mixin.create({
  modelFor(key) {
    let factory = this._super(key);
    if (factory._isPartialModel === true) {
      this._generatePartialExtensionModel(key, factory);
      this._generatePartialExtensionSerializer(key, factory);
    }
    return factory;
  },

  createRecord(modelName, inputProperties) {
    inputProperties = inputProperties || {};
    let factory = this.modelFor(modelName);
    let relationshipsToBeAssigned = {};
    let attributesFromPartialModels = [];

    if (factory._isPartialModel) {
      factory.eachRelationship((relationshipKey, descriptor) => {
        if (descriptor.options.isPartialExtension === true) {
          let partialModelName = `${modelName}-${relationshipKey}`;
          let partialProperties = descriptor.options.classHash;
          let attributesFromPartialModel = Object.keys(partialProperties);
          let propertiesForPartialModel = this._extractPropertiesForPartialModel(
            inputProperties, attributesFromPartialModel, partialProperties);
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

  _extractPropertiesForModel(inputProperties, attributesFromPartialModels) {
    let propertiesForModel = {};
    for (let prop in inputProperties) {
      if (attributesFromPartialModels.indexOf(prop) === -1) {
        propertiesForModel[prop] = inputProperties[prop];
      }
    }
    return propertiesForModel;
  },

  _extractPropertiesForPartialModel(inputProperties, attributesFromPartialModel) {
    let propertiesForPartialModel = {};
    attributesFromPartialModel
      .filter((prop) => inputProperties.hasOwnProperty(prop))
      .forEach((prop) => {
        propertiesForPartialModel[prop] = inputProperties[prop];
    });
    return propertiesForPartialModel;
  },

  _generatePartialExtensionModel(factoryName, factory) {
    factory.eachRelationship((relationshipKey, descriptor) => {
      let partialExtensionModelName = `${factoryName}-${relationshipKey}`;
      let dependencyName = `model:${partialExtensionModelName}`;
      if (descriptor.options.isPartialExtension === true) {
        if (!_isDependencyRegistered(this, dependencyName)) {
          let partialExtensionModel = Model.extend(descriptor.options.classHash)
            .reopenClass({ _extendPartialModel: factoryName });
          _registerDependency(this, dependencyName, partialExtensionModel);
        }
      }
    });
  },

  _generatePartialExtensionSerializer(factoryName, factory) {
    factory.eachRelationship((partialName, descriptor) => {
      let partialExtensionSerializerName = `${factoryName}-${partialName}`;
      let dependencyName = `serializer:${partialExtensionSerializerName}`;
      if (descriptor.options.isPartialExtension === true) {
        if (!_isDependencyRegistered(this, dependencyName)) {
          let parentSerializer = this.serializerFor(factoryName);
          let parentSerializerConstructor = parentSerializer.constructor;
          let serializerOverrides = this._overridesForPartialSerializer(parentSerializer,
            partialName, partialExtensionSerializerName);
          let mixins = this._mixinsForPartialSerializer(parentSerializer, partialName);
          let partialExtensionSerializer = parentSerializerConstructor.extend(...mixins,
            serializerOverrides);
          _registerDependency(this, dependencyName, partialExtensionSerializer);
        }
      }
    });
  },

  _overridesForPartialSerializer(parentSerializer, partialName, partialExtensionSerializerName) {
    let serializerOverrides = {};
    let externalOverrides = parentSerializer.partialSerializersExtensions &&
      parentSerializer.partialSerializersExtensions[partialName] || {};
    Object.assign(serializerOverrides, externalOverrides);
    Object.assign(serializerOverrides, {
      modelNameFromPayloadKey() {
        return this._super(partialExtensionSerializerName);
      }
    });
    return serializerOverrides;
  },

  _mixinsForPartialSerializer(parentSerializer, partialName) {
    return parentSerializer.partialSerializersMixins &&
      parentSerializer.partialSerializersMixins[partialName] || [];
  }
});

function _isDependencyRegistered(store, dependencyName) {
  if (Ember.getOwner) {
    return Ember.getOwner(store).hasRegistration(dependencyName);
  } else if (store.container.registry) {
    // support Ember 2.1 - 2.2
    return store.container.registry.has(dependencyName);
  } else {
    // fallback to Ember < 2.1
    return store.container._registry.has(dependencyName);
  }
}

function _registerDependency(store, dependencyName, dependency) {
  if (Ember.getOwner) {
    Ember.getOwner(store).register(dependencyName, dependency);
  } else if (store.container.registry) {
    // support Ember 2.1 - 2.2
    store.container.registry.register(dependencyName, dependency);
  } else {
    // fallback to Ember < 2.1
    store.container._registry.register(dependencyName, dependency);
  }
}
