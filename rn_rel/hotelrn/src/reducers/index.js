import { combineReducers } from 'redux';
import myhotel from './myhotel';
import abtest from './abtest';
import userinfo from './userinfo';


export default combineReducers({
   myhotel,
   abtest,
   userinfo,
});
