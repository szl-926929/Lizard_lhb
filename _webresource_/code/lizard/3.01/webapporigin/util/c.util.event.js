define(function () {
  var handler_map = {};
  var EventUtil = {
    addHandler : function (element, type, handler) {
      if (element.addEventListener) {
        element.addEventListener(type, handler, false);
      } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
      } else {
        element["on" + type] = handler;
      }
      if (!handler_map[element]) {
        handler_map[element] = {};
      }
      if (!handler_map[element][type]) {
        handler_map[element][type] = [];
      }
      handler_map[element][type].push(handler);
    },

    removeHandler : function (element, type, handler) {
      if (handler_map[element] && handler_map[element][type]) {
        handler_map[element][type] = _.reject(handler_map[element][type], function(item){
          return item === handler;
        });
      }
      if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
      } else if (element.detachEvent) {
        element.detachEvent("on" + type, handler);
      } else {
        element["on" + type] = null;
      }
    },
    
    removeHandlers : function (element, type) {
      if (handler_map[element] && handler_map[element][type]) {
        _.each(handler_map[element][type], function(handler){
          EventUtil.removeHandler(element, type, handler);
        });
        handler_map[element][type] = [];
      }
    },

    getEvent : function (event) {
      return event ? event : window.event;
    },
    getTarget : function (event) {
      return event.target || event.srcElement;
    },
    preventDefault : function (event) {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    },
    stopPropagation : function (event) {
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubbles = true;
      }
    },
    getRelatedTarget : function (event) {
      if (event.relatedTarger) {
        return event.relatedTarget;
      } else if (event.toElement) {
        return event.toElement;
      } else if (event.fromElement) {
        return event.fromElement;
      } else {
        return null;
      }

    }
  };
  
  return EventUtil;
});
