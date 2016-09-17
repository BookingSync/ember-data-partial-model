import { PartialModel, partial } from 'ember-data-partial-model/utils/model';
const { attr, hasMany } = DS;

export default PartialModel.extend({
  name: attr(),
  extended: partial('user', 'extended', {
    twitter: attr(),
    clients: hasMany('client', { async: false })
  })
});
