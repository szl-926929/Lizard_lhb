import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import App from './routes/AppHotel';
import ErrorUtils from 'ErrorUtils';
import {warn} from './libs/log';

AppRegistry.registerComponent('hotelrn', () => App);
