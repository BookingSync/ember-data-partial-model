import {
  module,
  test
} from 'qunit';

import Ember from 'ember';
import DS from 'ember-data';
import PartialModelAdapter from 'ember-data-partial-model/mixins/adapter';

var adapter;

module('unit/adapter-mixin', {
  setup: function() {
    adapter = DS.RESTAdapter.extend(PartialModelAdapter).create();
  },
  tearDown: function() {
    Ember.run(adapter, 'destroy');
  }
});

test('it uses _extendPartialModel property to buildURL from if present', function(assert) {
  var snapshotStub = { type: { _extendPartialModel: "other-user" } };
  assert.equal(adapter.buildURL('user', 1, snapshotStub), '/otherUsers/1');

  snapshotStub = { type: { _extendPartialModel: null } };
  assert.equal(adapter.buildURL('user', 1, snapshotStub), '/users/1');
});
