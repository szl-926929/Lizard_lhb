import { combineReducers } from 'redux';
import commentBrief from './commentBrief';
import askBrief from './askBrief';
import mypic from './mypic';
import myfavorite from './myfavorite';
import mycoupon from './mycoupon';
import myRewards from './myRewards';

export default combineReducers({
  commentBrief,
  askBrief,
  mypic,
  myfavorite,
  mycoupon,
  myRewards,
});
