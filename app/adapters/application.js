import PartialModelAdapter from 'ember-data-partial-model/mixins/adapter';
import JSONAPIAdapter from 'ember-data/adapters/json-api';

export default JSONAPIAdapter.extend(PartialModelAdapter);
