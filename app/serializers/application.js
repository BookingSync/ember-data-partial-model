import DS from 'ember-data';
import PartialModelSerializer from 'ember-data-partial-model/mixins/serializer';
const { RESTSerializer } = DS;

export default RESTSerializer.extend(PartialModelSerializer, {});
