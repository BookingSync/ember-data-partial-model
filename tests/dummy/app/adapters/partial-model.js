import Ember from 'ember';
const { Mixin, A: emberA } = Ember;

export default Mixin.create({
  buildURL: function(modelName, id, snapshot, requestType, query) {
    if (snapshot) {
      let extendPartialModel = snapshot.type._extendPartialModel;
      if (extendPartialModel) {
        modelName = extendPartialModel;
      }
    }

    return this._super(modelName, id, snapshot, requestType, query);
  }
});
