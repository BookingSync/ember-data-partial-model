import DS from 'ember-data';
import Ember from 'ember';
import PartialModelRESTSerializer from 'ember-data-partial-model/mixins/rest-serializer';
import RESTSerializer from 'ember-data/serializers/rest';

const { EmbeddedRecordsMixin } = DS;
const { Mixin } = Ember;

export default RESTSerializer.extend(PartialModelRESTSerializer, {
  partialSerializersExtensions: {
    extended: {
      attrs: {
        clients: { embedded: 'always' }
      }
    }
  },

  partialSerializersMixins: {
    extended: [EmbeddedRecordsMixin, Mixin.create({ __magicAttributeForTest__: true })]
  }
});
