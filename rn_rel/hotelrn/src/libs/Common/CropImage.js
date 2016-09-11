'use strict';
import React, { Component } from 'react';
import ReactN,{
    View,
    Image
} from 'react-native'

var CropImage = React.createClass({
    render() {
        let source = this.props.source;
        let crop = this.props.crop || source.crop;
        return (
            <View style={[{
            overflow: 'hidden',
            height: crop.height,
            width: crop.width,
            backgroundColor: 'red'//'transparent'
            }, this.props.style]}>
                <Image  onPress={this.clickHandler} style={{
                  marginTop: crop.top * -1,
                  marginLeft: crop.left * -1,
                  width: this.props.width,
                  height: this.props.height
                }} source={this.props.source} resizeMode='contain'>
                  {this.props.children}
                </Image>
            </View>
        );
    }
});

module.exports = CropImage;
