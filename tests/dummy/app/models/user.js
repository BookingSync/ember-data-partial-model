import { PartialModel, partial } from './partial-model';
const { attr } = DS;

export default PartialModel.extend({
  name: attr(),
  extended: partial('user', 'extended', {
    twitter: attr()
  })
});
