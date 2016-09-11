import { Modes } from './Constants';

const {Resolve, Reject, ByPass} = Modes;

export function getIdendifier(ns, name, url){
  const {key} = ns;
  return `${key}/${name}`;
}

export function validateConfig(config) {
  if (!config || !config.length) {
    return false;
  }

  return true;
}

export function findBestMatch(config, payload) {
  if (validateConfig(config)) {
    return config.find(strategy =>
                  !strategy.predicate || strategy.predicate(payload));
  }
}

export function shouldByPass(strategy) {
  return !strategy || strategy.mode == ByPass;
}

export function runMock(strategy,payload) {
  const { mode, result, delay: delayTime } = strategy;

  if (strategy.mode == Resolve) {
    let rs=result;
    if(strategy.isABTest){
      rs=getAbResult(result,payload);
    }
    return new Promise((resolve, reject) => delay(delayTime, resolve, [rs]));
  }

  return new Promise((resolve, reject) => delay(delayTime, reject, [result]));
}
function getAbResult(result,payload) {
  let rs=undefined;
  const {tname}=payload;
  rs=result[tname];
  if(rs){
    rs={rc:200,tresult:rs}
  }
  return rs;
}
function delay(timeout, action, args, context) {
  return setTimeout(() => action.apply(context, args), timeout || 0);
}
