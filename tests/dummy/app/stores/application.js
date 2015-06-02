import DS from 'ember-data';

export default DS.Store.extend({
  generateExtendedKey: function(key) {
    return key + '-extended';
  },

  modelFor: function(key) {
    var factory = this._super(key);
    if (key === 'user') { // factory._isCompoundModel) {
      var compoundKey = this.generateExtendedKey(key);
      if (!this.container.has('model:' + compoundKey)) {
        var extendedModel = this.generateExtendedModel(factory);
        this.container.register("model:" + compoundKey, extendedModel);
      }
    }
    return factory;
  },

  generateExtendedModel: function (factory) {
    // get('extended') to be replaced by fetching relationship with values having isExtended to true
    var optionsHash = Ember.get(factory, 'relationshipsByName').get('extended').options;
    return DS.Model.extend(optionsHash.classHash);
  }
});
