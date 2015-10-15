export default {
  normalizeEachPartialRelationship: function(modelClass, resourceHash, context, normalizePartialRelationshipStrategy) {
    partialDescriptors(modelClass).forEach(descriptor => {
      normalizePartialRelationshipStrategy.call(context, modelClass, resourceHash, descriptor);
    });
  },

  serializeEachPartialRelationship: function(snapshot, serializedHash, context, copyAttributesFromPartialToParentStrategy) {
    partialDescriptors(snapshot).forEach(descriptor => {
      let partial = snapshot.belongsTo(descriptor.key);

      if (partial) {
        let partialHash = partial.record.serialize();
        copyAttributesFromPartialToParentStrategy.call(context, serializedHash, partialHash);
      }
    });
  }
};

function partialDescriptors(modelClass) {
  if (modelClass._partialDescriptors) {
    return modelClass._partialDescriptors();
  } else if(modelClass.type && modelClass.type._partialDescriptors) {
    return modelClass.type._partialDescriptors();
  } else {
    return [];
  }
}
