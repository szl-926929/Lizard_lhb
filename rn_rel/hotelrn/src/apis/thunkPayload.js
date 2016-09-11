function getPayload(payload) {
  return typeof(payload) == 'function' ? payload() : payload;
}

export function addThunkPayloadSupport (factory) {
  return serviceDefinition => {
    const oldEndpoint = factory(serviceDefinition);
    return payload => {
      if (typeof payload === 'function') {
        return oldEndpoint(payload());
      } else {
        return oldEndpoint(payload);
      }
    }
  }
}
