import Ember from 'ember';
import baseSerializerMixin from 'ember-data-partial-model/mixins/base-serializer';
const { Mixin } = Ember;

export default Mixin.create(baseSerializerMixin, {
  _normalizePartialRelationship: function(modelClass, resourceHash, descriptor) {
    resourceHash[descriptor.key] = resourceHash.id;
  },

  _copyAttributesFromPartialToParent: function(serializedHash, partialHash) {
    Ember.merge(serializedHash, partialHash);
  }
});
