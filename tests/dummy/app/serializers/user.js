import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  attrs: {
    extended: { serialize: false }
  },

  // Allow to support responses with {}
  normalize: function(store, type, hash) {
    var toReturn = this._super(...arguments);
    toReturn.extended = toReturn.id;
    return toReturn;
  },

  serialize: function(snapshot, options) {
    // Remove partial model from here instead of attrs serialize: false
    var ourHash = this._super(...arguments);
    var extendedData = {};
    var extended = snapshot.belongsTo('extended');
    if (extended) {
      extendedData = extended.record.serialize();
    }
    return Ember.merge(ourHash, extendedData);
  }
});
