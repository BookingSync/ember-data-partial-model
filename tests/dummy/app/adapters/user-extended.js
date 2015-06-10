import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  buildURL: function(modelName, id, snapshot, requestType, query) {
    modelName = 'user';
    return this._super(modelName, id, snapshot, requestType, query);
  }
});
