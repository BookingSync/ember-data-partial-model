import DS from 'ember-data';
import PartialModelAdapter from 'ember-data-partial-model/mixins/adapter';
const { RESTAdapter } = DS;

export default RESTAdapter.extend(PartialModelAdapter, {});
