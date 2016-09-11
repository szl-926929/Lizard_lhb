/**
 * Created by Cami on 8/31/15.
 */
define(['UIView', getAppUITemplatePath('ui.upload.img')], function(UIView, template) {

  return _.inherit(UIView, {
    propertys: function ($super) {
      $super();

      this.template = template;
      this.datamodel = {
        isPreview: false,
        canvasFn: function() {
          return "<canvas class='ui-upload-canvas'></canvas>";
        },
        fileFn: function() {
          return "<input type='file' multiple accept='image/*' class='ui-upload-file nofastclick' style='cursor: pointer;opacity: 0;position: absolute;top: 0px;left: 0;right: 0;'>";
        },
        buttonFn: function() {
          return "<input type='button' style='background: #ff9a14;color: #ffffff;' value='选择文件'/>";
        }
      };
      this.base64Str = "";
      this.events = {
        'change .ui-upload-file': 'uploadAction'
      };
    },
    _detectVerticalSquash: function(img) {
      if(/png$/i.test(img.src)) {
        return 1;
      }
      var iw = img.naturalWidth, ih = img.naturalHeight;
      var canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = ih;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      var data = ctx.getImageData(0, 0, 1, ih).data;
      var sy = 0;
      var ey = ih;
      var py = ih;
      while (py > sy) {
        var alpha = data[(py - 1) * 4 + 3];
        if (alpha === 0) {
          ey = py;
        } else {
          sy = py;
        }
        py = (ey + sy) >> 1;
      }
      var ratio = (py / ih);
      return (ratio===0) ? 1 : ratio;
    },
    _compressImg: function(img) {
      // 使用canvas对大图片进行压缩
      var width = img.width,
        height = img.height,
        canvas = document.createElement('canvas'), // 用于压缩图片的canvas
        ctx = canvas.getContext('2d'),
        ratio = 1,
        tcanvas = document.createElement("canvas"),// 瓦片canvas
        tctx = tcanvas.getContext("2d");

      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      if ((ratio = width * height / 4000000) > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      }
      // 铺底色
      ctx.fillStyle = "#ffffff";
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);


      // 图片像素大于1000000，则分瓦片机制
      var count;
      if((count = width * height / 1000000) > 1 && !Boolean(navigator.userAgent.match(/OS [5-9]_\d[_\d]* like Mac OS X/i))) {

        //计算要分成多少块瓦片
        count = ~~(Math.sqrt(count) + 1);

        // 计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);

        tcanvas.width = nw;
        tcanvas.height = nh;

        for (var i = 0; i < count; i++) {
          for (var j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio , 0 , 0, nw, nh);

            ctx.drawImage(tcanvas, i * nw, j * nh, nw, nh);
          }
        }
      }
      else if(Boolean(navigator.userAgent.match(/OS [5-9]_\d[_\d]* like Mac OS X/i))) {
        // ios7下需要重新计算ratio
        ratio = 1 / this._detectVerticalSquash(img);
        ctx.drawImage(img, 0, 0, width, ratio * height);
      }
      else{
        ctx.drawImage(img, 0, 0, width, height);
      }

      //进行最小压缩
      var ndata = canvas.toDataURL('image/jpeg', this.datamodel.quality);

      tcanvas.width = tcanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    _uploadData: function(data) {
      this.datamodel.ajax.data = JSON.stringify({
        base64Str: data
      });

      $.ajax(this.datamodel.ajax);
    },
    _initCanvas: function(input) {
      var self = this,
        file = input[0].files;

      if (file.length > self.datamodel.maxAmount) {
        Lizard.showMessage("每次最多只可上传"+ self.datamodel.maxAmount +"张图片");
        return false;
      }

      $.each(file, function(index, item) {
        if (!/\/(?:jpeg|png|gif|jpg)/i.test(item.type)) {
          Lizard.showMessage("不支持该图片格式，请重新上传");
          return false;
        }

        var reader = new FileReader(),
          canvas = document.createElement('canvas'),
          context = canvas.getContext('2d');

        self.base64Str = "";
        reader.onload = function() {
          var image = new Image();
          image.src = this.result;

          if(this.result.length > self.datamodel.maxSize) {
            // 图片大小超过maxsize就压缩
            image.onload = function() {
              var strData = self._compressImg(image).replace(/^data:image\/(jpeg);base64,/, "");

              if(self.datamodel.packageUpload) {
                self.base64Str += strData + ',';
                if(index === file.length - 1) {
                  self._uploadData(self.base64Str);
                }
              }else {
                self._uploadData(strData);
              }
            };
          }else {
            self._uploadData(this.result);
          }
        };
        reader.readAsDataURL(item);
      });
    },
    uploadAction: function() {
      this._initCanvas(this.$el.find('.ui-upload-file'), this.datamodel.maxSize);
    },
    initialize: function ($super, opts) {
      $super(opts);
    }
  });
});
