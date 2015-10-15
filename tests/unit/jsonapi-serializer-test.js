import {
  module,
  test
} from 'qunit';

import Ember from 'ember';
import DS from 'ember-data';
import startapp from '../helpers/start-app';
import PartialModelSerializer from 'ember-data-partial-model/mixins/jsonapi-serializer';

var serializer, app, store;

module('unit/jsonapi-serializer-mixin', {
  setup: function() {
    serializer = DS.JSONAPISerializer.extend(PartialModelSerializer).create();
    app = startapp();
    store = app.__container__.lookup('service:store');
    let registry;
    if (app.__container__._registry) {
      registry = app.__container__._registry;
    } else {
      registry = app.__container__.registry;
    }
    registry.register('serializer:user', DS.JSONAPISerializer.extend(PartialModelSerializer));
    registry.register('serializer:user-extended', DS.JSONAPISerializer.extend(PartialModelSerializer));
  },
  tearDown: function() {
    Ember.run(serializer, 'destroy');
    Ember.run(app, app.destroy);
  }
});

test('normalize for partial model assigns id from main model to extended models', function(assert) {
  let payload = {
    id: 1,
    type: 'user',
    attributes: {
      name: 'name'
    }
  };
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

  let serializedUser = {
    "data": {
      "attributes": {
        "name": "zencocoon",
        "twitter": "sebgrosjean"
      },
      "type": "users"
    }
  };
  assert.deepEqual(serializer.serialize(user._createSnapshot(), {}), serializedUser);
});
