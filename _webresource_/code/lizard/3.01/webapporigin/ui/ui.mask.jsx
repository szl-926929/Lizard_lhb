/**
 * Created by bianyl on 2016/4/11.
 */
define(["react"],function(React){
  var UiMaskOBj = {
    render:function(){
      UiMaskOBj.uiMask = React.render(
        <UiMask {...UiMaskOBj}></UiMask>,document.createElement("DIV")
      );
    },
    show:function(){
      if(UiMaskOBj.uiMask && UiMaskOBj.uiMask.show){
        UiMaskOBj.uiMask.show();
      }
    },
    hide:function(){
      if(UiMaskOBj.uiMask && UiMaskOBj.uiMask.hide){
        UiMaskOBj.uiMask.hide();
      }
    },
    remove:function(){
      if(UiMaskOBj.uiMask && UiMaskOBj.uiMask.remove){
        UiMaskOBj.uiMask.remove();
      }
    }
  };
  var UiMask = React.createClass({
    rootStyle:{
      width: '100%',
      height: (Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) )+ 'px',
      position: 'absolute',
      left: '0px',
      top: '0px',
      //"zIndex":getTopZIndex(),
      "zIndex":3001,
      display:"none"
    },
    componentDidMount:function(){
      this.pDiv =  React.findDOMNode(this.refs.cUiMaskBody);
      var style = document.createElement("style");
      var cssString = '.cui-mask{z-index:2000;position:fixed;top:0;left:0;right:0;bottom:0;height:100%;width:100%;background-color:rgba(0,0,0,.5)}.cui-pop-box{background:#fff;width:280px;margin:auto;position:relative;overflow:hidden;border-radius:3px;z-index:9999}.cui-pop-box .cui-hd{height:40px;line-height:40px;font-size:1.2em;color:#fff;background:#099fde;padding:0 10px;position:relative}.cui-roller-btns{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;width:100%;-webkit-box-flex:1;-moz-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;background:#fff;border-top:1px solid #bcbcbc;line-height:18px;text-align:center;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.cui-flexbd{-webkit-box-flex:1;-moz-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.cui-roller-btns .cui-flexbd{padding:12px 0;color:#099fde}.cui-roller-btns a{color:#099fde}.cui-roller-btns .cui-flexbd:active{opacity:.75}.cui-roller-btns .cui-flexbd:nth-of-type(2){border-left:1px solid rgba(0,0,0,0.3)}';
      style.setAttribute("type", "text/css");
      var cssText = document.createTextNode(cssString);
      style.appendChild(cssText);
      this.pDiv.appendChild(style);
      document.body.appendChild(this.pDiv.parentNode);
    },
    componentWillUnmount:function(){

    },
    show:function(){
      this.pDiv.style.display = "block"
    },
    hide:function(){
      this.pDiv.style.display = "none"
    },
    remove:function(){
      if(this.pDiv){
        this.pDiv.parentNode.parentNode.remove(this.pDiv.parentNode);
      }
    },
    _init:function(){
      if(this.props.getThisObjext){
        this.props.getThisObjext.apply(this,[]);
      }
    },
    render: function() {
      this._init();
      return <div className={"view cui-mask"} style={this.rootStyle} ref="cUiMaskBody"></div>;
    }
  });

return UiMaskOBj;
});