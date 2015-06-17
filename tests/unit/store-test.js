import {
  module,
  test
} from 'qunit';

import Ember from 'ember';
import startapp from '../helpers/start-app';

var app, store;

module('unit/store-mixin', {
  setup: function() {
    app = startapp();
    store = app.__container__.lookup('store:application');
  },
  tearDown: function() {
    Ember.run(app, app.destroy);
  }
});

test('modelFor generates partial extension model with name reference to parent model', function(assert) {
  assert.equal(app.__container__.lookup('model:user-extended'), null);

  // will generate user-extended model
  store.modelFor('user');

  assert.equal(store.modelFor('user-extended')._extendPartialModel, 'user');
});


test('modelFor generates serializer for partial extension model', function(assert) {
  assert.equal(app.__container__.lookup('serializer:user-extended'), null);

  // will generate user-extended serializer
  store.modelFor('user');

  let serializer = store.serializerFor('user-extended');
  assert.equal(serializer.modelNameFromPayloadKey(), 'user-extended');
});


test('createRecord creates instance of parent model with partial models and properly handles assignment of properties: delegates assignment to proper partial models and assigns rest of the properties to parent model', function(assert) {
  let user;

  Ember.run(() => {
    user = store.createRecord('user', { name: 'zencocoon', twitter: 'sebgrosjean', otherProperty: 'some value' });
  });

  assert.equal(user.get('name'), 'zencocoon');
  assert.equal(user.get('twitter'), 'sebgrosjean');
  assert.equal(user.get('otherProperty'), 'some value');
  assert.ok(user.get('extended'));
  assert.equal(user.get('extended.twitter'), 'sebgrosjean');
  assert.equal(user.get('extended.name'), null);
  assert.equal(user.get('extended.otherProperty'), null);
});
