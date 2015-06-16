import Ember from 'ember';
import DS from 'ember-data';
const { Mixin } = Ember;
const { Model } = DS;

export default Mixin.create({
  modelFor: function(key) {
    let factory = this._super(key);
    if (factory._isPartialModel === true) {
      this.generatePartialExtensionModel(key, factory);
      this.generatePartialExtensionSerializer(key, factory);
    }
    return factory;
  },

  createRecord: function(modelName /*, inputProperties */) {
    let newRecord = this._super(...arguments);
    let factory = newRecord.constructor;

    if (factory._isPartialModel) {
      factory.eachRelationship((relationshipKey, descriptor) => {
        if (descriptor.options.isPartialExtension === true) {
          let partialModel = this._super(`${modelName}-${relationshipKey}`, {});
          newRecord.set(relationshipKey, partialModel);
        }
      });
    }

    return newRecord;
  },

  generatePartialExtensionModel: function(factoryName, factory) {
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

  generatePartialExtensionSerializer: function(factoryName, factory) {
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
