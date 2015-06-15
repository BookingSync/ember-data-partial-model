import Ember from 'ember';
import DS from 'ember-data';

import { PartialModel, partial } from 'ember-data-partial-model/utils/model';
import startApp from '../helpers/start-app';


const { attr } = DS;
var User, App;
var run = Ember.run;

module("integration/model", {
  setup: function() {
    App = startApp();
    store = App.__container__.lookup('store:main');

    User = PartialModel.extend({
      name: attr(),
      extended: partial('user', 'extended', {
        twitter: attr()
      })
    });
  },

  teardown: function () {
    Ember.run(App, App.destroy);
  }
});

test('a', function(assert) {
  // var user =
});
