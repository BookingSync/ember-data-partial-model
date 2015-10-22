import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save(rental) {
      rental.save().catch(error => {
        console.log('TODO: handle errors');
      });
    }
  }
});
