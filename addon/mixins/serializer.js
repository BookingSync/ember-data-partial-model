import Ember from 'ember';
const { Mixin } = Ember;

export default Mixin.create({
  normalize: function(typeClass, hash, prop) {
    let normalizedHash;
    if (typeClass._isPartialModel) {
      let partialDescriptors = this._partialDescriptors(typeClass);

      partialDescriptors.forEach(descriptor => {
        hash[descriptor.key] = hash.id;
      });

      normalizedHash = this._super(typeClass, hash, prop);
    } else if (typeClass._extendPartialModel) {
      normalizedHash = this._super(this.store.modelFor(typeClass._extendPartialModel), hash, prop);
    } else {
      normalizedHash = this._super(...arguments);
    }
    return normalizedHash;
  },

  serialize: function(snapshot /*, options */) {
    let ourHash = this._super(...arguments);

    this._partialDescriptors(snapshot).forEach(descriptor => {
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
  },

  _partialDescriptors: function(typeClass) {
    // RETHINK: add _partialDescriptors to snapshots?
    if (typeClass._partialDescriptors) {
      return typeClass._partialDescriptors();
    } else if(typeClass.type && typeClass.type._partialDescriptors) {
      return typeClass.type._partialDescriptors();
    } else {
      return [];
    }
  }
});
