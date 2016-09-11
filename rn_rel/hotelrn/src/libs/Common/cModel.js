var cModel = require('../Lib/cModel');
var Model={}
class hotelModel extends cModel{

}
Model.HotelAskUnReplyList=hotelModel.createModel({
    url:"/getrecommendhotelasklist",
    param:{"setInfo":{"cityId":0,"membertype":"","start":1},"alliance":{"ishybrid":0}},
    externalService : true
});
Model.MyHotelOurCouponNum = cModel.createModel({
    url:"/customer/hotelusercouponsearch",
    param:{
        flag:1,
        sort: {
            idx: 1,
            size: 2,
            status:0,
            order: 0
        }
    },
    serviceCode : '10934',
    isUserData: true
    });


module.exports = Model;
