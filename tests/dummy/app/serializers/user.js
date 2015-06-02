import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  attrs: {
    user_extended: { serialize: false }
  },

  // Allow to support responses with {}
  normalize: function(store, type, hash) {
    var toReturn = this._super(...arguments);
    toReturn.user_extended = toReturn.id;
    return toReturn;
  },

  serialize: function(snapshot, options) {
    var ourHash = this._super(...arguments);
    var extendedData = {};
    var extended = snapshot.belongsTo('user_extended');
    if (extended) {
      extendedData = extended.record.serialize();
    }
    return Ember.merge(ourHash, extendedData);
  }
});
