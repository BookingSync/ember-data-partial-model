export default function() {
  this.namespace = '/api';

  this.get('/users');
  this.get('/users/:id', function(db, request) {
    let id = request.params.id;
    let userExtended = db.user_extendeds.find(id);

    return {
      user: userExtended
    };
  });

  this.post('/users', function(db, request) {
    let attrs = JSON.parse(request.requestBody)['user'];
    let user = db.users.insert({ name: attrs.name });
    let userExtended = db.user_extendeds.insert(attrs);

    return {
      user: userExtended
    };
  });

  this.put('/users/:id', function(db, request) {
    let id = request.params.id;
    let attrs = JSON.parse(request.requestBody)['user'];
    let user = db.users.update(id, { name: attrs.name });
    let userExtended = db.user_extendeds.update(id, attrs);

    return {
      user: userExtended
    };
  });
}
