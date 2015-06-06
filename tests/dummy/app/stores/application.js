import DS from 'ember-data';

export default DS.Store.extend({
  modelFor: function(key) {
    let factory = this._super(key);
    if (factory._isPartialModel === true) {
      this.generatePartialExtensionModel(key, factory);
    }
    return factory;
  },

  generatePartialExtensionModel: function(factoryName, factory) {
    factory.eachRelationship((relationshipKey, descriptor) => {
      let partialExtensionModelName = `${factoryName}-${relationshipKey}`;
      if (descriptor.options.isPartialExtension === true) {
        if (!this.container.has(`model:${partialExtensionModelName}`)) {
          let partialExtensionModel = DS.Model.extend(descriptor.options.classHash);
          this.container.register(`model:${partialExtensionModelName}`, partialExtensionModel);
        }
      }
    });
  }
});
