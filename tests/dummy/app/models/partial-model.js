import DS from 'ember-data';

function extended(hash) {
  return DS.belongsTo('user-extended', { async: true, isExtended: true, classHash: hash });
}

var PartialModel = DS.Model.extend({});

PartialModel.reopenClass({
  _isPartialModel: true
});

export {PartialModel, extended};
