# Ember-data-partial-model

This addon adds support for partial records to Ember Data. Lets say your api for
`/users` returns a shallow model like:
```js
[ { id:1, name: 'BMac'}, {id:2, name:'Seb'}]
```

but `/users/1` returns a detailed model

```js
{ id:1,
  name: 'BMac'
  twitter: 'seb'
}
```

You can use this addon to define your User model as:
```js
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
let users = await store.find('user'); //goes to /users
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
