import {
    fetchSOA2,
} from '@ctrip/crn'
import {buildUrl, buildUrlWithEnv} from './helpers';
import {warn} from '../../libs/log';

export function createCFetchEndpoint(serviceDefinition) {
  const {ns, name, url, env, ...otherDefs} = serviceDefinition;

  return async payload => {
    const finalUrl = await buildUrlWithEnv(ns, name, url);
    try {
      const response = await fetchSOA2(finalUrl, {body: payload});
      return response;
    } catch (e) {
      warn(`[ServiceAPI][Failed] <${ns.key}/${name}> ${e.message}\nURL: ${finalUrl}\nRequest:`, payload);
      throw e;
    }
  };
}
