/**
 * 携程前端框架打包脚本
 * @auther shbzhang@ctrip.com
 */
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    PROJECT_DIR: "<%= pkg.root_dir %>/<%= pkg.Default_Src_Path %>/<%= pkg.Default_Src_Branch %>",
    TEMP_DIR   : "TEMP",
    //打包文件配置
    config     : {
      PROJECT_DIR         : "<%= ROOT_DIR%><%= LIZARD_VERSION %>",
      SRC_DIR             : "<%= PROJECT_DIR%>/webapporigin",
      LIZARD_VERSION      : "<%= LIZARD_VERSION%>",
      REMOTE_CSS_PATHS    : ["http://webresource.c-ctrip.com/styles/h5/common/n_main.css"],
      WEB_DEPLOY_DIR      : "<%= PROJECT_DIR%>/web",
      WEB_DEPLOY_DIR_BETA      : "<%= PROJECT_DIR%>/beta",
      HYBRID_DEPLOY_DIR   : "<%= PROJECT_DIR%>/hybrid/lizard",
      HYBRID_DEPLOY_ZIP   : "<%= PROJECT_DIR%>/hybrid/zip",
      HYBRID_DEPLOY_SRC   : "<%= PROJECT_DIR%>/hybrid/src",
      HYBRID_JS_DEPLOY_DIR: "<%= HYBRID_DEPLOY_DIR %>/webresource/code/lizard",
      HYBRID_JS_DEPLOY_SRC: "<%= HYBRID_DEPLOY_SRC %>/webresource/code/lizard",
      TEMP_DIR            : "<%= TEMP_DIR %>",
      WEB_TEMP_DIR        : "<%= TEMP_DIR %>/web",
      HYBRID_TEMP_DIR     : "<%= TEMP_DIR %>/lizard",
      JS_TEMP_DIR         : "<%= TEMP_DIR %>/lizard/webresource/code/lizard",
      CSS_TEMP_DIR        : "<%= TEMP_DIR %>/lizard/webresource",
      PIC_TEMP_DIR        : "<%= TEMP_DIR %>/lizard/pic",
      DEBUG               : "<%= DEBUG%>",
      BANNER              : '/*\n* Ctrip Lizard JavaScript Framework\n' +
      '* Copyright(C) 2008 - ' + grunt.template.today('yyyy') + ', All rights reserved,ctrip.com.\n' +
      '* Date:' + grunt.template.today('yyyy-mm-dd HH:MM:ss') + '\n' +
      '*/\n'
    },


    //清空历史文件
    clean      : {
      options: {
        force: true
      },
      hybrid : [
        "<%= config.PROJECT_DIR %>/hybrid"
      ],
      cleadTemp:[
        "<%= config.TEMP_DIR %>/"
      ],
      cleadTempUi:[
        "<%= config.SRC_DIR %>/tempUi"
      ],
      web    : [
        "<%= config.WEB_DEPLOY_DIR %>/",
        "<%= config.TEMP_DIR %>/"
      ],
      webJsxUi :[
        "<%= config.WEB_DEPLOY_DIR %>/tempJSXUI/"
      ],
      beta    : [
        "<%= config.WEB_DEPLOY_DIR_BETA %>/",
        "<%= config.TEMP_DIR %>/"
      ],
      "lizard.seed.js":{
        options: { force: true },src: ['<%= config.WEB_TEMP_DIR %>/lizard.seed.js']
      }
    },

//拉取在线资源
    curl       : {
      'task-name': {
        src : {
          url              : 'http://webresource.c-ctrip.com/styles/h5/common/n_main.css',
          gzip             : false,
          'Accept-Encoding': 'compress'
        },
        dest: 'TEMP/webresource/styles/h5/common/main2.css'
      }
    },

//requirejs 打包
    requirejs  : {
    },

//js迷你化
    uglify     : {
      options: {
        compress: {
          drop_console: true
        },
        beautify: {
          width   : 1000,
          beautify: '<%= config.DEBUG %>'
        },
        mangle: '<%= config.DEBUG %>',
        mangle  : {
          except: ['$super']
        },

        banner  : '<%= config.BANNER %>'
      },
      hybrid20:{
        files: {
          '<%= config.HYBRID_JS_DEPLOY_DIR %>/<%= config.LIZARD_VERSION%>/web/lizard.seed.js'  : ['hybrid_2.0_seed.js']
        }
      },
      hybrid21:{
        files: {
          '<%= config.HYBRID_JS_DEPLOY_DIR %>/<%= config.LIZARD_VERSION%>/web/lizard.seed.js'  : ['hybrid_2.1_seed.js']
        }
      },
      hybrid : {
        files: {
          '<%= config.HYBRID_JS_DEPLOY_DIR %>/<%= config.LIZARD_VERSION%>/web/lizard.seed.js'  : ['hybrid_seed.js'],
          '<%= config.HYBRID_JS_DEPLOY_DIR %>/libs/lizard.libs.js'                             : '<%= config.JS_TEMP_DIR %>/libs/lizard.libs.js',
          "<%= config.HYBRID_JS_DEPLOY_DIR %>/<%= config.LIZARD_VERSION%>/web/lizard.common.js": "<%= config.JS_TEMP_DIR %>/<%= config.LIZARD_VERSION%>/web/lizard.common.js"
        }
      },
      web    : {
        files: [
          {
            expand: true,
            cwd   : '<%= config.WEB_TEMP_DIR %>',
            src   : '**/*.js',
            dest  : '<%= config.WEB_DEPLOY_DIR %>'
          }
        ]

      },
      "webapporion->web": {
        "files": [
          {
            "expand": true,
            "cwd": "<%= config.SRC_DIR %>",
            "src": ["**/*.js","*.js"],
            "dest":"<%= config.WEB_TEMP_DIR %>"
          }
        ]
      },
      "tempwWeb-web":{
        "files": [
          {
            "expand": true,
            "cwd": "<%= config.WEB_TEMP_DIR %>",
            "src": ["**/*.js","*.js"],
            "dest":"<%= config.WEB_TEMP_DIR %>"
          }
        ]
      },
      "html-SEO":{
        "files": [
          {
            "expand": true,
            "cwd": '<%= config.WEB_TEMP_DIR %>/v8',
            "src": ["parser.js"],
            "dest": '../../html5/HtmlJS'
          }
        ]
      },
      "lizardSrc2Lizard2.0": {
        "files": {
          'TEMP/web/lizard.seed.js': ['<%= config.WEB_TEMP_DIR %>/lizard.seed.src.js'],
          'TEMP/web/lizard.defer.js': ['<%= config.WEB_TEMP_DIR %>/lizard.defer.src.js']
        }
      },
      "lizardSrc2lizard": {
        "files": {
          'TEMP/web/lizard.web.js': ['<%= config.WEB_TEMP_DIR %>/lizard.web.src.js'],
          'TEMP/web/lizard.core.js': ['<%= config.WEB_TEMP_DIR %>/lizard.core.src.js'],
          //'TEMP/web/lizard.seed.beta.js': ['<%= config.WEB_TEMP_DIR %>/lizard.seed.beta.src.js'],
          //'TEMP/web/lizard.web.beta.js': ['<%= config.WEB_TEMP_DIR %>/lizard.web.beta.src.js'],
          'TEMP/web/lizard.hybrid.js': ['<%= config.WEB_TEMP_DIR %>/lizard.hybrid.src.js'],
          'TEMP/web/v8/parser.js': ['<%= config.WEB_TEMP_DIR %>/v8/parser.src.js'],
          'TEMP/web/lizard.lite.min.js':  ['<%= config.WEB_TEMP_DIR %>/lizard.lite.js'],
          //'TEMP/web/lizard.seed.js.tpl': ['web_seed.js']
          'TEMP/web/lizard.seed.js.tpl': ['web_seed_temp.js']
        }
      },
      "lizardSrc2lizard2.2": {
        "files": {
          'TEMP/web/lizard.parser.js': ['<%= config.WEB_TEMP_DIR %>/lizard.parser.src.js'],
          'TEMP/web/lizard.web.js': ['<%= config.WEB_TEMP_DIR %>/lizard.web.src.js'],
          'TEMP/web/lizard.core.js': ['<%= config.WEB_TEMP_DIR %>/lizard.core.src.js'],
          'TEMP/web/lizard.multi.js': ['<%= config.WEB_TEMP_DIR %>/lizard.multi.src.js'],
          'TEMP/web/lizard.web.multi.js': ['<%= config.WEB_TEMP_DIR %>/lizard.web.multi.src.js'],
          'TEMP/web/lizard.hybrid.multi.js': ['<%= config.WEB_TEMP_DIR %>/lizard.hybrid.multi.src.js'],
          'TEMP/web/lizard.hybrid.js': ['<%= config.WEB_TEMP_DIR %>/lizard.hybrid.src.js'],
          'TEMP/web/v8/parser.js': ['<%= config.WEB_TEMP_DIR %>/v8/parser.src.js'],
          'TEMP/web/lizard.lite.min.js':  ['<%= config.WEB_TEMP_DIR %>/lite/lizard.lite.js'],
          'TEMP/web/login.lite.min.js':  ['<%= config.WEB_TEMP_DIR %>/lite/login.lite.js'],
          'TEMP/web/cryptBase64.min.js':  ['<%= config.WEB_TEMP_DIR %>/lite/cryptBase64.js'],
          'TEMP/web/lizard.lite.js':  ['<%= config.WEB_TEMP_DIR %>/lite/lizard.lite.js'],
          'TEMP/web/lite.geo.js':  ['<%= config.WEB_TEMP_DIR %>/lite/lite.geo.js'],
          'TEMP/web/lite.geo.min.js':  ['<%= config.WEB_TEMP_DIR %>/lite/lite.geo.js'],
          'TEMP/web/login.lite.js':  ['<%= config.WEB_TEMP_DIR %>/lite/login.lite.js'],
          'TEMP/web/cryptBase64.js':  ['<%= config.WEB_TEMP_DIR %>/lite/cryptBase64.js'],
          'TEMP/web/lizard.seed.js.tpl': ['web_seed_temp.js']
        }
      },
      "lizardSrc2lizard3.01": {
        "files": {
          'TEMP/web/lizard.parser.js': ['<%= config.WEB_TEMP_DIR %>/lizard.parser.src.js'],
          'TEMP/web/lizard.web.js': ['<%= config.WEB_TEMP_DIR %>/lizard.web.src.js'],
          'TEMP/web/lizard.core.js': ['<%= config.WEB_TEMP_DIR %>/lizard.core.src.js'],
          'TEMP/web/lizard.hybrid.js': ['<%= config.WEB_TEMP_DIR %>/lizard.hybrid.src.js'],
          'TEMP/web/lizard.seed.js.tpl': ['web_seed_temp.js']
        }
      },
      "jsxUI":{
        files: [{
          expand:true,
          cwd:'<%= config.SRC_DIR %>/tempJSXUI/',//js目录下
          src:['*.js'],//所有文件
          dest: '<%= config.WEB_TEMP_DIR %>/ui/'//输出到此目录下
        }]
      },
      "lizardSrc2lizard3.0": {
        "files": {
          'TEMP/web/lizard.parser.js': ['<%= config.WEB_TEMP_DIR %>/lizard.parser.src.js'],
          'TEMP/web/lizard.multi.js': ['<%= config.WEB_TEMP_DIR %>/lizard.multi.src.js'],
          'TEMP/web/lizard.web.multi.js': ['<%= config.WEB_TEMP_DIR %>/lizard.web.multi.src.js'],
          'TEMP/web/lizard.hybrid.multi.js': ['<%= config.WEB_TEMP_DIR %>/lizard.hybrid.multi.src.js'],
          'TEMP/web/v8/parser.js': ['<%= config.WEB_TEMP_DIR %>/v8/parser.src.js'],
          'TEMP/web/lizard.lite.min.js':  ['<%= config.WEB_TEMP_DIR %>/lite/lizard.lite.js'],
          'TEMP/web/login.lite.min.js':  ['<%= config.WEB_TEMP_DIR %>/lite/login.lite.js'],
          'TEMP/web/cryptBase64.min.js':  ['<%= config.WEB_TEMP_DIR %>/lite/cryptBase64.js'],
          'TEMP/web/lizard.lite.js':  ['<%= config.WEB_TEMP_DIR %>/lite/lizard.lite.js'],
          'TEMP/web/login.lite.js':  ['<%= config.WEB_TEMP_DIR %>/lite/login.lite.js'],
          'TEMP/web/cryptBase64.js':  ['<%= config.WEB_TEMP_DIR %>/lite/cryptBase64.js'],
          'TEMP/web/lizard.seed.js.tpl': ['web_seed_temp.js']
        }
      },
      buildall: {//任务三：按原文件结构压缩js文件夹内所有JS文件
        files: [{
          expand:true,
          cwd:'<%= config.SRC_DIR %>',//js目录下
          src:['**/{jquery,c.lz,c.crypt.base64,c.crypt.rsa,c.img.lazyload,c.util.hybrid,c.pad.app,c.tv.start,c.ty.start,c.hybrid.facade,c.hybrid.shell,c.geo,c.service.qrcode,bridge,c.web.map,c.web.geolocation.bmap,c.web.geolocation.amap,c.web.geolocation.gmap,c.web.geolocation,c.web.memberService,c.web.geolocation.bgeo,c.web.geolocation.ggeo,c.service.guider}.js'],//所有js文件
          dest: '<%= config.WEB_TEMP_DIR %>'//输出到此目录下
        }]
      },
      "buildall3.0": {//任务三：按原文件结构压缩js文件夹内所有JS文件
        files: [{
          expand:true,
          cwd:'<%= config.SRC_DIR %>',//js目录下
          src:['**/c*.js', '3rdlibs/*.js'],//所有js文件
          dest: '<%= config.WEB_TEMP_DIR %>'//输出到此目录下
        }]
      },
      "SEO3.01": {//任务三：按原文件结构压缩js文件夹内所有JS文件
        files: [{
          expand:true,
          cwd:'<%= config.SRC_DIR %>',//js目录下
          src:['serverRender/*.js'],//所有js文件
          dest: '<%= config.WEB_TEMP_DIR %>'//输出到此目录下
        }]
      },
      ugShell:{
        files: [{
          expand:true,
          cwd: '<%= config.TEMP_DIR %>/tempWeb/shell',
          src:['**/*.js'],//所有js文件
          dest: '<%= config.WEB_TEMP_DIR %>/shell'//输出到此目录下
        }]
      },
      SEOParser:{
        files: [{
          expand:true,
          cwd:'<%= config.SRC_DIR %>/v8',//js目录下
          src:['parser.js'],//所有js文件
          dest: '<%= config.WEB_TEMP_DIR %>/v8'//输出到此目录下
        }]
      },
      "tempLizardSeed->hybrid":{
        files: {
          '<%= config.HYBRID_DEPLOY_SRC %>/lizard/webresource/code/lizard/2.1/web/lizard.seed.js':['hybrid_seed.js'],
          '<%= config.HYBRID_DEPLOY_SRC %>/lizard/webresource/code/lizard/2.0/web/lizard.seed.js':['hybrid_seed.js']
        }
      }
    },

//复制目录
    copy : {
      "webapporion->web": {
        "files": [
          {
            "expand": true,
            "cwd": '<%= config.SRC_DIR %>',
            "src": ["**"],
            "dest": '<%= config.PROJECT_DIR %>/web'
          }
        ]
      },
      "tempWeb->web": {
        "files": [
          {
            "expand": true,
            "cwd": '<%= config.WEB_TEMP_DIR %>',
            "src": ["**"],
            "dest": '<%= config.WEB_DEPLOY_DIR %>'
          }
        ]
      },
      "tempWeb->beta": { //新增beta目录发布时，可以随机算选择beta版本发布
        "files": [
          {
            "expand": true,
            "cwd": '<%= config.WEB_TEMP_DIR %>',
            "src": ["**"],
            "dest": '<%= config.WEB_DEPLOY_DIR_BETA %>'
          }
        ]
      },
      "hybridZip->Temp":{
        "files": [
          {
            "expand": true,
            "cwd": '<%= config.HYBRID_DEPLOY_ZIP %>',
            "src": ["**"],
            "dest": '<%= config.TEMP_DIR %>'
          }
        ]
      },
      "webapporion->tempWeb": {
        "files": [
          {
            "expand": true,
            "cwd": '<%= config.SRC_DIR %>',
            "src": ["**"],
            "dest": '<%= config.TEMP_DIR %>/tempWeb'
          },
          {
            "expand": true,
            "cwd": '<%= config.SRC_DIR %>',
            "src": ["**/lizard.lite.js","**/lite.geo.js","**/login.lite.js","**/cryptBase64.js"],
            "dest": '<%= config.WEB_TEMP_DIR %>'
          }
        ]
      },
      "tempHybrid->hybrid":{
        "files": [
          {
            "expand": true,
            "cwd": '<%= config.TEMP_DIR %>/lizard',
            "src": ["**"],
            "dest": '<%= config.HYBRID_DEPLOY_SRC %>/lizard'
          }
        ]
      },
      "tempLizardSeed->hybrid2.1":{
        "files": [
          {
            "expand": true,
            "cwd": '',
            "src": ["hybrid_seed.js"],
            "dest": '<%= config.HYBRID_DEPLOY_SRC %>/lizard/webresource/code/lizard/2.1/web'
          }
        ]
      },
      "tempLizardSeed->hybrid2.0":{
        "files": [
          {
            "expand": true,
            "cwd": '',
            "src": ["hybrid_seed.js"],
            "dest": '<%= config.HYBRID_DEPLOY_SRC %>/lizard/webresource/code/lizard/2.0/web'
          }
        ]
      },
      "mainCss":{
        "files": [
          {
            "expand": true,
            "cwd": '',
            "src": ["main.css"],
            "dest": '<%= config.HYBRID_DEPLOY_DIR %>/webresource/styles/h5/common/'
          }
        ]
      }
    },

//文件替换任务
    replace    : {
      //hybrid打包,替换css中pic的引用路径
      picPathInCss: {
        options: {
          patterns: [
            {
              match      : /\/\/pic.c-ctrip.com\/h5\/common\//g,
              replacement: '../../../../pic/h5/common/'
            }
          ]
        },
        files  : [
          {
            src : ['<%= config.CSS_TEMP_DIR %>/styles/h5/common/n_main.css'],
            dest: '<%= config.HYBRID_DEPLOY_DIR %>/webresource/styles/h5/common/n_main.css'
          }
        ]
      }
    },

//图片优化
    imagemin   : {
      pic: {                         // Another target
        files: [
          {
            expand: true,                  // Enable dynamic expansion
            cwd   : '<%= config.PIC_TEMP_DIR %>/',
            src   : ['**/*.{png,jpg,gif}'],   // Actual patterns to match
            dest  : '<%= config.HYBRID_DEPLOY_DIR %>/pic/'
          }
        ]
      }
    },

//压缩zip包
    compress   : {
      "main": {
        "options": {
          "archive": "<%= config.PROJECT_DIR %>/hybrid/zip/lizard.zip"
        },
        "files"  : [

        ]
      },
      'tempWeb':{
        "options": {
          "archive": "<%= config.TEMP_DIR %>/web.zip"
        },
        "files"  : [
          {
            expand: true,                  // Enable dynamic expansion
            cwd   : '<%= config.WEB_DEPLOY_DIR %>/',
            src   : ['**']   // Actual patterns to match
          }
        ]
      },
      "src->zip":{
        "options": {
          "archive": "<%= config.TEMP_DIR %>/lizard.zip"
        },
        "files"  : [
          {
            expand: true,                  // Enable dynamic expansion
            cwd   : '<%= config.HYBRID_DEPLOY_SRC %>/',
            src   : ['**']   // Actual patterns to match
          }
        ]
      }
    },

    //npm install rimraf -g
    shell: {
      'build-jsx': {
        command: [
          'jsx -x jsx <%= config.SRC_DIR %>/ui/ <%= config.SRC_DIR %>/tempJSXUI/',
          'rimraf <%= config.SRC_DIR %>/tempJSXUI/.module-cache/'
        ].join(' && '),
        stdout: true,
        failOnError: true
      },
      'build-jsx-cmd': {
        command: [
          'jsx -x jsx <%= config.SRC_DIR %>/ui/ <%= config.SRC_DIR %>/tempJSXUI/',
          'rmdir /s /q <%= config.SRC_DIR %>/tempJSXUI/.module-cache/'
        ].join(' && '),
        stdout: true,
        failOnError: true
      },
      "removeJscUI":{
        command: [
          'rimraf -rf <%= config.SRC_DIR %>/tempJSXUI/'
        ].join(""),
        stdout: true,
        failOnError: true
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        predef: [
          "Zepto",
          "Lizard",
          "requirejs",
          "alert",
          "Backbone",
          "Internal",
          "CtripUtil",
          "CtripBusiness",
          "CtripTool",
          "AMap",
          "BMap",
          "google",
          "unescape",
          "localStorage",
          "HTMLElement",
          "Image",
          "escape",
          "XDomainRequest",
          "define",
          "ga",
          "window",
          "document",
          "location" ,
          "$",
          "_",
          "Element",
          "history",
          "navigator",
          "XMLHttpRequest",
          "getAppUITemplatePath",
          "getComputedStyle",
          "__SERVERDATE__",
          "FileReader",
          "BMAP_ANCHOR_TOP_LEFT",
          "BMAP_ANCHOR_TOP_RIGHT",
          "BMAP_ANCHOR_BOTTOM_RIGHT",
          "BMAP_ANCHOR_BOTTOM_LEFT",
          "isLizardUserBeta"
        ],
        boss: true,
        node: true,
        evil: true
      },
      globals: {
        jQuery: true,
        src:[
          '<%= config.SRC_DIR %>/app/**/*.js',
          '<%= config.SRC_DIR %>/common/**/*.js',
          '<%= config.SRC_DIR %>/data/**/*.js',
          '<%= config.SRC_DIR %>/page/**/*.js',
          '<%= config.SRC_DIR %>/plugins/**/*.js',
          '<%= config.SRC_DIR %>/service/**/*.js',
          '!<%= config.SRC_DIR %>/service/c.service.qrcode.js',
          '<%= config.SRC_DIR %>/shell/**/*.js',
          '<%= config.SRC_DIR %>/ui/**/*.js',
          '!<%= config.SRC_DIR %>/ui/ui.templates.js',
          '!<%= config.SRC_DIR %>/ui/ui.mask.js',
          '!<%= config.SRC_DIR %>/ui/ui.alert.js',
          '<%= config.SRC_DIR %>/util/**/*.js',
          '!<%= config.SRC_DIR %>/util/crypt/c.crypt.rsa.js',
          '!<%= config.SRC_DIR %>/util/c.util.xhr.js',
          '!<%= config.SRC_DIR %>/util/c.lz.js',
          '<%= config.SRC_DIR %>/config.js',
          '<%= config.SRC_DIR %>/lizard.seed.js'
        ]//所有js文件
      }
    }
  })
  ;

  grunt.loadNpmTasks('grunt-curl');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-strip');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('@ctrip/grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  /*****************全局变量定义*********************/
//本地CSS路径
  var LOCAL_CSS_PATHS = [];
//CCS 中引用的图片路径
  var REMOTE_PIC_PATHS = [];
//要压缩的文件路径
  var HYBRID_COMPRESS_PATHS = [];

  var GLOBAL_CONFIG_STR = "";
  /*******************end*********************/

  /***************全局方法*********************/
  //获得
  function getBuildVersions(version) {
    var versions = [version],
      pkg = grunt.config.get('pkg');
    if (version == 'all') {
      versions = pkg.all_versions;
    }
    return versions;
  }

  /*******************end*********************/

  /**
   * 下载CSS样式
   */
  grunt.registerTask('downloadCss', function () {
    grunt.log.writeln('start download css task');
    var config = grunt.config.get('config');
    var cssArray = config.REMOTE_CSS_PATHS;
    var queryString = "?v="+new Date().getTime();
    var curlCfg = {};
    for (var i in cssArray) {
      var cssPath = cssArray[i];
      var localPath = config.CSS_TEMP_DIR + cssPath.substr(cssPath.indexOf('.com') + 4);
      LOCAL_CSS_PATHS.push(localPath);
      grunt.log.writeln("download " + cssPath + " --> " + localPath);
      curlCfg[localPath] = cssArray[i] + queryString;
    }
    grunt.log.debug(JSON.stringify(curlCfg));
    grunt.config.set('curl', curlCfg);
    grunt.task.run('curl');
  });

  /**
   * 下载图片
   */
  grunt.registerTask('downloadPic', function () {
    grunt.log.writeln('start download pic task');
    var config = grunt.config.get('config');

    for (var i  in LOCAL_CSS_PATHS) {
      grunt.log.writeln('precess css file :' + LOCAL_CSS_PATHS[i]);
      var cssContent = grunt.file.read(LOCAL_CSS_PATHS[i]);
      grunt.log.debug(cssContent);
      var imgReg = /url\(((https?:)?\/\/[^\)]+)\)/g;
      var imgArray = cssContent.match(imgReg);
      //考虑用更详细的正则
      for (var j in imgArray) {
        //获取引用路径
        var picPath = imgArray[j].substring(4, imgArray[j].length - 1);
        REMOTE_PIC_PATHS.push(picPath);
      }
    }

    //配置pic下载任务
    var curlCfg = {};
    for (var p in REMOTE_PIC_PATHS) {
      var romotePicPath = REMOTE_PIC_PATHS[p];
      var localPicPath = config.PIC_TEMP_DIR + romotePicPath.substr(romotePicPath.indexOf('.com') + 4);
      grunt.log.writeln("download " + romotePicPath + " --> " + localPicPath);
      curlCfg[localPicPath] = "http:" + romotePicPath;
    }
    grunt.log.debug(JSON.stringify(curlCfg));
    grunt.config.set('curl', curlCfg);
    grunt.task.run('curl');
  });

  /**
   * 处理外部资源,下载css,图片,优化图片
   */
  grunt.registerTask('cResoureceTask', function () {
    grunt.task.run(['downloadCss', 'downloadPic', 'replace:picPathInCss', 'imagemin']);
  });

  grunt.registerTask('testRequireJs', function (platform,UI) {
    if (platform != 'web') {
      platform = 'hybrid';
    }
    var fs = require('fs');
    var config = grunt.config.get('config');
    var cfgFile = "../2.1/config/web_beta.js";
    var fileBuffer = grunt.file.read(cfgFile);
    eval(fileBuffer);
    grunt.config.set('requirejs', requirejs);
    grunt.task.run('requirejs');
  })
  /**
   * 读取读取配置文件
   */
  grunt.registerTask('setRequireJs', function (platform,UI) {
    grunt.log.writeln('start setRequireJs task');
    if (platform != 'web') {
      platform = 'hybrid';
    }
    var fs = require('file-system');
    var config = grunt.config.get('config');
    var cfgFile = config.PROJECT_DIR + "/config/";
    if(UI == "beta"){
      cfgFile += platform + "_" +UI+".js";
    }else{
      cfgFile += platform + ".js";
    }
    grunt.log.writeln('read file:' + cfgFile);

    var fileBuffer = grunt.file.read(cfgFile);
    try {
      eval(fileBuffer);
      if(UI == "beta"){
        var sepreg = new RegExp("Separator$"), seperators = [], output = [];
        for (var option in requirejs.app.options) {
          if (sepreg.test(option)) {
            seperators.push(option);
            requirejs.app.options.rawText = {};
            requirejs.app.options.rawText[option] = '';
          }
        }
        if (!output[0]) output[0] = [];
        requirejs.app.options.onBuildWrite = function (moduleName, path, contents) {
          if (moduleName.indexOf('UI') == 0 || moduleName.indexOf('cUI') == 0) {
            //fs.unlink(path.toLowerCase().split('webapporigin').join('web'));
          }
          for (var i = output.length -1; i < seperators.length; i++)
          {
            if (moduleName == seperators[i])
            {
              output[output.length] = [];
            }
          }
          if (moduleName == 'cParserUtil') {
            requirejs.app.options.rawText[moduleName] = contents;
          }
          if (moduleName == 'cSeoEntendUtil') {
            output[output.length - 1].push(requirejs.app.options.rawText['cParserUtil']);
          }
          output[output.length - 1].push(contents);
          return contents;
        }
        requirejs.app.options.out = function (text, sourceMapText) {
          fs.writeFileSync( '../grunt/TEMP/web/lizard.seed.beta.src.js', output[0].join(";"));
          for (var i = 0; i < seperators.length; i++)
          {
            fs.writeFileSync('../grunt/TEMP/web/' + requirejs.app.options[seperators[i]], output[i + 1].join(";"));
          }
        }
      }
      if(platform == "web" ){
        if(requirejs.seo){
          var seoput = [];
          requirejs.seo.options.onBuildWrite = function (moduleName, path, contents) {
            seoput.push(contents);
            return contents;
          }
          requirejs.seo.options.out = function (text, sourceMapText) {
            var seoText = 'var LizardGetModels, LizardRender, LizardUrlMapping;var Lizard = Lizard||{};(function (){Lizard.runAt = "server";Lizard.renderAt = "server";\n'+
              seoput.join(";")+'})()';
            fs.writeFileSync( '../grunt/TEMP/web/v8/parser.src.js', seoText);
          }
        }
        if(requirejs.web || requirejs.webMulti){
          (requirejs.web || requirejs.webMulti).options.onBuildWrite = function (moduleName, path, contents) {
            if(moduleName == 'cHybridShell'){
              return "if(!Lizard.app.vendor.is('CTRIP')){var noop=function(){};define('cHybridFacade',[],function(){var Facade={};Facade.register=noop;Facade.registerOne=noop;Facade.unregister=noop;Facade.request=noop;Facade.init=noop;Facade.getOpenUrl=noop;return Facade;});define('cHybridShell',[],function(){var Fn=function(){var run=noop;return{run:run,on:noop};};return{Fn:Fn,upon:noop,fn:noop,init:noop,on:noop,once:noop,preTreat:noop,postTreat:noop,off:noop,abort:noop}});require(['cHybridFacade','cHybridShell'],function(){});};";
            }
            if(moduleName == 'cHybridFacade'){
              return "";
              //return "if(!Lizard.app.vendor.is('CTRIP')){define('cHybridFacade',[],function(){var Facade={};Facade.register=function(){};Facade.registerOne=function(){};return Facade;});}";
            }
            return contents;
          }
        }
      }
      grunt.config.set('requirejs', requirejs);
      grunt.task.run('requirejs');
    } catch (e) {
      grunt.log.errorlns(e);
    }
  });

  grunt.registerTask('jsx', [
    'initGruntConfig:3.01',
    'shell:build-jsx',
    "uglify:jsxUI"
  ]);

  /**
   * hybrid打包
   */
  grunt.registerTask('hybrid', function (version,tagName) {
    var versions = getBuildVersions(version);
    grunt.log.writeln(versions);
    console.log(versions);
    //if (versions.length < 2) {
    grunt.task.run('clean:cleadTemp');
    //}
    for (var i in versions) {
      var version = versions[i];
      var tasks = ['initGruntConfig:' + version +":"+tagName,
        'clean:hybrid'
      ];
      if(version == "2.0"){
        tasks.push("uglify:hybrid20");
      }else if(version == "2.1"){
        tasks.push("uglify:hybrid21");
      }else {
        tasks.push('setRequireJs:hybrid');
        tasks.push('uglify:hybrid');
        //tasks.push("uglify:tempLizardSeed->hybrid");
        //combineUiFiles("../"+ version +"/webapporigin/ui/","tempUi",version);
        combineUiBetaFilesHybrid("../"+ version +"/webapporigin/ui/");
        tasks.push('clean:cleadTempUi');
        tasks.push('downloadCss');
        tasks.push('downloadPic');
        tasks.push('copy:mainCss');
        tasks.push('replace:picPathInCss');
        tasks.push('imagemin');
      }
      grunt.task.run(tasks);
    }
    grunt.task.run("copy:tempHybrid->hybrid");
    grunt.task.run('setCompress');
    grunt.task.run('compress:src->zip');
    //grunt.task.run('copy:hybridZip->Temp');
  });

  grunt.registerTask('jshintTest',function(){
    var tasks = ['initGruntConfig:2.1'];
    tasks.push('jshint');
    grunt.task.run(tasks);
  });

  /**
   * 每次打包生成seed中的文件版本号
   */
  function createVersion(path){
    var fs = require('fs');
    var code ;
    try {code = fs.readFileSync(path, 'utf8')} catch(e) {}
    if(code){
      var version =  grunt.template.today('yyyymmddHHMMss');
      fs.writeFileSync("web_seed_temp.js",code.replace(/\{timeString\}/g,"_"+version+"_"));
    }
  }

  /**
   * web打包
   */
  grunt.registerTask('web', function (version,tagName) {
    var isNoJsHint = grunt.option("noJsHint");
    var isBeta =  grunt.option("beta");
    var clean = "'";
    if(isBeta){
      clean = 'clean:beta';
    }else{
      clean = 'clean:web';
    }
    console.log(isBeta);
    var tasks = ['initGruntConfig:' + version +":"+tagName,clean];
    if(version == "2.0"){
      tasks.push('uglify:webapporion->web');
      tasks.push('clean:lizard.seed.js');
      tasks.push('setRequireJs:web');
      tasks.push('uglify:lizardSrc2Lizard2.0');
      tasks.push('copy:tempWeb->web');
      tasks.push('compress:tempWeb');
    }else if(version == "2.1" || version == "2.2" || version == "3.0" || version == "3.01"){
      tasks.push("copy:webapporion->tempWeb");
      tasks.push("build:ui:"+ version +":"+tagName);
      if (version !== "3.0" && version !== "3.01") {
        tasks.push("build:beta:"+ version +":"+tagName);
      }
      tasks.push("uglify:ugShell");
      if (version == "2.1") {
        createVersion("web_seed.js");
        tasks.push('uglify:lizardSrc2lizard');
      } else if (version == "2.2") {
        createVersion("web_seed_2.2.js");
        tasks.push('uglify:lizardSrc2lizard2.2');
      } else if (version == "3.0"){
        createVersion("web_seed_3.0.js");
        tasks.push('uglify:lizardSrc2lizard3.0');
      } else if (version == "3.01"){
        createVersion("web_seed_3.01.js");
        tasks.push("clean:webJsxUi");
        tasks.push("shell:build-jsx");
        tasks.push("uglify:jsxUI");
        tasks.push("shell:removeJscUI");
        tasks.push('uglify:lizardSrc2lizard3.01');
        tasks.push('uglify:SEO3.01');
      }

      if (version == "3.0") {
        tasks.push('uglify:buildall3.0');
      } else {
        tasks.push('uglify:buildall');
      }
      tasks.push('uglify:html-SEO');
      if(!isBeta){
        tasks.push('copy:tempWeb->web'); //发布正式版
      }else{
        tasks.push('copy:tempWeb->beta'); //发布beta版本
      }
      tasks.push('compress:tempWeb');
      if(!isNoJsHint){
        tasks.push('jshint');
      }
    }
    grunt.task.run(tasks);

  });
  grunt.registerTask('build', 'build task',function (branch,version,tagName) {
    if(version =="2.2" && branch == "beta"){return;}
    var tasks = ['initGruntConfig:'+ version +":"+tagName];
    if(branch == "ui"){
      try{
        combineUiFiles("../grunt/TEMP/tempWeb/ui/",null,version);
      }catch(e){
      }
      tasks.push('setRequireJs:web');
    }else{
      combineUiBetaFiles("../grunt/TEMP/tempWeb/ui_beta/");
      //tasks.push('setRequireJs:web:beta');
    }
    grunt.task.run(tasks);
  });

  function getUIModuleName(fileName){
    if(!fileName){
      return;
    }
    fileName = fileName.slice(0,-1);
    var moduleName;
    var _ = require('underscore');
    var config = grunt.config.get('config');
    var cfgFile = config.PROJECT_DIR + "/config/web.js";
    var fileBuffer = grunt.file.read(cfgFile);
    eval(fileBuffer);
    if(requirejs.seed){
      var paths = requirejs.seed.options.paths;
      _.each(paths,function(path,name){
        path = path.replace("ui/","");
        if(path == fileName){
          moduleName = name;
        }
      })
    }
    if(!moduleName){
      console.log(fileName);
    }
    return moduleName;
  };

  function combineUiBetaFilesHybrid(uiDir){
    var fs = require('fs'), files = fs.readdirSync(uiDir), _ = require('underscore'), cleanCSS = require('clean-css'), jsFilepattern = /.js$/, uglifyJs = require('uglify-js'), strip = require('strip-comment');
    _.each(files, function(filename){
      if (jsFilepattern.test(filename)) {
        var jsfilepreFix = filename.substr(0, filename.length -2);
        var htmlfile = uiDir + jsfilepreFix + 'html', jsfile = uiDir + jsfilepreFix + 'js', uicode = ['',''];
        try {uicode[0] = fs.readFileSync(htmlfile, 'utf8')} catch(e) {}
        try {uicode[1] = fs.readFileSync(jsfile, 'utf8')} catch(e) {}
        var reg = /<style>[\s\S]+<\/style>/gi; //匹配模板中的style
        var style = uicode[0].match(reg);
        if(style){
          var minCss = "<style>" + (new cleanCSS()).minify(style[0].replace('<style>','').replace('</style>','').replace(/\\n\s*/g, '').replace(/\\r\s*/g, '')).styles + "</style>";
          uicode[0] =  uicode[0].replace(reg,minCss);
        }
        //if(jsfilepreFix == "ui.loading.failed."){
        //  if (uicode[0]) uicode[0] = 'define([], function(){return ' + _.template(strip.html(uicode[0])).source.replace(/\\n\s*/g, '').replace(/\\r\s*/g, '') + '});';
        //}else{
        if (uicode[0]) uicode[0] = 'define("text!ui/' + jsfilepreFix + 'html", [], function(){return ' + _.template(strip.html(uicode[0])).source.replace(/\\n\s*/g, '').replace(/\\r\s*/g, '') + '});';
        //}
        //"../2.2/webapporigin/ui/"
        var tempDir = uiDir.split("ui/").join("tempUi/");
        if(!fs.existsSync(tempDir)){
          fs.mkdirSync(tempDir);
        }
        var filePath  = jsfile.split("ui/").join("tempUi/");
        //if(jsfilepreFix == "ui.loading.failed."){
        //  //ui.loading.failed 特殊处理
        //  var htmlfileName = filePath.replace(".js",".html.js");
        //  fs.writeFileSync(filePath, uglifyJs.minify(uicode[1], {fromString: true, mangle:{except: ['$super']}}).code);
        //  fs.writeFileSync(htmlfileName, uglifyJs.minify(uicode[0], {fromString: true, mangle:{except: ['$super']}}).code);
        //}else{
        fs.writeFileSync(filePath, uglifyJs.minify(uicode.join(''), {fromString: true, mangle:{except: ['$super']}}).code);
        //}
      }
    });
  }
  function combineUiFiles(uiDir,tempDir,version) {
    var tempDirClone = tempDir;
    var fs = require('fs'), files = fs.readdirSync(uiDir), _ = require('underscore'), jsFilepattern = /.js$/,jsxFilepattern = /.jsx$/, uglifyJs = require('uglify-js'), strip = require('strip-comment');
    _.each(files, function(filename){
      if (jsFilepattern.test(filename)) {
        var jsfilepreFix = filename.substr(0, filename.length -2);
        var htmlfile = uiDir + jsfilepreFix + 'html', jsfile = uiDir + jsfilepreFix + 'js', uicode = ['',''];
        try {uicode[0] = fs.readFileSync(htmlfile, 'utf8')} catch(e) {}
        try {uicode[1] = fs.readFileSync(jsfile, 'utf8')} catch(e) {}
        //console.log(jsfilepreFix);
        //给UIjs加上相应的模块名称
        if(uicode[1] && !tempDir){ //是web使用，非hybrid打包使用，此处判断要改
          var moduleName= getUIModuleName(jsfilepreFix);
          if(moduleName){
            uicode[1] = uicode[1].replace("define(",'define(' + '"'+moduleName+'",');
          }
        }
        //if(jsfilepreFix == "ui.loading.failed."){
        //  if (uicode[0]) uicode[0] = 'define([], function(){return ' + _.template(strip.html(uicode[0])).source.replace(/\\n\s*/g, '').replace(/\\r\s*/g, '') + '});';
        //}else{
        if (uicode[0]) uicode[0] = 'define("text!ui/' + jsfilepreFix + 'html", [], function(){return ' + _.template(strip.html(uicode[0])).source.replace(/\\n\s*/g, '').replace(/\\r\s*/g, '') + '});';
        //}
        //fs.writeFileSync(jsfile, uicode.join('\r\n'));
        var dir, filePath1, filePath2, filePath3,filePath;
        if (tempDir) {
          dir = "ui";
          filePath1 = "../2.1/webapporigin/" + tempDirClone;
          filePath = jsfile.split(dir + "/").join(tempDirClone + "/");
        } else {
          tempDirClone = 'web';
          dir = "tempWeb";
          filePath1 = "../grunt/TEMP";
          filePath2 = "../grunt/TEMP/web";
          filePath3 = "../grunt/TEMP/web/ui";
          filePath = jsfile.split(dir).join(tempDirClone);
        }
        if (filePath1 && !fs.existsSync(filePath1)) {
          fs.mkdirSync(filePath1);
        }
        if (filePath2 && !fs.existsSync(filePath2)) {
          fs.mkdirSync(filePath2);
        }
        if (filePath3 && !fs.existsSync(filePath3)) {
          fs.mkdirSync(filePath3);
        }
        //if(jsfilepreFix == "ui.loading.failed."){
        //  //ui.loading.failed 特殊处理
        //  var htmlfileName = jsfile.replace(".js",".html.js");
        //  fs.writeFileSync(jsfile.split('tempWeb').join('web'), uglifyJs.minify(uicode[1], {fromString: true, mangle:{except: ['$super']}}).code);
        //  fs.writeFileSync(htmlfileName.split('tempWeb').join('web'), uglifyJs.minify(uicode[0], {fromString: true, mangle:{except: ['$super']}}).code);
        //}else{
        fs.writeFileSync(filePath, uglifyJs.minify(uicode.join(''), {fromString: true, mangle:{except: ['$super']}}).code);
        //}
      }else if(jsxFilepattern.test(filename)){
        //暂不处理
        console.log(filename);
      }
    })
  }
  function combineUiBetaFiles(uiDir) {
    var fs = require('fs'), files = fs.readdirSync(uiDir), _ = require('underscore'), cleanCSS = require('clean-css'), jsFilepattern = /.js$/, uglifyJs = require('uglify-js'), strip = require('strip-comment');
    _.each(files, function(filename){
      if (jsFilepattern.test(filename)) {
        var jsfilepreFix = filename.substr(0, filename.length -2);
        var cssfile = uiDir + jsfilepreFix + 'css', htmlfile = uiDir + jsfilepreFix + 'html', jsfile = uiDir + jsfilepreFix + 'js', uicode = ['','', ''];
        try {uicode[0] = fs.readFileSync(cssfile, 'utf8')} catch(e) {}
        try {uicode[1] = fs.readFileSync(htmlfile, 'utf8')} catch(e) {}
        try {uicode[2] = fs.readFileSync(jsfile, 'utf8')} catch(e) {}
        if (uicode[0]) uicode[0] = 'define("text!ui/' + jsfilepreFix + 'css", [], function(){return ' + JSON.stringify((new cleanCSS()).minify(uicode[0]).styles) + '});';
        var reg = /<style>[\s\S]+<\/style>/gi; //匹配模板中的style
        //uicode[1] = uicode[1].replace()
        var style = uicode[1].match(reg);
        if(style){
          var minCss = "<style>" + (new cleanCSS()).minify(style[0].replace('<style>','').replace('</style>','').replace(/\\n\s*/g, '').replace(/\\r\s*/g, '')).styles + "</style>";
          uicode[1] =  uicode[1].replace(reg,minCss);
        }
        //if(jsfilepreFix == "ui.loading.failed."){
        //  if (uicode[1]) uicode[1] = 'define([], function(){return ' + _.template(strip.html(uicode[1])).source.replace(/\\n\s*/g, '').replace(/\\r\s*/g, '') + '});';
        //}else{
        if (uicode[1]) uicode[1] = 'define("text!ui/' + jsfilepreFix + 'html", [], function(){return ' + _.template(strip.html(uicode[1])).source.replace(/\\n\s*/g, '').replace(/\\r\s*/g, '') + '});';
        //}
        fs.writeFileSync(jsfile, uicode.join('\r\n'));
        if (!fs.existsSync("../grunt/TEMP")) {
          fs.mkdirSync("../grunt/TEMP");
        }
        if (!fs.existsSync("../grunt/TEMP/web")) {
          fs.mkdirSync("../grunt/TEMP/web");
        }
        if (!fs.existsSync("../grunt/TEMP/web/ui_beta")) {
          fs.mkdirSync("../grunt/TEMP/web/ui_beta");
        }
        //if(jsfilepreFix == "ui.loading.failed."){
        //  //ui.loading.failed 特殊处理
        //  var htmlfileName = jsfile.replace(".js",".html.js");
        //  fs.writeFileSync(jsfile.split('tempWeb').join('web'), uglifyJs.minify(uicode[2], {fromString: true, mangle:{except: ['$super']}}).code);
        //  fs.writeFileSync(htmlfileName.split('tempWeb').join('web'), uglifyJs.minify(uicode[1], {fromString: true, mangle:{except: ['$super']}}).code);
        //}else{
        fs.writeFileSync(jsfile.split('tempWeb').join('web'), uglifyJs.minify(uicode.join(''), {fromString: true, mangle:{except: ['$super']}}).code);
        //}
      }
    })
  }
//设置压缩任务
  grunt.registerTask('setCompress', function () {
    var compressCfg = grunt.config.get('compress');
    for (var i=0;i< HYBRID_COMPRESS_PATHS.length;i++) {
      var fileCwd = HYBRID_COMPRESS_PATHS[i],
        fileDest = '/lizard';
      var lizardVer = HYBRID_COMPRESS_PATHS[i].match(/[0-9]\.[0-9]/);
      if(i != HYBRID_COMPRESS_PATHS.length -1){
        fileCwd += "/webresource/code/lizard/"+lizardVer;
        fileDest += "/webresource/code/lizard/"+lizardVer;
      }
      var file = {
        "src"   : ["**"],
        "cwd"   : fileCwd,
        "expand": true,
        "dest"  : fileDest
      }
      compressCfg.main.files.push(file);
    }
    grunt.log.writeln(JSON.stringify(compressCfg));
    grunt.config.set('compress', compressCfg);
    grunt.task.run(['compress:main']);
  });

  /**
   * 初始化环境变量
   */
  grunt.registerTask('initGruntConfig', function (version,tagName) {
    console.log(version +":"+tagName);
    if (!GLOBAL_CONFIG_STR) {
      GLOBAL_CONFIG_STR = JSON.stringify(grunt.config.getRaw('config'));
    }
    var origincfgData = grunt.config.get('config'),
      pkg = grunt.config.get('pkg'),
      data = {
        ROOT_DIR         : pkg.root_dir,
        LIZARD_VERSION   : version,
        PROJECT_DIR      : pkg.root_dir + version,
        HYBRID_DEPLOY_DIR: pkg.root_dir + version + '/hybrid/lizard',
        TEMP_DIR         : "TEMP",
        DEBUG            : grunt.option('debug')
      }
    HYBRID_COMPRESS_PATHS.push(data.HYBRID_DEPLOY_DIR);

    var compileData = {
      data: data
    }
    var config = JSON.parse(grunt.template.process(GLOBAL_CONFIG_STR, compileData));
    console.log(tagName);
    if(tagName && tagName != "undefined"){
      config.BANNER =  config.BANNER.replace("*/","* tag:" + tagName + '\n' + '*/');
    }
    grunt.config.set('config', config);
    grunt.log.debug(config)
  });

  /**
   * 默认入口
   */
  grunt.registerTask('cTest', function () {
    grunt.task.run(['hybrid:all']);
    //grunt.task.run(['web:2.1']);
  });

};
