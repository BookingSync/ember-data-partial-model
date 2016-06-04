# Ember-data-partial-model

This addon adds support for partial records to Ember Data. Let's say your api for
`/users` returns a shallow model like:
```js
[{id:1, name: 'BMac'}, {id:2, name:'Seb'}]
```

but `/users/1` returns a detailed model

```js
{
  id:1,
  name: 'BMac'
  twitter: 'seb'
}
```

You can use this addon to define your User model as:
```js
// app/models/user.js

import { PartialModel, partial } from 'ember-data-partial-model/utils/model';
const { attr } = DS;

export default PartialModel.extend({
  name: attr(),
  extended: partial('user', 'extended', {
    twitter: attr()
  })
});
```

This addon will modify your application adapter/serializer, so that accessing `user.get('extended')`
or any of the extended properties will trigger a request for the detailed model.
For example:

```js
let users = await store.findAll('user'); // goes to /users
let user = users.objectAt(1);

user.get('extended') //goes to /users/1, returns a promise
user.get('twitter') //goes to /users/1, but is just an alias, so returns null initially, should not do in app code
```

Thus you are safe from race conditions when rendering users, even if you have not loaded the full user
In your template you can do
```js
{{user.twitter}}
```
and it will populate once the full user is loaded

## Introduction Video

[![Introduction to Ember Data Partial Model](https://i.vimeocdn.com/video/564803264_640x400.jpg)](https://vimeo.com/162329720)

## How to use
If you haven't customized any of your adapters, serializers or store, the addon will work out of the box. By default it uses JSONAPISerializer and JSONAPIAdapter.

If you made any customization, you will need to include proper mixins. For adapter:

```js
// app/adapters/application.js

import DS from 'ember-data';
import PartialModelAdapter from 'ember-data-partial-model/mixins/adapter';
const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend(PartialModelAdapter);

```

For serializer (both JSONAPISerializer and RESTSerializer are available):


```js
// app/serializers/application.js

import DS from 'ember-data';
import PartialModelJSONAPISerializer from 'ember-data-partial-model/mixins/jsonapi-serializer';
const { JSONAPISerializer } = DS;

export default JSONAPISerializer.extend(PartialModelJSONAPISerializer);
```

or

```js
// app/serializers/application.js

import DS from 'ember-data';
import PartialModelRESTSerializer from 'ember-data-partial-model/mixins/rest-serializer';
const { RESTSerializer } = DS;

export default RESTSerializer.extend(PartialModelRESTSerializer);
```


For store:

```js
// app/services/store.js

import DS from 'ember-data';
import PartialModelStore from 'ember-data-partial-model/mixins/store';
const { Store } = DS;

export default Store.extend(PartialModelStore, {});
```

## Supporting custom serializers
If you are using different serializer than REST or JSONAPI, you can create custom mixin to support it, you will just need to provide some functions for handling logic specific to your serializer. The basic layout is the following:

```js
import Ember from 'ember';
import baseSerializerMixin from 'ember-data-partial-model/mixins/base-serializer';
const { Mixin } = Ember;

export default Mixin.create(baseSerializerMixin, {
  _normalizePartialRelationship: function(modelClass, resourceHash, descriptor) {
    // add this function to handle normalization of partial extension as a relationship.
  },

  _copyAttributesFromPartialToParent: function(serializedHash, partialHash) {
    // add this function to handle copying attributes from partial extension to top-level hash.
  },
});
```


## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
