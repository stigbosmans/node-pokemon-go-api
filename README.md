# pokemon-go-api

> The unofficial Pokemon Go API.

### Supported methods

1. `.login(username, password, type)`
  1. `username` - string representing the username
  1. `password` - string representing the password
  1. `type` - either `google` or `pokemon-club`.
1. `.location.set('address', address)`
1. `.location.set('coordinates', latitude, longitude)`

### Example Usage

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
