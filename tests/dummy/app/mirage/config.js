export default function() {
  this.namespace = '/api';

  this.get('/users');
  this.get('/users/:id', function(db, request) {
    var id = request.params.id;

    return {
      user: db.users_extended.find(id)
    };
  });
  // this.post('/users');
  // this.put('/users');
  this.put('/users/:id', function(db, request) {
    var id = request.params.id;
    var attrs = JSON.parse(request.requestBody)['user'];
    var record = db.users_extended.update(id, attrs);

    return {
      user: record
    };
  });
  // this.del('/users/:id');

}
