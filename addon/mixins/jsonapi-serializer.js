import Ember from 'ember';
import baseSerializerMixin from 'ember-data-partial-model/mixins/base-serializer';
const { Mixin } = Ember;

export default Mixin.create(baseSerializerMixin, {
  _normalizePartialRelationship: function(modelClass, resourceHash, descriptor) {
    resourceHash.relationships = resourceHash.relationships || {};
    resourceHash.relationships[descriptor.key] = {
      data: {
        type: descriptor.type,
        id: this.extractId(modelClass, resourceHash)
      }
    };
  },

  _copyAttributesFromPartialToParent: function(serializedHash, partialHash) {
    Ember.merge(serializedHash.data.attributes, partialHash.data.attributes);
  }
});
