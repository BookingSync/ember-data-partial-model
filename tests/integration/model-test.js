import {
  module,
  test
} from 'qunit';

import Ember from 'ember';
import startApp from '../helpers/start-app';
var App;

module("integration/model", {
  setup: function() {
    App = startApp();
  },

  teardown: function () {
    Ember.run(App, App.destroy);
  }
});

test('', function(assert) {
  visit('/users/1');

  andThen(() => {
    assert.equal(find('.twitter-handle').val(), "joliss-twitter");
  });



  // fillIn('input:last-of-type', "Twitter handle");

});

test('create', function(assert) {
  visit('/');

  fillIn('.new-user-name', "Some name");
  fillIn('.new-user-twitter-handle', "twitter-handle");
  click('.save-new-user-btn');

  visit('/users/8');

  andThen(() => {
    assert.equal(find('.twitter-handle').val(), "twitter-handle");
  });



  // fillIn('input:last-of-type', "Twitter handle");

});
