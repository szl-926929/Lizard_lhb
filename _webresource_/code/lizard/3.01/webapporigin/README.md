# Lizard 总体介绍，必读
## Lizard 环境介绍
### web环境
就是线上看到的h5网站，比如线上团购项目[tuan](http://m.ctrip.com/webapp/tuan), 
这个环境就是BU开发最常用的环境  
变种环境: ``debug``, 在url后面加个debug就能看到源码，这个是后台程序实现
```
http://m.ctrip.com/webapp/tuan          // 正式
http://m.ctrip.com/webapp/tuan?debug=1  // 源码
```

### seo环境
根据SEO程序，把webapp项目转成SEO页面，其实就是把url中的``webapp``替换成``html5``, 比如
```
http://m.ctrip.com/webapp/tuan  // webapp连接
http://m.ctrip.com/html5/tuan   // seo连接
```

### hybrid环境
通过打包程序，把webapp项目转成静态代码，然后放在携程app里面运行  
变种环境: hybrid直连环境，就是hybrid包里面只有index.html，  
其他资源通过``http``协议去加载。 
```
1. 项目全部变成静态代码
2. hybrid debug包
3. 只有index.html的hybrid包
```

### h5直连环境
通过携程app访问线上h5的站点，这时webapp项目是跑在携程app里面的webview
```
比如通过我携左上角的扫一扫
```
## Lizard demo
- [demo2.0](http://git.dev.sh.ctripcorp.com/wliao/lizard2-0-demo/tree/master/demo/2.0)
- [demo2.1](http://git.dev.sh.ctripcorp.com/wliao/lizard2-0-demo/tree/master/demo/2.1)

## [Lizard 打包](http://git.dev.sh.ctripcorp.com/wliao/lizard2-0-demo/tree/master/package)
- h5打包
```
grunt web2.0 --path=代码路径
```
- hybrid打包
```
grunt package2.0 --path=c:\\path\\1
```

## Lizard SEO
webapp项目做好后，如何测试SEO页面是否正确

## Lizard 模块列表获取
在控制台运行
```
require.s.contexts._.config
```

## Lizard代码地址及host, 任选一种
```
// 地址
prd: http://webresource.c-ctrip.com/code/lizard/2.1/web/lizard.seed.js
uat: webresource.uat.qa.nt.ctripcorp.com
fws: webresource.fws.qa.nt.ctripcorp.com

// host
prd: 不需要设置
uat: 10.2.24.130
fws: 10.2.6.33
```

## Lizard相关链接
- [Hybrid document](http://conf.ctripcorp.com/pages/viewpage.action?pageId=57531569)
- [2.0 hybrid demo](http://svn.ui.sh.ctripcorp.com/lizard/webapp/demo/index.html)
- [2.1 UI文档](http://svn.ui.sh.ctripcorp.com/lizard/webapp/demo2.1/index.html)
- [bridge.js](http://jimzhao2012.github.io/api/classes/CtripBar.html)
- [增量查询](http://wb.mobile.sh.ctripcorp.com/hybridpublish/pkg.html)
- \\\cn1\ctrip\工具区\
- [框架git](http://code.ctripcorp.com/#/admin/projects/Framework/Presentation/Lizard)
```
git push origin HEAD:refs/for/Dev6.3 
```
- [浏览器配置seo](http://conf.ctripcorp.com/pages/viewpage.action?pageId=48859121)
- [native测试包](http://svn.dev.sh.ctripcorp.com/svn/apk/%E4%B8%BB%E7%89%88/)
