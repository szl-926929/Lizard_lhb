import * as Util from './helpers';
import {default as configs} from './mockConfig';

export function addMockSupport (factory) {
  return serviceDefinition => {
    const {ns, name, url, env,} = serviceDefinition;
    const mockKey = Util.getIdendifier(ns, name);
    const mockConfig = configs[mockKey];
    const oldEndpoint = factory(serviceDefinition);
    if (!Util.validateConfig(mockConfig)) {
      return oldEndpoint;
    }
    return payload => {
      const bestStrategy = Util.findBestMatch(mockConfig, payload);
      if (Util.shouldByPass(bestStrategy)) {
        return oldEndpoint(payload);
      } else {
        return Util.runMock(bestStrategy,payload);
      }
    }
  }
}
