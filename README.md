# pokemon-go-api

> The unofficial Pokemon Go API.

### Supported methods

1. `.login(username, password, type)`
1. `.location.set('address', address)`
1. `.location.set('coordinates', latitude, longitude)`

### Code Examples

#### Login with Google

```
const api = require('pokemon-go-api');

api.login('username', 'password', 'google')
  .then(function(token) {
    console.log('Token:', token);
  })
  .catch(function(error) {
    console.log('Error:', error.stack);
  });
```

#### Login with Pokemon Club

```
const api = require('pokemon-go-api');

api.login('username', 'password', 'pokemon-club')
  .then(function(token) {
    console.log('Token:', token);
  })
  .catch(function(error) {
    console.log('Error:', error.stack);
  });
```

#### Set the player's location using an address

```
const api = require('pokemon-go-api');

api.location.set('address', 'some address here')
  .then(function(location) {
    console.log('Location:', location);
  })
  .catch(function(error) {
    console.log('Error:', error.stack);
  });
```

#### Set the player's location using coordinates

```
const api = require('pokemon-go-api');

api.location.set('coordinates', latitude, longitude)
  .then(function(location) {
    console.log('Location:', location);
  })
  .catch(function(error) {
    console.log('Error:', error.stack);
  });
```
