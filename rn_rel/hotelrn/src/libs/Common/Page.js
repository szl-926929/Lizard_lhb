'use strict';
import React, {
  Component,
  View,
  Platform,
  Navigator
} from 'react-native';
import HeaderView from './HeaderView';
import Viewport from './Viewport';
import UBTMixin from './UBTMixin';
var Page = React.createClass({
    mixins: [UBTMixin],
    render(){
        var defaultStyle = {flexDirection:'column',flex:1};
        // Platform.OS==='web' && (defaultStyle)
        return (
            <View style={[defaultStyle]}>
                <HeaderView {...this.props} ref="header" navigator={this.props.navigator} route={this.props.route}/>
                <Viewport style={{flex:1,position:'relative'}}>
                    {this.props.children}
                </Viewport>
            </View>
        )
    },
    componentDidMount(){
        this.header = this.refs.header;

    }
})
//
// class Page extends Component{
//     render(){
//         var defaultStyle = {flexDirection:'column',flex:1};
//         // Platform.OS==='web' && (defaultStyle)
//         return (
//             <View style={[defaultStyle]}>
//                 <HeaderView {...this.props} ref="header" navigator={this.props.navigator} route={this.props.route}/>
//                 <Viewport style={{flex:1,position:'relative'}}>
//                     {this.props.children}
//                 </Viewport>
//             </View>
//         )
//     }
//     componentDidMount(){
//         this.header = this.refs.header;
//
//     }
//     static mixins=[UBTMixin]
// }
module.exports = Page;
