/**
 * @Description: 插件的集合类
 * @author shbzhang@ctrip.com
 * @date  2013/6/23 16:26:12
 * @version V1.0
 */
define(['cUnderscorePlugin','cJsonPlugin','cMarketPlugin','cSafariPlugin','cStatisticsPlugin', Lizard.config.usesvg?'cSvgPlugin':''],
  function (UndersorePlugin,JsonPlugin, MarketPlugin,SafariPlugin,cStatisticsPlugin, cSvgPlugin) {
  return {
    regStatisticsEvent: cStatisticsPlugin,
    regMarketEvent: MarketPlugin
  };
});