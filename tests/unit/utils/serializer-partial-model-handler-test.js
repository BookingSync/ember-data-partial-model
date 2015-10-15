import {
  module,
  test
} from 'qunit';

import Ember from 'ember';

import partialModelHandler from 'ember-data-partial-model/utils/serializer-partial-model-handler';
const { normalizeEachPartialRelationship, serializeEachPartialRelationship } = partialModelHandler;

var app, store;

module('utils/serializer-partial-model-handler');

test('normalizeEachPartialRelationship normalizes partial relationships based on specified strategy passing modelClass' +
', hash, descriptor from caller as arguments and this as passed context', function(assert) {
  let someDescriptor = { name: 'someName' };
  let modelClassStubForPartialModel = {
    _partialDescriptors: function() {
      return [someDescriptor];
    }
  };
  let someHash = { some_prop: 'value' };
  let someContext = this;

  let calledModelClass = null;
  let calledHash = null;
  let calledDescriptor = null;
  let calledContext = null;

  let normalizePartialRelationshipStrategy = function(modelClass, hash, descriptor) {
    calledModelClass = modelClass;
    calledHash = hash;
    calledDescriptor = descriptor;
    calledContext = this;
  };

  normalizeEachPartialRelationship(modelClassStubForPartialModel, someHash, this, normalizePartialRelationshipStrategy);

  assert.deepEqual(calledModelClass, modelClassStubForPartialModel);
  assert.deepEqual(calledHash, someHash);
  assert.deepEqual(calledDescriptor, someDescriptor);
  assert.deepEqual(calledContext, this);

  modelClassStubForPartialModel = {
    type: {
      _partialDescriptors: function() {
        return [someDescriptor];
      }
    }
  };

  calledModelClass = null;
  calledHash = null;
  calledDescriptor = null;
  calledContext = null;

  normalizeEachPartialRelationship(modelClassStubForPartialModel, someHash, this, normalizePartialRelationshipStrategy);

  assert.deepEqual(calledModelClass, modelClassStubForPartialModel);
  assert.deepEqual(calledHash, someHash);
  assert.deepEqual(calledDescriptor, someDescriptor);
  assert.deepEqual(calledContext, this);
});

test('normalizeEachPartialRelationship does not blow up when there are no partial descriptors', function(assert) {
  let someDescriptor = { name: 'someName' };
  let modelClassStubForPartialModel = {};
  let someHash = { some_prop: 'value' };

  let calledModelClass = null;
  let calledHash = null;
  let calledDescriptor = null;
  let calledContext = null;

  let normalizePartialRelationshipStrategy = function(modelClass, hash, descriptor) {
    calledModelClass = modelClass;
    calledHash = hash;
    calledDescriptor = descriptor;
    calledContext = this;
  };

  normalizeEachPartialRelationship(modelClassStubForPartialModel, someHash, this, normalizePartialRelationshipStrategy);

  assert.deepEqual(calledModelClass, null);
  assert.deepEqual(calledHash, null);
  assert.deepEqual(calledDescriptor, null);
  assert.deepEqual(calledContext, null);
});

test('serializeEachPartialRelationship calls copyAttributesFromPartialToParentStrategy with passed hash,serialized partial model' +
  'and this as passed context', function(assert) {
  let someDescriptor = { key: 'someName' };
  let serializerPartial = { name: 'serialized' };
  let partialStub = {
    record: {
      serialize: function() {
        return serializerPartial;
      }
    }
  };
  let someHash = {};

  let snapshotStub = {
    belongsTo: function(key) {
      if (key === 'someName') {
        return partialStub;
      }
    },
    type: {
      _partialDescriptors: function() {
        return [someDescriptor];
      }
    }
  };

  let calledHashFromCopyingAttributes = null;
  let calledPartialData = null;
  let calledContext = null;

  let copyAttributesFromPartialToParentStrategy = function(hash, partialData) {
    calledHashFromCopyingAttributes = hash;
    calledPartialData = partialData;
    calledContext = this;
  };

  serializeEachPartialRelationship(snapshotStub, someHash, this, copyAttributesFromPartialToParentStrategy);

  assert.deepEqual(calledHashFromCopyingAttributes, someHash);
  assert.deepEqual(calledPartialData, serializerPartial);
  assert.deepEqual(calledContext, this);
});

test('serializeEachPartialRelationship does not blow up when there are no partial descriptors', function(assert) {
  let someDescriptor = { key: 'someName' };
  let serializerPartial = { name: 'serialized' };
  let partialStub = {
    record: {
      serialize: function() {
        return serializerPartial;
      }
    }
  };
  let someHash = {};

  let snapshotStub = {
    belongsTo: function(key) {
      if (key === 'someName') {
        return partialStub;
      }
    }
  };

  let calledHashFromCopyingAttributes = null;
  let calledPartialData = null;
  let calledContext = null;

  let copyAttributesFromPartialToParentStrategy = function(hash, partialData) {
    calledHashFromCopyingAttributes = hash;
    calledPartialData = partialData;
    calledContext = this;
  };

  serializeEachPartialRelationship(snapshotStub, someHash, this, copyAttributesFromPartialToParentStrategy);

  assert.deepEqual(calledHashFromCopyingAttributes, null);
  assert.deepEqual(calledPartialData, null);
  assert.deepEqual(calledContext, null);
});
