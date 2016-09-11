/**
 * Created by bianyl on 2016/4/11.
 *   UiAlertObj.init({
 *   title:"uiAlert Test",
 *   content:"测试测试测试",
 *   btns:[{name:'ok',className:'cui-btns-ok'},{name:'cancle',className:'cui-btns-cancel'}],
 *   okAction:function(){console.log("ok");},
 *   cancleAction:function(){console.log("cancle");}
 * });
 *UiAlertObj.render();
 */
define(["UIMask","react"],function(UIMask,React){
  //首先在body中创建一个根节点
  var UiAlertObj = {
    title: "",
    content: 'content',
    needMask:true,
    btns: [{name:'知道了',className:'cui-btns-ok'}],

    init:function(options){
      for(var pro in options){
        UiAlertObj[pro] = options[pro];
      }
    },
    reSet:function(options){
      this.init(options);
    },
    render:function(){
      if(this.delete){
        this.delete();
      }
      if(this.needMask){
        UIMask.render();
      }
      //UiAlertObj.zIndex = getTopZIndex();
      UiAlertObj.zIndex = 3002;
      var contentDoom = document.createElement("DIV");
      if(this.id){
        contentDoom = document.getElementById(this.id);
      }
      UiAlertObj.uiAlert = React.render(
        <UiAlert refs = "uialert" {...UiAlertObj} ></UiAlert>,contentDoom
      );
    },
    show:function(){
      if(this.needMask){
        UIMask.show();
      }
      if(UiAlertObj.uiAlert &&  UiAlertObj.uiAlert.show){
        UiAlertObj.uiAlert.show();
      }
    },
    hide:function(){
      if(this.needMask){
        UIMask.hide();
      }
      if(UiAlertObj.uiAlert && UiAlertObj.uiAlert.hide){
        UiAlertObj.uiAlert.hide();
      }
    },
    remove:function(){
      if(this.needMask){
        UIMask.remove();
      }
      if(UiAlertObj.uiAlert && UiAlertObj.uiAlert.hide){
        UiAlertObj.uiAlert.remove();
      }
    }
  };
  var UiAlert = React.createClass({
    getInitialState:function(){
      return {
        display:{display:"none"}
      }
    },
    componentDidMount:function(){
      this.pDiv =  React.findDOMNode(this.refs.uiAlertBody);
      var style = document.createElement("style");
      var cssString = 'html,body{height:100%;background-color:#fff;margin:0;padding:0;overflow-x:hidden}.cui-pop-box{background:#fff;width:280px;margin:auto;position:relative;overflow:hidden;border-radius:3px;z-index:9999}.cui-pop-box .cui-hd{height:40px;line-height:40px;font-size:1.2em;color:#fff;background:#099fde;padding:0 10px;position:relative}.cui-roller-btns{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;width:100%;-webkit-box-flex:1;-moz-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;background:#fff;border-top:1px solid #bcbcbc;line-height:18px;text-align:center;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.cui-flexbd{-webkit-box-flex:1;-moz-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.cui-roller-btns .cui-flexbd{padding:12px 0;color:#099fde}.cui-roller-btns a{color:#099fde}.cui-roller-btns .cui-flexbd:active{opacity:.75}.cui-roller-btns .cui-flexbd:nth-of-type(2){border-left:1px solid rgba(0,0,0,0.3)}.cui-error-tips{color:#000;padding:20px;text-align:center}.cui-pop-box .cui-hd .lab-close-area{position:absolute;width:50px;height:100%;right:0;top:0}.cui-pop-box .cui-hd .cui-top-close{width:40px;height:40px;float:right;line-height:40px;color:transparent;text-align:center;font-weight:700;position:relative}.cui-pop-box .cui-hd .cui-top-close:before,.cui-pop-box .cui-hd .cui-top-close:after{width:2px;height:16px;position:absolute;left:50%;top:50%;margin:-8px 0 0 -1px;background:#fff;content:""}.cui-pop-box .cui-hd .cui-top-close:before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.cui-pop-box .cui-hd .cui-top-close:after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);transform:rotate(-45deg)}.cui-layer{position:fixed;left:50%;top:50%;z-index:2100;border-radius:10px;padding:5px}';
      style.setAttribute("type", "text/css");
      var cssText = document.createTextNode(cssString);
      style.appendChild(cssText);
      this.pDiv.appendChild(style);
      if(!this.props.id){
        //如果没有传节点的话，默认append到body上
        //this.pDiv.parentNode.style["zIndex"] = 3003;
        document.body.appendChild(this.pDiv.parentNode);
      }
    },
    componentDidUpdate:function(){
      var height = this.pDiv.clientHeight;
      var width = this.pDiv.clientWidth;
      this.pDiv.style["z-index"] = this.props.zIndex;
      this.pDiv.style['margin-left'] = -(width / 2) + 'px';
      this.pDiv.style['margin-top'] = -(height / 2) + 'px';
    },

    hide:function(){
      this.setState({display:{display:"none"}});
    },
    show:function(){
      this.setState({display:{display:"block"}});
    },
    remove:function(){
      if(this.pDiv){
        this.pDiv.parentNode.parentNode.remove(this.pDiv.parentNode);
      }
    },
    _okAction:function(){
      this.hide();
      if(typeof this.props.okAction == 'function'){
        this.props.okAction();
      }
    },
    _cancleAction:function(){
      this.hide();
      if(typeof this.props.cancleAction == 'function'){
        this.props.cancleAction();
      }
    },
    _init:function(){
      this.props.title = this.props.title || "";
      this.props.content = this.props.content || "";
      if(this.props.btns && this.props.btns.length){
        this.props.btns = this.props.btns;
      }
      if(this.props._getThisObjext){
        this.props._getThisObjext.apply(this,[]);
      }
    },
    render: function() {
      this._init();
      var title,btns = [];
      if(this.props.title){ title = <div className = {"cui-hd"}> { this.props.title } </div> }
      for(var i = 0,len = this.props.btns.length ;i < len; i++){
        var tempClassName = this.props.btns[i].className;
        var name = this.props.btns[i].name;
        var action;
        if(tempClassName == "cui-btns-ok"){ action = this._okAction;}
        if(tempClassName == "cui-btns-cancel"){action = this._cancleAction;}
        btns .push(<div className={"cui-flexbd " + tempClassName} onClick={action}> { name }</div>);
      }
      return <div className={"view cui-layer"} style={this.state.display} ref="uiAlertBody">
        <div className={"cui-pop-box"} >
          {title}
          <div className = {"cui-bd"}>
            <div className = {"cui-error-tips"}>
                {this.props.content}
            </div>
            <div className={"cui-roller-btns"}>
             {btns}
            </div>
          </div>
        </div>
      </div>;
    }
  });
  return UiAlertObj;
});