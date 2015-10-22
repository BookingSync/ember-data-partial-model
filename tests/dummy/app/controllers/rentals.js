import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save(rental) {
      rental.save()
        .then(rental => {
          this.transitionToRoute('rentals.rental', rental);
        })
        .catch(error => {
          console.log('TODO: handle errors');
        });
    }
  }
});
