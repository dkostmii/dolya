import { doTestFailure } from "../fail.js";

import {
  buildListContainsElHelperFn,
  buildListEquivalentToListHelperFn
} from "./helper.js";

export function buildHasLengthFn(mavka, factObj) {
  return mavka.makeProxyFunction((args, context) => {
    if (!mavka.isNumber(args[0])) {
      mavka.fall(context, mavka.makeText("Очікується, що у має_довжину() передано число."));
    }

    factObj["значення"] = factObj["значення"].get(context, "довжина").doCall(context);

    const inverse = factObj["навпаки"].asJsValue();

    const expectedValue = factObj["значення"].asText(context).asJsValue(context);
    const actualValue = args[0].asText(context).asJsValue(context);

    let fails = factObj["значення"].doCompareNotEquals(context, args[0]).asJsValue();

    fails = inverse ? !fails : fails;

    let testMetadata = {
      title: `Очікується, що список має довжину ${expectedValue}`,
      titleInverse: `Очікується, що список має довжину, відмінну від ${expectedValue}`,
      expectedValue,
      actualValue,
      inverse,
    };

    if (fails) {
      doTestFailure(testMetadata, factObj, context, mavka);
    }
  });
}

export function buildContainsElFn(mavka, factObj) {
  return mavka.makeProxyFunction((args, context) => {
    if (args.length === 0) {
      mavka.fall(context, mavka.makeText("Очікується, що у містить_елемент() передано параметр."));
    }

    const inverse = factObj["навпаки"].asJsValue(context);

    const containsElHelperFn = buildListContainsElHelperFn(mavka);
    
    const elementValue = args[0].asText(context).asJsValue(context);

    const containsResult = containsElHelperFn.doCall(context, [factObj["значення"], args[0]]);

    let fails = !containsResult.asJsValue(context);
    fails = inverse ? !fails : fails;

    let testMetadata = {
      title: `Очікується, що список містить елемент ${elementValue}`,
      titleInverse: `Очікується, що список не містить елементу ${elementValue}`,
      expectedValue: mavka.yes.asText(context).asJsValue(context),
      actualValue: containsResult.asText(context).asJsValue(context),
      inverse,
    };

    if (fails) {
      doTestFailure(testMetadata, factObj, context, mavka);
    }
  });
}

export function buildEquivalentToListFn(mavka, factObj) {
  return mavka.makeProxyFunction((args, context) => {
    if (!mavka.isList(args[0])) {
      mavka.fall(context, mavka.makeText("Очікується, що у еквівалентний_списку() передано список, що очікується."));
    }

    const expectedValue = args[0].asText(context).asJsValue(context);
    const actualValue = factObj["значення"].asText(context).asJsValue(context);

    const listsEquivalentHelperFn = buildListEquivalentToListHelperFn(mavka);

    const areEquivalent = listsEquivalentHelperFn.doCall(context, [factObj["значення"], args[0]]);

    const inverse = factObj["навпаки"].asJsValue(context);

    let testMetadata = {
      title: `Очікується, що список еквівалентний списку ${expectedValue}`,
      titleInverse: `Очікується, що список не є еквівалентний списку ${expectedValue}`,
      expectedValue,
      actualValue,
      inverse,
    };

    let fails = !areEquivalent;
    fails = inverse ? !fails : fails;

    if (fails) {
      doTestFailure(testMetadata, factObj, context, mavka);
    }
  });
}
