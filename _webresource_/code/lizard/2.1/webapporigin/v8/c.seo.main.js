require(['cSeoUrlmapping', 'cSeoGetModels', 'cSeoRender'], function(){
  Lizard.S = function(stroename, key, defaultvalue)
  {
    return defaultvalue;
  }   
}, null, true);

// export for nodejs
if (typeof exports !== 'undefined') {
  exports.Lizard = Lizard;
  exports.LizardGetModels = LizardGetModels;
  exports.LizardRender = LizardRender;
  exports.LizardUrlMapping = LizardUrlMapping;
}