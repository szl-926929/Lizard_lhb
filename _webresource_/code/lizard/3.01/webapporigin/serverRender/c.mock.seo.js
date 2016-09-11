/**
 * Created by kjmao on 2016/6/7.
 */
window=this;
window.addEventListener=function(){return {};};
window.removeEventListener=function(){return {};};

location={
    path:""
};

navigator={};
document={
    body:{
        clientWidth:"480",
        appendChild:function(){return {};}
    },
    head:{
        appendChild:function(){return {};}
    },
    documentElement:{
        clientHeight:960
    },
    createElement :function(s){return React.createElement(s,{});},
    removeElement:function(){return {};},
getElementsByTagName:function(){return {};},
getElementById:function(){return {};}
};


Lizard={
    P:function(){return ""; },
    S:function(){return "";}
};