/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

 'use strict';
 import React, {
     View,
     Text,
     Component,
     Image,
     PropTypes,
     StatusBar,
     TouchableWithoutFeedback,
     TouchableHighlight,
     Navigator
 } from 'react-native';
import styles from './skin/HeaderView';
import CropImage from './CropImage';
const NOOP = ()=>{};
var defaultActions = {
    home: function(){
        alert('back to home')
    },
    back: function(){
        this.props.navigator.pop();
    }
}

class HeaderView extends Component {
    static HOME_BUTTON = <CropImage
      source={{uri:'http://pic.c-ctrip.com/h5/common/bg-global.png', crop:{top:126,left:0,width:22, height: 22}}}
      width={240}
      height={296}
      onPress={defaultActions.home}
      />
    constructor(){
        super();
        this.state={
            title:'',
            visible: true,
            hasDropDown: false,
            hasHome:false,
            hasLeftButton: true,
            subTitle: '',
            rightButtons: []
        }
    }
    setHeader(header):void{
        this.setState(header);
    }
    _parseHeader():object{
        var props = this.props,
            header = {},
            rightButtons = props.hasHome ? [ HeaderView.HOME_BUTTON] : [];

        header.rightButtons = props.rightButtons ?
            rightButtons.concat(props.rightButtons) : rightButtons
        header.title = props.title;
        header.subTitle = props.subTitle;
        header.hasLeftButton = props.hasLeftButton===false ? false:true;
        header.onLeftButton = props.onLeftButton || defaultActions.back;
        header.onCenterButton = props.onCenterButton || NOOP;
        header.hasDropDown = props.hasDropDown;
        header.visible = props.visible===false? false : true
        header.__visualContrlStyle = header.visible ? {} : {height:0,overflow:'hidden'}
        return header;
    }
    render(){
        var self = this;
        this.state = this._parseHeader();

        // this.setHeader(this._parseHeader);
        var subTitle = this.state.subTitle ? (<Text style={[styles.headerSubTitle]}>{this.state.subTitle}</Text>) : null
        var title = this.state.hasDropDown ? (<View style={styles.titleWrap}>
                                                <TouchableWithoutFeedback onPress={this.state.onCenterButton.bind(self)} >
                                                    <Text  style={[styles.headerTitle]}>{this.state.title}</Text>
                                                </TouchableWithoutFeedback>
                                                <View style={[styles.arrowIcon,styles.dropDown]}/>
                                              </View>)
                                            : (<Text  style={[styles.headerTitle]}>{this.state.title}</Text>)
        return (<View style={[styles.header,this.state.__visualContrlStyle]}>
            <StatusBar barStyle="light-content"></StatusBar>
                 <View style={[styles.leftWrap,this.state.__visualContrlStyle]}>
                     {this.state.hasLeftButton ? <TouchableHighlight underlayColor="#099fde" style={{width:50,height: 44,paddingTop:15}} onPress={this.state.onLeftButton.bind(self)} ><View style={[styles.arrowIcon,styles.leftButton]}/></TouchableHighlight> : null}
                 </View>
                 <View style={[styles.midWrap]}>
                     {title}
                     {subTitle}
                 </View>
                 <View style={[styles.rightWrap]}>
                    {
                        this.state.rightButtons.map((button)=>{
                            return React.cloneElement(button,{key: 'right_button'+(+new Date)+(Math.random())})
                        })
                    }
                 </View>
             </View>)
    }
    appendRightButtons(buttons: Array<PropTypes.View>, reverse:?bool){
        var originButtons = this.state.rightButtons;

        originButtons.push(buttons);
        this.setState({
            rightButtons: originButtons
        })
    }
}
module.exports = HeaderView
