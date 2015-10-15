import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save(user) {
      user.save()
        .then(user => {
          this.transitionToRoute('users.user', user);
        })
        .catch(error => {
          console.log('TODO: handle errors');
        });
    }
  }
});
