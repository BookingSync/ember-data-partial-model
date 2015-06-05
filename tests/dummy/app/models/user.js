import {PartialModel, extended} from './partial-model';

export default PartialModel.extend({
  name: DS.attr(),
  extended: extended({
    twitter: DS.attr()
  }),
});
