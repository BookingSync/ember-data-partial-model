import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  fullName: i => `Awesome Client ${i}`
});
