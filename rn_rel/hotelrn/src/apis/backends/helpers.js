import {HotelURL} from '../../libs/url';

export function buildUrl(domain = 'http://m.ctrip.com', subEnv, ns, name, url) {
  const { key, code, path, noSubenv } = ns;
  const result = `${domain}/restapi/soa2/${code}/${path?path+'/':''}${name}${subEnv && !noSubenv ? '?subEnv='+subEnv : ''}`;
  return result;
}

export async function buildUrlWithEnv(ns, name, url) {
  try{
    var host = await HotelURL.getServiceHost();
    return buildUrl(host.domain, host.subEnv, ns, name, url);
  } catch(e) {
    return buildUrl(undefined, undefined, ns, name, url);
  }
}
