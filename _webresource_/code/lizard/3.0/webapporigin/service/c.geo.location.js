define(['cWebGeolocation', ((Lizard.app.code.is('MASTER') || Lizard.app.code.is('YOUTH') || Lizard.isHybrid) ? 'cHybridGeolocation' : '')], function (cWebGeolocation, cHybridGeolocation) {
  return (_.isUndefined(cHybridGeolocation)?cWebGeolocation:_.extend(cWebGeolocation, cHybridGeolocation));
});