import DS from 'ember-data';
import Ember from 'ember';
const { computed, on, A: emberA, RSVP: { hash } } = Ember;
const { alias } = computed;

function partial(modelName, prop, hash) {
  return DS.belongsTo(`${modelName}-${prop}`, {
    async: true, isPartialExtension: true, classHash: hash
  });
}

let PartialModel = DS.Model.extend({
  partialDescriptors() {
    let descriptors = emberA();
    this.constructor.eachRelationship((relationshipKey, descriptor) => {
      if (descriptor.options.isPartialExtension) {
        descriptors.push(descriptor);
      }
    });
    return descriptors;
  },

  _setupAliasesForPartials: on('init', function() {
    this.partialDescriptors().forEach(descriptor => {
      Object.keys(descriptor.options.classHash).forEach(attr => {
        Ember.defineProperty(this, attr, alias(`${descriptor.key}.${attr}`));
      });
    });
  }),

  loadPartials() {
    return new hash(this.getProperties(...this.partialDescriptors().mapBy('key'))).then(() => {
      return this;
    });
  }
});

PartialModel.reopenClass({
  _isPartialModel: true
});

export { PartialModel, partial };
