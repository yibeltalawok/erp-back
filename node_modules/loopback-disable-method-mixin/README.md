# loopback-disable-method-mixin

A mixin to disable or expose a list of properties in a model.

#### based on

* https://github.com/strongloop/loopback/issues/651
* https://gist.github.com/drmikecrowe/7ec75265fda2788e1c08249ece505a44

## INSTALL

```
npm install --save loopback-disable-method-mixin
```

###### you can enable mixin by editing `server.js`:

In your server/server.js file add the following line before the boot(app, \_\_dirname); line.

```js
...
var app = module.exports = loopback();
...
// Add Disable Method Mixin to loopback
require('loopback-disable-method-mixin')(app);

boot(app, __dirname, function(err) {
  'use strict';
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
```

## CONFIG

To use with your Models add the `mixins` attribute to the definition object of your model config.

```json
{
  "name": "player",
  "mixins": {
    "DisableMethods": {
      "expose": ["find", "findById"]
    }
  },
  "properties": {
    "name": "string",
    "type": "string"
  }
}
```

#### OR

```json
{
  "name": "player",
  "mixins": {
    "DisableMethods": {
      "hide": ["find"]
    }
  },
  "properties": {
    "name": "string",
    "type": "string"
  }
}
```

## LICENSE

MIT
