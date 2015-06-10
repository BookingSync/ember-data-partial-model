import Ember from 'ember';
const { Mixin, A: emberA } = Ember;

export default Mixin.create({
  partialDescriptors: function(typeClass) {
    let descriptors = emberA();
    typeClass.eachRelationship((relationshipKey, descriptor) => {
      if (descriptor.options.isPartialExtension) {
        descriptors.push(descriptor);
      }
    });
    return descriptors;
  },

  normalize: function(typeClass, hash, prop) {
    let toReturn = this._super(...arguments);
    this.partialDescriptors(typeClass).forEach(descriptor => {
      toReturn[descriptor.key] = toReturn.id;
    });
    return toReturn;
  },

  serialize: function(snapshot, options) {
    let ourHash = this._super(...arguments);

    this.partialDescriptors(snapshot).forEach(descriptor => {
      let partialData = {};
      let partial = snapshot.belongsTo(descriptor.key);

      // Remove partial model association
      delete ourHash[descriptor.key];

      // Add partial model data within parent payload
      if (partial) {
        partialData = partial.record.serialize();
      }
      Ember.merge(ourHash, partialData);
    });

    return ourHash;
  }
});
