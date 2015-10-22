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

  this.get('/rentals', function(db, request) {
    return {
      data: db.rentals.map(attrs => (
        {type: 'rentals', id: attrs.id, attributes: attrs }
      ))
    };
  });

  this.get('/rentals/:id', function(db, request) {
    let id = request.params.id;
    let rentalExtended = db.rental_extendeds.find(id);

    return {
      data: {
        type: 'rentals',
        id: id,
        attributes: rentalExtended
      }
    };
  });

  this.post('/rentals', function(db, request) {
    let attrs = JSON.parse(request.requestBody)['data'].attributes;
    let rental = db.rentals.insert({ name: attrs.name });
    let rentalExtended = db.rental_extendeds.insert(attrs);

    return {
      data: {
        type: 'rentals',
        id: rentalExtended.id,
        attributes: rentalExtended
      }
    };
  });

  this.put('/rentals/:id', function(db, request) {
    let id = request.params.id;
    let attrs = JSON.parse(request.requestBody)['data'].attributes;
    let rental = db.rentals.update(id, { name: attrs.name });
    let rentalExtended = db.rental_extendeds.update(id, attrs);

    return {
      data: {
        type: 'rentals',
        id: rentalExtended.id,
        attributes: rentalExtended
      }
    };
  });
}
