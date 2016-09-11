/**
 * Created by lihua on 15/7/8.
 */
define([], function(){

  var Upload = function(input, canvas, canvasWidth, canvasHeight){
    this.input = $(input);
    this.canvas = $(canvas)[0];
    this.context = this.canvas.getContext("2d");
    this.reader = new FileReader();
    this.image = new Image();
    this.originSize = 0;

    var that = this;
    //文件内容读取
    //初始化监听事件，减少不必要的绑定，减少内存垃圾事件栈
    this.reader.onload = function(e){
      that.image.onload = function(){
        if(typeof canvasWidth === 'undefined'){
          canvasWidth = 200;
        }
        if(typeof canvasHeight === 'undefined'){
          canvasHeight = 200;
        }
        var size = Upload._getRealWH(that.image.width, that.image.height, canvasWidth, canvasHeight);
        var showWidth = size.width;
        var showHeight = size.height;

        that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
        that.canvas.width = showWidth;
        that.canvas.height = showHeight;
        that.context.drawImage(that.image, 0, 0, showWidth, showHeight);
      };
      that.image.setAttribute('src', e.target.result);
    };
  };

  //根据宽高比例进行缩放
  //@width: 图片宽度
  //@height: 图片高度
  //@maxWidth: 目标最大宽度
  //@maxHeight: 目标最大高度
  Upload._getRealWH = function(width, height, maxWidth, maxHeight){
    var showWidth = width;
    var showHeight = height;
    //宽与高的比例
    var rate = width / height;
    //如果宽更大，则按照宽缩放
    if(rate > 1){
      //如果图片宽高小于容器宽度，则放大
      if(width < maxWidth){
        showWidth = width;
        showHeight = height;
      }else{
        //如果图片宽高大于容器宽度，则缩小
        showWidth = maxWidth;
        showHeight = showWidth / rate;
      }
    }else{
      //如果高更大，则按照高缩放
      //如果图片高度小于容器高度，则放大
      if(height < maxHeight){
        showWidth = width;
        showHeight = height;
      }else{
        //如果图片高度大于容器宽度，则缩小
        showHeight = maxHeight;
        showWidth = showHeight * rate;
      }
    }
    return {
      width: showWidth,
      height: showHeight
    };
  };

  //展示图片
  Upload.prototype['showImage'] = function(){
    var that = this;
    that.input.on('change', function(){
      var input = this;
      if (input.files && input.files[0]) {
        var file = input.files[0];
        if(file.type && !/image/i.test(file.type)){
          return false;
        }
        that.reader.readAsDataURL(file);
        that.originSize = file.size/1024;
        return file;
      }
    });
  };

  //压缩图片
  Upload.prototype['compressImage'] = function(opts){
    var width = opts.width || 200; //压缩完成图片最大尺寸
    var height = opts.height || 200; //压缩完成最大高度
    var quality = opts.quality || 1;//压缩质量
    var type = opts.type || 'jpeg'; //图片的类型

    var size = Upload._getRealWH(this.image.width, this.image.height, width, height);
    var showWidth = size.width;
    var showHeight = size.height;
    var src = ''; //base64

    //后台运行，不影响界面的canvas重新渲染，表示用户不愿意看到图像变化，只是后台进行压缩
    if(opts.bgRun && opts.bgRun === true){
      var bgCanvas = document.createElement('canvas');
      var bgContext = bgCanvas.getContext('2d');
      bgContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      bgCanvas.width = showWidth;
      bgCanvas.height = showHeight;
      bgContext.drawImage(this.image, 0, 0, showWidth, showHeight);
      src = bgCanvas.toDataURL('image/' + type, quality);
    }else{
      //当前canvas渲染
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.width = showWidth;
      this.canvas.height = showHeight;
      this.context.drawImage(this.image, 0, 0, showWidth, showHeight);
      src = this.canvas.toDataURL('image/' + type, quality);
    }

    var obj = {
      originWidth: this.image.width,      //原始宽度
      originHeight: this.image.height,    //原始高度
      distWidth: showWidth,               //目标宽度
      distHeight: showHeight,             //目标宽度
      originSize: parseInt(this.originSize),//原始尺寸
      distSize: parseInt(src.length/1024), //压缩后尺寸
      rate: (this.originSize - (src.length/1024))/this.originSize,//压缩率
      src: src, //可以在浏览器中打开的base64
      base64: src.replace(/^data:image\/\w+;base64,/, "") //图片的base64
    };
    return obj;
  };

  return Upload;
});
