import { doTestFailure } from "../fail.js";

export function buildFactNegationFn(mavka, factObj) {
  return mavka.makeProxyFunction(() => {
    factObj["навпаки"] = factObj["навпаки"].asJsValue() ? mavka.no : mavka.yes;

    return mavka.makePortal(factObj);
  });
}

export function buildCompFn(mavka, factObj) {
  return mavka.makeProxyFunction((args, context) => {
    let expected;

    if (Array.isArray(args)) {
      expected = args[0];
    } else {
      expected = args["очікуване_значення"];
    }

    if (typeof expected === "undefined" || mavka.isUndefined(expected)) {
      mavka.fall(
        context,
        mavka.makeText(
          'Очікується, що у Дію дорівнює() передано параметр "очікуване_значення".'
        )
      );
    }

    let testMetadata = {
      title: "Очікується, що обʼєкти рівні.",
      titleInverse: "Очікується, що обʼєкти не є рівні.",
      expectedValue: expected.asText(context).asJsValue(context),
      actualValue: factObj["значення"].asText(context).asJsValue(context),
      inverse: factObj["навпаки"].asJsValue(),
    };

    let fails = factObj["значення"]
      .doCompareNotEquals(context, expected)
      .asJsValue();
    fails = testMetadata.inverse ? !fails : fails;

    if (fails) {
      doTestFailure(testMetadata, factObj, context, mavka);
    }
  });
}

export function buildIsEmptyFn(mavka, factObj) {
  return mavka.makeProxyFunction((_, context) => {
    let testMetadata = {
      title: "Очікується, що обʼєкт є пусто.",
      titleInverse: "Очікується, що обʼєкт не є пусто.",
      expectedValue: mavka.empty.asText(context).asJsValue(context),
      actualValue: factObj["значення"].asText(context).asJsValue(context),
      inverse: factObj["навпаки"].asJsValue(),
    };

    let fails = !mavka.isEmpty(factObj["значення"]);
    fails = testMetadata.inverse ? !fails : fails;

    if (fails) {
      doTestFailure(testMetadata, factObj, context, mavka);
    }
  });
}

export function buildIsTrueFn(mavka, factObj) {
  return mavka.makeProxyFunction((_, context) => {
    let testMetadata = {
      title: "Очікується, що твердження є вірне.",
      titleInverse: "Очікується, що твердження не є вірне.",
      expectedValue: mavka.yes.asText(context).asJsValue(context),
      actualValue: factObj["значення"].asText(context).asJsValue(context),
      inverse: factObj["навпаки"].asJsValue(),
    };

    let fails = factObj["значення"]
      .doCompareNotEquals(context, mavka.yes)
      .asJsValue();
    fails = testMetadata.inverse ? !fails : fails;

    if (fails) {
      doTestFailure(testMetadata, factObj, context, mavka);
    }
  });
}
