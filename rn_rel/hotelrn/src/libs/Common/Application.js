'use strict';

import React, { Component } from 'react';
import{
View,
Navigator
} from 'react-native';


function parseRouters(routers){
    let map = [];
    for(let route in routers){
        map.push({
            pathname: route,
            component: routers[route]
        })
    }
    return map
}

class HotelApplication extends Component {
    render(){
        this.__routersConfig = parseRouters(this.props.routeConfig);
        return (<Navigator
            configureScene={this.configureScene}
            renderScene={this.renderScene.bind(this)}
            initialRoute={this.getDefaultRoute()}
            _webRouteStack={this.__routersConfig}/>
            )
    }
    getDefaultRoute(){
        var defaultRoute = this.props.defaultRoute;

        if(defaultRoute){
            return this.__routersConfig.find((route)=>route.pathname==defaultRoute)
        }
        return this.__routersConfig[0]
    }
    configureScene(){
        // var x = Navigator.SceneConfigs;
        var config = Navigator.SceneConfigs.HorizontalSwipeJump;
        var gestures = config.gestures;
        // debugger;
        //暂时先禁止左右滑动导航
        gestures.jumpForward=null;
        gestures.jumpBack=null;
        return config;
    }
    renderScene (route, navigator) {
        var Scene = this.props.routeConfig[route.pathname];
        return <Scene route={route} navigator={navigator} passProps={route.passProps} {...this.props}/>
    }
}
module.exports = HotelApplication;
