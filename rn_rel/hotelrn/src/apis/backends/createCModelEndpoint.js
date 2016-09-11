import cModel from '../../libs/Lib/cModel';
import {buildUrl, getPayload} from './helpers';

export function createCModelEndpoint(serviceDefinition) {
  const {ns, name, url, env, ...otherDefs} = serviceDefinition;
  const finalUrl = buildUrl(env, ns, name, url);

  return async payload => {
    const finalUrl = await buildUrlWithEnv(ns, name, url);
    const request = cModel.createModel({
      url: finalUrl,
      param: payload,
      ...otherDefs,});
    request.execute( data => resolve(data), error => reject(error));
  };
}
