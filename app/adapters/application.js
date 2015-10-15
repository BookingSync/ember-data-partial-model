import DS from 'ember-data';
import PartialModelAdapter from 'ember-data-partial-model/mixins/adapter';
const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend(PartialModelAdapter);
