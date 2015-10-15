import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('users', { path: '/' }, function() {
    this.route('user', { path: '/users/:user_id' });
    this.route('new', { path: '/users/new' });
  });
  this.resource('rentals', { path: '/rentals' }, function() {
    this.route('rental', { path: '/:rental_id' });
    this.route('new', { path: '/new' });
  });
});

export default Router;
