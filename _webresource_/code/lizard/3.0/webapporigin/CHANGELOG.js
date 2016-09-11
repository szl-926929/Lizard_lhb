/**
 * changelog list
 * @namespace changelog
 * @example  
 * 打包程序更新
 * 1. 升级模块化打包simple模式，打包全部强制simple模式
 * 2. 增加weinre调试
 * 3. h5和hybrid共用一套模块化打包逻辑
 * 4. 其他模板语言通过插件的形式打包
 *
 * 更新步骤
 * 1. npm config set registry http://npm.dev.sh.ctripcorp.com:8001/
 * 2. 更新打包代码, ``git pull``
 * 3. 删掉打包下面的所有node_modules, ``rm -f node_modules``
 * 4. npm cache clean
 * 5. npm install
 */