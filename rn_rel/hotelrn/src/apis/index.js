import configureEndpoints from './configureEndpoints';
import {createCFetchEndpoint} from './backends/createCFetchEndpoint';
import {warn} from '../libs/log';

//import {addThunkPayloadSupport} from './thunkPayload';

var endpointFactory = createCFetchEndpoint;



if(__DEV__) {
  endpointFactory = require('./mock').addMockSupport(endpointFactory);
  warn('------DEV MODE: MOCK ENABLED!------');
}
//endpointFactory = addThunkPayloadSupport(endpointFactory);

export default configureEndpoints(endpointFactory);
