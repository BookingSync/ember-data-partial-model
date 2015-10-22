import DS from 'ember-data';
import PartialModelRESTSerializer from 'ember-data-partial-model/mixins/rest-serializer';
const { RESTSerializer } = DS;

export default RESTSerializer.extend(PartialModelRESTSerializer);
