import Ember from 'ember';
const { Mixin, A: emberA } = Ember;

export default Mixin.create({
  normalize: function(typeClass, hash, prop) {
    let normalizedHash;

    if (typeClass._isPartialModel === true) {
      let partialDescriptors = this._partialDescriptors(typeClass);
      let attributesForExtensions = this._extractExtensionsAttributes(partialDescriptors, hash);

      normalizedHash = this._super(typeClass, hash, prop);

      partialDescriptors.forEach(descriptor => {
        let extensionKey = descriptor.key;
        let extensionName = descriptor.type;
        let attributesForExtension = attributesForExtensions[extensionName];

        normalizedHash = this._assignExtensionsRelationships(normalizedHash, extensionKey);
        this._updateModelAttributes(extensionName, attributesForExtension);
      });
    } else if (typeClass._extendPartialModel) {
      let parentFactoryName = typeClass._extendPartialModel;
      let parentTypeClass = this.container.lookupFactory(`model:${parentFactoryName}`);
      let partialDescriptors = this._partialDescriptors(parentTypeClass);
      let attributesForExtensions = this._extractExtensionsAttributes(partialDescriptors, hash);
      let currentExtensionName = typeClass.modelName;

      // Normalize for the current extension
      let attributesForCurrentExtension = attributesForExtensions[currentExtensionName];
      normalizedHash = this._super(typeClass, attributesForCurrentExtension, prop);

      // Update parent attributes
      this._updateModelAttributes(parentFactoryName, hash);

      // Update other partial extensions attributes
      partialDescriptors.forEach(descriptor => {
        let extensionName = descriptor.type;
        let attributesForExtension = attributesForExtensions[extensionName];

        if (extensionName !== currentExtensionName) {
          this._updateModelAttributes(extensionName, attributesForExtension);
        }
      });
    } else {
      normalizedHash = this._super(...arguments);
    }
    return normalizedHash;
  },

  serialize: function(snapshot /*, options */) {
    let ourHash = this._super(...arguments);

    this._partialDescriptors(snapshot).forEach(descriptor => {
      let partialData = {};
      let partial = snapshot.belongsTo(descriptor.key);

      // Remove partial model association
      delete ourHash[descriptor.key];

      // Add partial model data within parent payload
      if (partial) {
        partialData = partial.record.serialize();
      }
      Ember.merge(ourHash, partialData);
    });

    return ourHash;
  },

  _partialDescriptors: function(typeClass) {
    let descriptors = emberA();
    typeClass.eachRelationship((relationshipKey, descriptor) => {
      if (descriptor.options.isPartialExtension) {
        descriptors.push(descriptor);
      }
    });
    return descriptors;
  },

  _extractExtensionsAttributes: function(partialDescriptors, hash) {
    let attributesForExtensions = {};

    partialDescriptors.forEach(descriptor => {
      let extensionName = descriptor.type;
      attributesForExtensions[extensionName] = {};

      Object.keys(descriptor.options.classHash).forEach(attr => {
        if (hash[attr]) {
          attributesForExtensions[extensionName][attr] = hash[attr];
          delete hash[attr];
        }
      });

      attributesForExtensions[extensionName]['id'] = hash['id'];
    });

    return attributesForExtensions;
  },

  _assignExtensionsRelationships: function(normalizedHash, extensionKey) {
    normalizedHash[extensionKey] = normalizedHash.id;
    return normalizedHash;
  },

  _updateModelAttributes: function(modelName, attributesForModel) {
    if (Object.keys(attributesForModel).length > 1) {
      this.store.push(modelName, attributesForModel);
    }
  }
});
