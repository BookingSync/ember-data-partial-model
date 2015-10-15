import DS from 'ember-data';
import PartialModelJSONAPISerializer from 'ember-data-partial-model/mixins/jsonapi-serializer';
const { JSONAPISerializer } = DS;

export default JSONAPISerializer.extend(PartialModelJSONAPISerializer);
