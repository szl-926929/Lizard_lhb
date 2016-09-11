define(function(){
  var DomUtil = {
    _getClasslist: function(el) {
      return el.className.split(/\s+/);
    },
    
    hasClass: function(el, className) {      
      return (_.indexOf(DomUtil._getClasslist(el), className) > -1);
    },
    
    addClass: function(el, className) {
      var classlist = DomUtil._getClasslist(el);
      if (_.indexOf(classlist, className) > -1) {
        return;
      } else {
        classlist.push(className);
        el.className = classlist.join(' ');
      }
    },
    
    removeClass: function(el, className) {
      var classlist = DomUtil._getClasslist(el);
      if (_.indexOf(classlist, className) === -1) {
        return;
      } else {
        classlist = _.reject(classlist, function(item) {
          return item === className;
        });
        el.className = classlist.join(' ');
      }
    }
  };
  
  return DomUtil;
});