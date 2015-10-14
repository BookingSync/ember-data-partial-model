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

// function _generatePartialExtensionModel(factory, container) {
//   let factoryName = factory.modelName;
//   debugger;
//   factory.eachRelationship((relationshipKey, descriptor) => {
//     let partialExtensionModelName = `${factoryName}-${relationshipKey}`;
//     if (descriptor.options.isPartialExtension === true) {
//       if (!container._registry.has(`model:${partialExtensionModelName}`)) {
//         let partialExtensionModel = Model.extend(descriptor.options.classHash)
//           .reopenClass({ _extendPartialModel: factoryName });
//         container._registry.register(`model:${partialExtensionModelName}`, partialExtensionModel);
//       }
//     }
//   });
// }

// function _generatePartialExtensionSerializer(factory, container, store) {
//   let factoryName = factory.modelName;
//   factory.eachRelationship((relationshipKey, descriptor) => {
//     let partialExtensionSerializerName = `${factoryName}-${relationshipKey}`;
//     if (descriptor.options.isPartialExtension === true) {
//       if (!container._registry.has(`serializer:${partialExtensionSerializerName}`)) {
//         let parentSerializerClass = store.serializerFor(factoryName).constructor;
//         let partialExtensionSerializer = parentSerializerClass.extend({
//           modelNameFromPayloadKey: function(/* key */) {
//             return this._super(partialExtensionSerializerName);
//           }
//         });
//         container._registry.register(`serializer:${partialExtensionSerializerName}`,
//           partialExtensionSerializer);
//       }
//     }
//   });
// }

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

  // _registerExtendedModels: on('init', function() {
  //   _generatePartialExtensionModel(this.constructor, this.container);
  //   _generatePartialExtensionSerializer(this.constructor, this.container, this.store);
  // }),

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
