define(['cUtilityUtil'], function(utils) {
    function History() {
      this.forwardStack = [];
      this.historyStack = [];
    };
    History.prototype = {
      getTimestamp:        function () {
        return (new Date()).getTime();
      },
      getHash:             function () {
        var h = window.location.hash;
        if (h.charAt(0) == "#") {
          h = h.substring(1);
        }
        return decodeURIComponent(h);
      },
      setHash:             function (h) {
        if (!h) {
          h = "";
        }
        window.location.hash = encodeURIComponent(h);
      },
      replaceHash:         function (h) {
        if (!h) {
          h = "";
        }
        // window.location.href = "#"+encodeURIComponent(h);
        location.replace("#" + encodeURIComponent(h));
      },
      handleBackButton:    function () {
        var current = this.historyStack.pop();
        var last = this.historyStack[this.historyStack.length - 1];
        this.forwardStack.push(current);
        return last;
      },
      handleForwardButton: function () {
        var last = this.forwardStack.pop();
        this.historyStack.push(last);
        return last;
      },
      addToHistory: function (args, isReplace) {

        if (isReplace) {
            if (this.historyStack.length == 0) {
                this.historyStack.push(args);
            } else {
                this.historyStack[this.historyStack.length - 1] = args;
            
            }
        } else {
            if(this.historyStack.length == 0){
                this.historyStack.push(args);
            }else{
                if(args){
                    if(this.historyStack[this.historyStack.length-1].hash==args.hash){
                
                    }else{
                        this.historyStack.push(args);
                    }
                }
            }
          
        }

      },
      /*addToHistory: function (args, isReplace) {

        if (isReplace) {
          if (this.historyStack.length == 0) {
            this.historyStack.push(args);
          } else {
            this.historyStack[this.historyStack.length - 1] = args;
          }
        } else {
          this.historyStack.push(args);
        }

      },*/
      pushState:    function pushState(data, title, url) {

        Lizard.group();
        if (Lizard.isHybrid && window.location.protocol == "file:") {
          Lizard.log('data:', JSON.stringify(data));
          Lizard.log('title:', title);
          Lizard.log('url:', url);

          var timestamp = this.getTimestamp();
          var hash = url;//+'###'+timestamp;
          this.setHash(hash);
          this.addToHistory({
            hash:  hash,
            state: data,
            title: title,
            url:   url
          }, false);


        } else {
          if (!utils.isSupportPushState) {
            Lizard.log('isSupportPushState:', utils.isSupportPushState);
            Lizard.log('data:', JSON.stringify(data));
            Lizard.log('title:', title);
            Lizard.log('url:', url);
            var isDialog = url.split("#DIALOG_")[1];//http://localhost:3000/webapp/tour/index#DIALOG_dialog1
            if (isDialog) {
              DialogMag[url] = data;
              DialogHist.unshift(data);
              location.hash = "#DIALOG_" + isDialog
            }
          } else {
            Lizard.log('data:', JSON.stringify(data));
            Lizard.log('title:', title);
            Lizard.log('url:', url);
            history.pushState(data, title, url);
          }
        }
        Lizard.groupEnd();

      },
      replaceState: function replaceState(data, title, url) {

        Lizard.group();
        if (Lizard.isHybrid && window.location.protocol == "file:") {


          Lizard.log('data:', JSON.stringify(data));
          Lizard.log('title:', title);
          Lizard.log('url:', url);

          var timestamp = this.getTimestamp();
          var hash = url;//+'###'+timestamp;
          this.replaceHash(hash);

          this.addToHistory({
            hash:  hash,
            state: data,
            title: title,
            url:   url
          }, true);


        } else {
          if (!utils.isSupportPushState) {
            Lizard.log('isSupportPushState:', utils.isSupportPushState);
          } else {
            Lizard.log('data:', JSON.stringify(data));
            Lizard.log('title:', title);
            Lizard.log('url:', url);
            history.replaceState(data, title, url);
          }
        }

        Lizard.groupEnd();
      },
      popstate:     function (scope) {
        var that = this;

        var popstateHandler = $.proxy(function (e) {            
            delete Lizard.currentUrl;            
            Lizard.log('popstate')
            //l_wang 此处操作需要调�?
            //以现在的做法，此法意义反而不大，此处有问�?
            var data = e.state || (e.originalEvent && e.originalEvent.state);
            if (Lizard.stopStateWatch || !data) {
              return;
            }            
            if (Lizard._isLoading)            
            {
              Lizard._stoploadpage = true;
            }
            else
            {
              Lizard._stoploadpage = false;
            }
            if (Lizard._stoploadpage)
            {
              var interval = setInterval(function(){
                if (!Lizard._stoploadpage)
                {
                  scope.showView(data);
                  clearInterval(interval);
                }
              }, 10);
            }
            else
            {
              if (this.curView && data.url == this.curView.$el.attr('page-url')) {
                this._waring404.hide();
                return;
              }
              this.showView(data);
            }
          },
          scope);

        var dialogHashChangeHandler = $.proxy(function (e) {
          Lizard.log('hashchange')
          e = e || {};
          Lizard.log('e:', e)
          var newURL = e.newURL;
          var oldURL = e.oldURL;
          //判断是否为dialog的的hashchange,如果不是的话，就直接跳出
          var isDialog = oldURL.split("#DIALOG_")[1] || newURL.split("#DIALOG_")[1];
          if (!isDialog)return;
          var url = location.href;
          if ((url === (DialogHist[0] && DialogHist[0].url)) && (DialogHist.length > 1)) {
            Lizard.log('We are on the right panel.');
            return true;
          } else if (location.hash === '') {
            Lizard.log('location.hash is empty');
            DialogHist.shift();
            var data = DialogHist[0];
            goBack(data);
            return true;
          } else if (DialogHist[1] && url === DialogHist[1].url) {
            Lizard.log('DialogHist[1] && url === DialogHist[1].url');
            DialogHist.shift();
            var data = DialogHist[0];
            goBack(data);
            return true;
          } else {
            // Lastly, just try going to the ID...
            if (DialogMag[url]) {
              Lizard.log('DialogMag[url] exist');
              DialogHist.unshift(DialogMag[url]);
              goBack(DialogMag[url])
            }
          }

          function goBack(data) {
            Lizard.log('hashchange goBack', data.url);
            scope.showView(data);
          }


        }, scope);

        var hybridHashChangeHandler = $.proxy(function (e) {
            delete Lizard.currentUrl;


            //如果hashchange关闭，则不处�?goto的时候this.observe=false
            /*
             逻辑�?
             调用goto打开新页面时this.observe=false，所以hashchange不执行，只有点击浏览�?
             前进后退时才执行

             */

            if (!this.observe)return false;

            //return;


            Lizard.log('hybridHashChangeHandler')

            var hsl = that.historyStack.length;
            var hash = that.getHash();
            //解决hashchange存在，但是对应的页面不存在的问题
            var data = {
              id: "newPage",
              opts:{},
              url: hash//.replace(/###\d+$/,'')
            }
            if (!hash) {
              var bookmarkAnchor = this.bookmarkAnchor;
              var href = bookmarkAnchor.href;
              if (window.location.href == href) {

                hash = decodeURIComponent(bookmarkAnchor.hash);

              }
            }


            if (that.forwardStack.length > 0) {

              if (that.forwardStack[that.forwardStack.length - 1].hash === hash) {
                var e = that.handleForwardButton();
                data = e.state;
                this.showView(data);


                if (that.historyStack.length == 1)this.bookmarkAnchor.isFirst = true;


                return;
              }
            }
            
            var hashpos = -1; 
            if (hsl >= 2)
            {
              for (var i = hsl; i >= 2; i--)
              {
                if (that.historyStack[i - 2].hash === hash)
                {
                  hashpos = i - 2;                                    
                }
              }
              if (hashpos > -1)
              {
                for (var i = hsl - 2; i >= hashpos; i--)
                {
                  e = that.handleBackButton();                   
                }
                data = e.state;
                this.showView(data);
                if (that.historyStack.length == 1) this.bookmarkAnchor.isFirst = true;
                return;
              }
            }
            //只有1对象，则代表第一个页�?
            this.showView(data);
          },
          scope);


        if (Lizard.isHybrid && window.location.protocol == "file:") {
          $(window).bind('hashchange', hybridHashChangeHandler);
        } else {
          if (!utils.isSupportPushState) {
            $(window).bind('hashchange', dialogHashChangeHandler);
          } else {
            $(window).bind('popstate', popstateHandler);
          }
        }
      }
    }
    
    return History;
});