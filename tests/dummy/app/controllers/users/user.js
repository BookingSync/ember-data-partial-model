import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save(user) {
      user.save().catch(error => {
        console.log('TODO: handle errors');
      });
    }
  }
});
