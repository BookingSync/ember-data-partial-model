import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return Ember.RSVP.hash({
      users: this.store.find('user'),
      newUser: this.store.createRecord('user')
    });
  },

  setupController: function(controller, model) {
    controller.set('users', model.users);
    model.users.forEach((user) => user.loadPartials())
    controller.set('newUser', model.newUser);
    this._super(controller, model);
  }
});
