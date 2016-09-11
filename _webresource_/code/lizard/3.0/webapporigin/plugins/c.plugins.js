/**
 * @Description: 插件的集合类
 * @author shbzhang@ctrip.com
 * @date  2013/6/23 16:26:12
 * @version V1.0
 */
define(['cUnderscorePlugin','cJsonPlugin','cMarketPlugin','cSafariPlugin','cStatisticsPlugin', 'cZeptoPlugin', Lizard.config.usesvg?'cSvgPlugin':''],
  function (UndersorePlugin,JsonPlugin, MarketPlugin,SafariPlugin,cStatisticsPlugin, cZeptoPlugin, cSvgPlugin) {
  return {
    regStatisticsEvent: cStatisticsPlugin,
    regMarketEvent: MarketPlugin
  };
});