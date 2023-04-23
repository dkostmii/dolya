import { doTestFailure } from "../fail.js";

import {
  buildListContainsElHelperFn,
  buildListEquivalentToListHelperFn,
} from "./helper.js";

export function buildHasLengthFn(mavka, factObj) {
  return mavka.makeProxyFunction((args, context) => {
    let expectedLength;

    if (Array.isArray(args)) {
      expectedLength = args[0];
    } else {
      expectedLength = args["очікувана_довжина"];
    }

    if (
      typeof expectedLength === "undefined" ||
      !mavka.isNumber(expectedLength)
    ) {
      mavka.fall(
        context,
        mavka.makeText(
          'Очікується, що у параметрі "очікувана_довжина" Дії має_довжину() передано число.'
        )
      );
    }

    factObj["значення"] = factObj["значення"]
      .get(context, "довжина")
      .doCall(context);

    const inverse = factObj["навпаки"].asJsValue();

    const expectedValue = expectedLength.asText(context).asJsValue(context);
    const actualValue = factObj["значення"].asText(context).asJsValue(context);

    let fails = factObj["значення"]
      .doCompareNotEquals(context, expectedLength)
      .asJsValue();

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
    let item;

    if (Array.isArray(args)) {
      item = args[0];
    } else {
      item = args["елемент"];
    }

    if (typeof item === "undefined" || mavka.isUndefined(item)) {
      mavka.fall(
        context,
        mavka.makeText(
          'Очікується, що у Дію містить_елемент() передано параметр "елемент".'
        )
      );
    }

    const inverse = factObj["навпаки"].asJsValue(context);

    const containsElHelperFn = buildListContainsElHelperFn(mavka);

    const elementValue = item.asText(context).asJsValue(context);

    const containsResult = containsElHelperFn.doCall(context, [
      factObj["значення"],
      item,
    ]);

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
    let expectedList;

    if (Array.isArray(args)) {
      expectedList = args[0];
    } else {
      expectedList = args["очікуваний_список"];
    }

    if (typeof expectedList === "undefined" || !mavka.isList(expectedList)) {
      mavka.fall(
        context,
        mavka.makeText(
          "Очікується, що у еквівалентний_списку() передано список, що очікується."
        )
      );
    }

    const expectedValue = expectedList.asText(context).asJsValue(context);
    const actualValue = factObj["значення"].asText(context).asJsValue(context);

    const listsEquivalentHelperFn = buildListEquivalentToListHelperFn(mavka);

    const areEquivalent = listsEquivalentHelperFn.doCall(context, [
      factObj["значення"],
      expectedList,
    ]);

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
