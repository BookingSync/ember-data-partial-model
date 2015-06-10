import DS from 'ember-data';
import PartialModelStore from 'ember-data-partial-model/mixins/store';
const { Store } = DS;

export default Store.extend(PartialModelStore, {});
