import DS from 'ember-data';
import PartialModelRESTSerializer from 'ember-data-partial-model/mixins/rest-serializer';
import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend(PartialModelRESTSerializer);
