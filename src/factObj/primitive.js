import { doTestFailure } from "../fail.js";

export function buildFactNegationFn(mavka, factObj) {
  return mavka.makeProxyFunction(() => {
    factObj["навпаки"] = factObj["навпаки"].asJsValue() ? mavka.no : mavka.yes;
    
    return mavka.makePortal(factObj);
  });
}

export function buildCompFn(mavka, factObj) {
  return mavka.makeProxyFunction((args, context) => {
    if (args.length !== 1) {
      mavka.fall(context, mavka.makeText("Очікується, що у дорівнює() передано один параметр."));
    }

    let testMetadata = {
      title: "Очікується, що обʼєкти рівні.",
      titleInverse: "Очікується, що обʼєкти не є рівні.",
      expectedValue: args[0].asText(context).asJsValue(context),
      actualValue: factObj["значення"].asText(context).asJsValue(context),
      inverse: factObj["навпаки"].asJsValue(),
    };

    let fails = factObj["значення"].doCompareNotEquals(context, args[0]).asJsValue();
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

    let fails = factObj["значення"].doCompareNotEquals(context, mavka.yes).asJsValue();
    fails = testMetadata.inverse ? !fails : fails;

    if (fails) {
      doTestFailure(testMetadata, factObj, context, mavka);
    }
  });
}
