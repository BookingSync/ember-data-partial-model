import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var app;
var users;
var userExtended;

module('Acceptance: Users', {
  beforeEach: function() {
    app = startApp();
    users = server.createList('user', 2);
    userExtended = server.create('user_extended');
  },

  afterEach: function() {
    Ember.run(app, 'destroy');
  }
});

test("I can view all users", function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentRouteName(), 'users.index');
    assert.equal(find('li').length, 2);
  });
});

test("I can view a user with partial model loaded", function(assert) {
  visit('/users/1');

  andThen(function() {
    assert.equal(currentRouteName(), 'users.user');
    assert.equal(find('.name').val(), "User 0");
    assert.equal(find('.twitter-handle').val(), "@user-0");
  });
});

test("I can create a new user and it's partial model values", function(assert) {
  visit('/users/new');

  fillIn('.name', 'Seb');
  fillIn('.twitter-handle', '@sebgrosjean');
  click('.save-btn');

  andThen(function() {
    assert.equal(currentRouteName(), 'users.user');
    assert.equal(find('.name').val(), "Seb");
    assert.equal(find('.twitter-handle').val(), "@sebgrosjean");
  });
});
