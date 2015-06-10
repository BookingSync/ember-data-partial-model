import Ember from 'ember';
import DS from 'ember-data';
import PartialModel from './partial-model';
const { RESTSerializer } = DS;

export default RESTSerializer.extend(PartialModel, {});
