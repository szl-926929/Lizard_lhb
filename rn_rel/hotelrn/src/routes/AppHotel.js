import React, {Component} from 'react';
import {
  App
} from '@ctrip/crn';
import {Provider} from 'react-redux';

import Myhotel from './myhotel';
import MyPicture from './mypicture/myhotelImgaeListInfo'
import PictureList from './mypicture/myhotelImageList';

import configureStore from '../store/configureStore';
var store = configureStore();

class AppWithContext extends App {
    constructor(props){
      super(props);
    }

    static childContextTypes = {
      navigation: React.PropTypes.func,
    }

    getChildContext() {
       return {
         navigation: ()=>this.navigation,
       };
    }


}

export default class AppHotel extends Component {
  render() {
  	 const pages = [
      {
        component:Myhotel,
        name:"/myhotel",
        title:'我的酒店',
        isInitialPage:true

      },
      {
        component:MyPicture,
        name:"/mypicture",
        title:'我的图片'
      },
      {
        component:PictureList,
        name:"/mypictureList",

      },
    ];

    return  (
      <Provider store={store}>
       <AppWithContext pages = {pages} urlQuery={this.props.urlQuery} />
      </Provider>)
  }
}
