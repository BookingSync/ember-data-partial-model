// import {CompoundModel, extended} from 'partial-model';
import DS from 'ember-data';

function extended(hash) {
  return DS.belongsTo('user-extended', { async: true, isExtended: true, classHash: hash });
}

// export default CompoundModel.extend({
export default DS.Model.extend({
  name: DS.attr(),
  extended: extended({
    twitter: DS.attr()
  }),
});
