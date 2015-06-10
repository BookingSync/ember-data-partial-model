import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  namespace: 'api'

  // buildURL: function(...) {
  //   // check if snapshot is from partial model
  //   this._super(...)
  // }
});
