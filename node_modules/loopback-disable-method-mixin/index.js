"use strict";
/*
  based on 
    https://github.com/strongloop/loopback/issues/651
    https://gist.github.com/drmikecrowe/7ec75265fda2788e1c08249ece505a44

*/
module.exports = function mixin(app) {
  app.loopback.modelBuilder.mixins.define(
    "DisableMethods",
    require("./disableMethod")
  );
};
