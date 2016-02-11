import {
  module,
  test
} from 'qunit';

import Ember from 'ember';
import startapp from '../../helpers/start-app';
import Pretender from 'pretender';

var app, store;

module('utils/model', {
  setup: function() {
    app = startapp();
    store = app.__container__.lookup('service:store');
  },
  tearDown: function() {
    Ember.run(app, app.destroy);
  }
});

test('PartialModel is defined with _isPartialModel', function(assert) {
  assert.ok(store.modelFor('user')._isPartialModel);
});

test('PartialModel has reflections on partialDescriptors', function(assert) {
  let user;

  Ember.run(() => {
    user = store.createRecord('user');
  });

  let partialDescriptorForExtended = user._partialDescriptors()[0];

  assert.equal(partialDescriptorForExtended.key, 'extended');
  assert.equal(partialDescriptorForExtended.type, 'user-extended');
  assert.equal(partialDescriptorForExtended.isRelationship, true);
  assert.equal(partialDescriptorForExtended.kind, 'belongsTo');
  assert.deepEqual(Object.keys(partialDescriptorForExtended.options.classHash), ['twitter']);
});

test('PartialModel has defined aliases for setting / gettings properties in partials', function(assert) {
  let user;

  Ember.run(() => {
    user = store.createRecord('user');
    user.get('extended').set('twitter', 'sebgrosjean');
  });

  assert.equal(user.get('twitter'), 'sebgrosjean');

  Ember.run(() => {
    user.set('twitter', 'changed');
  });

  assert.equal(user.get('extended.twitter'), 'changed');
});

test('properties from partial models are always loaded before save', function(assert) {
  var users, updateRequest, getRequestPerformed;

  new Pretender(function() {
    this.get('/api/users/:id', function(request) {
      getRequestPerformed = true;
      let payload = {
        users: {
          id: 1, name: 'zencocoon', twitter: 'sebgrosjean'
        }
      };
      return [200, {"Content-Type": "application/json"}, JSON.stringify(payload)];
    });

    this.put('/api/users/:id', function(request) {
      updateRequest = request;
      return [200, {}, JSON.stringify({})];
    });
  });

  Ember.run(() => {
    let payload = {
      users: [
        { id: 1, name: 'zencocoon' }
      ]
    };
    store.pushPayload('user', payload);
    users = store.peekAll('user');
  });

  andThen(() => {
    users.objectAt(0).save();
  });

  andThen(() => {
    assert.ok(getRequestPerformed);
    assert.equal(JSON.parse(updateRequest.requestBody).user.twitter, 'sebgrosjean');
  });
});

