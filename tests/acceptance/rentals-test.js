import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var app;
var rentals;
var rentalExtended;

module('Acceptance: Rentals using JSONAPI serializer', {
  beforeEach: function() {
    app = startApp();
    rentals = server.createList('rental', 2);
    rentalExtended = server.create('rental_extended');
  },

  afterEach: function() {
    Ember.run(app, 'destroy');
  }
});

test("I can view all rentals", function(assert) {
  visit('/rentals');

  andThen(function() {
    assert.equal(currentRouteName(), 'rentals.index');
    assert.equal(find('li').length, 2);
  });
});

test("I can view a rental with partial model loaded", function(assert) {
  visit('/rentals/1');

  andThen(function() {
    assert.equal(currentRouteName(), 'rentals.rental');
    assert.equal(find('.name').val(), "Rental 0");
    assert.equal(find('.description').val(), "Awesome Villa-0");
  });
});

test("I can create a new rental and it's partial model values", function(assert) {
  visit('/rentals/new');

  fillIn('.name', 'VillasThalassa');
  fillIn('.description', 'Awesome villas');
  click('.save-btn');

  andThen(function() {
    assert.equal(currentRouteName(), 'rentals.rental');
    assert.equal(find('.name').val(), "VillasThalassa");
    assert.equal(find('.description').val(), "Awesome villas");
  });
});

test("I can edit an existing rental and it's partial model values", function(assert) {
  visit('/rentals/1');

  fillIn('.name', 'Villa Sivota');
  fillIn('.description', 'Awesome villa in Greece');
  click('.save-btn');

  andThen(function() {
    assert.equal(currentRouteName(), 'rentals.rental');
    assert.equal(find('.name').val(), "Villa Sivota");
    assert.equal(find('.description').val(), "Awesome villa in Greece");
  });
});
