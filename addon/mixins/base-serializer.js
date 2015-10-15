import Ember from 'ember';
import partialModelHandler from 'ember-data-partial-model/utils/serializer-partial-model-handler';
const { Mixin } = Ember;
const { normalizeEachPartialRelationship, serializeEachPartialRelationship } = partialModelHandler;

export default Mixin.create({
  normalize: function(modelClass, resourceHash) {
    normalizeEachPartialRelationship(modelClass, resourceHash, this, this._normalizePartialRelationship);
    return this._super(modelClass, resourceHash);
  },

  serialize: function(snapshot /*, options */) {
    let serializedHash = this._super(...arguments);
    serializeEachPartialRelationship(snapshot, serializedHash, this, this._copyAttributesFromPartialToParent);

    return serializedHash;
  },

  serializeBelongsTo: function(snapshot, json, relationship) {
    if (relationship.options.isPartialExtension) {
      return null;
    } else {
      return this._super(...arguments);
    }
  },

  _normalizePartialRelationship: function(/* modelClass, resourceHash, descriptor */) {
  },

  _copyAttributesFromPartialToParent: function(/* serializedHash, partialHash */) {
  }
});
