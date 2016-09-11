import {
    StyleSheet,
    Dimensions,
    PixelRatio
} from 'react-native';

var maxWidth = function(){
  var width = Dimensions.get('window').width;
  var colInRow = 2;
  colInRow =  width > 480 ? 3 : 2;
  return  (width - (colInRow + 1 )* 10)/colInRow;
}

const styles = StyleSheet.create({
hotel_g_list:{
        backgroundColor:"#fff",
        padding:10,
        justifyContent:'center',
        flexDirection:'row'
    },
     hotel_b_border:{
        borderBottomWidth: 1 / PixelRatio.get(),
        borderColor: '#ddd',
    },
     hotel_g_text:{
        fontSize:14,
        color:'#333',
        flex:1,
            },
  whiteBg:{
        flex:1,
        backgroundColor:'#ffffff',
        alignItems:'flex-start',
        justifyContent: 'flex-start',
        borderColor:'#dddddd',
        borderTopColor:'#dddddd',
        borderTopWidth:1,
        borderBottomColor:'#dddddd',
        borderBottomWidth:1,
    },
     loginContainer:{
      height: 50,
      backgroundColor:'#ffffff',
      borderColor:'#dddddd',
      borderTopColor:'#dddddd',
      borderTopWidth:1,
      borderBottomColor:'#dddddd',
      borderBottomWidth:1,
      marginTop:10,
      flexDirection:'row',
      alignItems: 'center'
  },
  loginButton:{
        justifyContent: 'center',
        alignSelf:'center',
        marginLeft:10,
        marginRight:10,
        height:35,
        width:80,
    },

    loginTouch: {
        borderRadius:10,
        position: 'absolute',
        right:10,
        top:6,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'#fd8713',
        },

    loginTip:{
        color:'#333333',
        fontSize:15,
        justifyContent: 'center',
        alignSelf:'center',
        marginLeft:10,
        marginRight:10,
    },
  wrapper:{
    flex:1,
      backgroundColor:'#efefef',
  },
  listView:{
    flex:1,
    backgroundColor:'#efefef',

  },
  scrollView:{
    flex:1,
    marginTop:10,
  },
  top:{
    height:40,
    flex:1,
  },
  textstyle:{
   alignSelf:'flex-start',
  },

  imagWrapper:{
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    flexDirection:'row',
    backgroundColor:'#efefef',
    paddingLeft:10
  },
    positionBottom:{
    position: 'absolute',
    width: 100,
    height: 25,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor:'#00000000',
    right: 5,
    bottom: -7,
  },

  bottomText:{
    color:'#ffffff',
      backgroundColor:'#88c413',
      fontSize:9,
      right: 5,
      bottom: 0,
  },

    imageContent:{
        margin:5,
    },
  image:{
    marginTop:10,
    marginRight:10,
    marginBottom:0,
    alignSelf:'center',
    width:maxWidth(),
    height:maxWidth()*0.56,
  },
  defaultImage:{
    alignSelf:'center',
    width:54,
    height:58,
  },

  mask:{
    alignSelf:'center',
    width:maxWidth(),
    height:maxWidth()*0.56,
    backgroundColor:'#000000',
    opacity:0.5,
    position: 'absolute',
    right: 10,
    bottom: 0,
    justifyContent: 'center',
    alignItems:'center',
  },
 defaultMask:{
    alignSelf:'center',
    width:maxWidth(),
    height:maxWidth()*0.56,
    backgroundColor:'#ffffff',
    position: 'absolute',
    right: 10,
    bottom: 0,
    justifyContent: 'center',
    alignItems:'center',
  },
  maskText:{
        color:'#ffffff',

  },
  moreImg:{
    width:30,
    height:30,
    marginBottom:10,
  },
  MoreView:{
    flexDirection:'row',
    justifyContent:"center",
    alignItems:"center",
    height:30,
  },
  MoreLogoBox:{
    width:20,
    height:20,
    justifyContent:'center',
    alignItems:'center',
  },
  MoreText:{
    color:'#666'
    //alignSelf:'center',
  },
  noDataStyle:{
        flex:1,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems:'center',
        flexWrap:'nowrap',
        backgroundColor:'#efefef',
    },
    noDataImageStyle:{
        height:150,
        width:150,
        justifyContent:'center',
        alignItems:'center',

    },
    noDataMainTipStyle:{
        marginTop:5,
        justifyContent:'center',
        alignItems:'center',
        color:'#333333',
        fontSize:15,
        fontWeight: 'bold',
    },
    noDataTipStyle:{
        marginTop:5,
        justifyContent:'center',
        alignItems:'center',
        color:'#b2b2b2',
        fontSize:15,
    },
    arr:{
        marginRight : 5,
        width: 8,
        alignSelf:'center',
        height:8,
        borderTopWidth:4 / PixelRatio.get(),
        borderRightWidth:4 / PixelRatio.get(),
        borderColor:'#ddd',
        transform:[{rotate:'45deg'}]
    },

});

module.exports = styles;
