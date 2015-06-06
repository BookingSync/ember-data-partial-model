import DS from 'ember-data';

function partial(modelName, prop, hash) {
  return DS.belongsTo(`${modelName}-${prop}`, {
    async: true, isPartialExtension: true, classHash: hash
  });
}

let PartialModel = DS.Model.extend({
  _setupAliasesForPartials: Ember.on('init', function() {
    this.constructor.eachRelationship((relationshipKey, descriptor) => {
      let options = descriptor.options
      if (options.isPartialExtension === true) {
        Object.keys(options.classHash).forEach(attr => {
          Ember.defineProperty(this, attr, Ember.computed.alias(`${relationshipKey}.${attr}`));
        });
      }
    })
  })
});

PartialModel.reopenClass({
  _isPartialModel: true
});

export {PartialModel, partial};
