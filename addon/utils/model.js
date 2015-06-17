import DS from 'ember-data';
import Ember from 'ember';
const { computed, on, A: emberA, RSVP: { hash } } = Ember;
const { alias } = computed;
const { Model, belongsTo, PromiseObject } = DS;

function partial(modelName, prop, hash) {
  return belongsTo(`${modelName}-${prop}`, {
    async: true, isPartialExtension: true, classHash: hash
  });
}

var PartialModel = Model.extend({
  _partialDescriptors() {
    return this.constructor._partialDescriptors();
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
  },

  save() {
    var model = this;
    if (model.constructor._isPartialModel) {
      return model.loadPartials().then(() => {
        // Why this._super() doesn't work here?
        return PromiseObject.create({
          promise: model._internalModel.save().then(function() {
            return model;
          })
        });
      });
    } else {
      return this._super(...arguments);
    }
  }
});

PartialModel.reopenClass({
  _partialDescriptors: function() {
    let descriptors = emberA();
    this.eachRelationship((relationshipKey, descriptor) => {
      if (descriptor.options.isPartialExtension) {
        descriptors.push(descriptor);
      }
    });
    return descriptors;
  },
  _isPartialModel: true
});

export { PartialModel, partial };
