export function createServiceDefinition(definition) {
  return Object.freeze({
    ns: definition.ns,
    name: definition.name,
    url: definition.url,
    timeout: definition.timeout,
    env: definition.env,
  });
};
