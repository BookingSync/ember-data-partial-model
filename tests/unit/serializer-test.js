import {
  module,
  test
} from 'qunit';

import Ember from 'ember';
import DS from 'ember-data';
import startapp from '../helpers/start-app';
import PartialModelSerializer from 'ember-data-partial-model/mixins/serializer';

var serializer, app, store;

module('unit/serializer-mixin', {
  setup: function() {
    serializer = DS.RESTSerializer.extend(PartialModelSerializer).create();
    app = startapp();
    store = app.__container__.lookup('service:store');
  },
  tearDown: function() {
    Ember.run(serializer, 'destroy');
    Ember.run(app, app.destroy);
  }
});

test('normalize for partial model assigns id from main model to extended models', function(assert) {
  let payload = { id: 1,  name: 'name' };
  let normalizedPayload = {
    data: {
      type: 'user',
      id: '1',
      attributes: {
        name: 'name'
      },
      relationships: {
        extended: {
          data: {
            type: 'user-extended',
            id: '1'
          }
        }
      }
    }
  };

  assert.deepEqual(serializer.normalize(store.modelFor('user'), payload), normalizedPayload);
});

test('serialize performs serialization by merging payload from partial models to payload from main model and deletes partial models from hash', function(assert) {
  var user;
  Ember.run(() => {
    user = store.createRecord('user', { name: 'zencocoon', twitter: 'sebgrosjean' });
  });

  let serializedUser = { name: 'zencocoon', twitter: 'sebgrosjean' };
  assert.deepEqual(serializer.serialize(user._createSnapshot(), {}), serializedUser);
});
