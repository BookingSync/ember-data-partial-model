import PartialModelJSONAPISerializer from 'ember-data-partial-model/mixins/jsonapi-serializer';
import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend(PartialModelJSONAPISerializer);
