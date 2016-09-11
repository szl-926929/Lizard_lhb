'use strict';
import React, {
  Component,
  View
} from 'react-native';
class Viewport extends Component {
    render(){
        return (
            <View id="main" {...this.props}>
            </View>
        )
    }
}
module.exports = Viewport;
