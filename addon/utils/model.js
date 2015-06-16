import DS from 'ember-data';
import Ember from 'ember';
const { computed, on, A: emberA, RSVP: { hash } } = Ember;
const { alias } = computed;
const { Model, belongsTo } = DS;

function partial(modelName, prop, hash) {
  return belongsTo(`${modelName}-${prop}`, {
    async: true, isPartialExtension: true, classHash: hash
  });
}

var PartialModel = Model.extend({
  _partialDescriptors() {
    let descriptors = emberA();
    this.constructor.eachRelationship((relationshipKey, descriptor) => {
      if (descriptor.options.isPartialExtension) {
        descriptors.push(descriptor);
      }
    });
    return descriptors;
  },

  _setupAliasesForPartials: on('init', function() {
    this._partialDescriptors().forEach(descriptor => {
      Object.keys(descriptor.options.classHash).forEach(attr => {
        Ember.defineProperty(this, attr, alias(`${descriptor.key}.${attr}`));
      });
    });
  }),

  loadPartials() {
    return new hash(this.getProperties(...this._partialDescriptors().mapBy('key'))).then(() => {
      return this;
    });
  }
});

PartialModel.reopenClass({
  _isPartialModel: true
});

export { PartialModel, partial };
