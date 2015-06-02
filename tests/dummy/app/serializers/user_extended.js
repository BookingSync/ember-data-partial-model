import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  // Allow to support responses with {}
  modelNameFromPayloadKey: function(key) {
    key = 'user_extended';
    return this._super(key);
  }
});
