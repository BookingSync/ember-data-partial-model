import DS from 'ember-data';

export default DS.Model.extend({
  user_extended: DS.belongsTo('user_extended', { async: true }),
  name: DS.attr()
});
