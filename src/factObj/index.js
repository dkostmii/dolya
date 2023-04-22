import {
  buildCompFn,
  buildFactNegationFn,
  buildIsEmptyFn,
  buildIsTrueFn,
} from "./primitive.js";

import { buildFallFn } from "./fall.js";

import {
  buildHasLengthFn,
  buildContainsElFn,
  buildEquivalentToListFn,
} from "./list.js";

function buildFactObj(mavka, factObj) {
  factObj["не_"] = buildFactNegationFn(mavka, factObj);
  factObj["дорівнює"] = buildCompFn(mavka, factObj);
  factObj["є_пусто"] = buildIsEmptyFn(mavka, factObj);
  factObj["є_вірне"] = buildIsTrueFn(mavka, factObj);

  factObj["падає"] = buildFallFn(mavka, factObj);

  factObj["має_довжину"] = buildHasLengthFn(mavka, factObj);
  factObj["містить_елемент"] = buildContainsElFn(mavka, factObj);
  factObj["еквівалентний_списку"] = buildEquivalentToListFn(mavka, factObj);

  return factObj;
}

export default buildFactObj;
