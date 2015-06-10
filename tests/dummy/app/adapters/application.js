import Ember from 'ember';
import DS from 'ember-data';
import PartialModel from './partial-model';
const { RESTAdapter } = DS;

export default RESTAdapter.extend(PartialModel, {
  namespace: 'api'
});
