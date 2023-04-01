import { doTestFailure } from "../fail.js";

export function buildFallFn(mavka, factObj) {
  return mavka.makeProxyFunction((_, context) => {
    const testedDiia = factObj["значення"];

    if (!mavka.isDiia(testedDiia)) {
      mavka.fall(context, mavka.makeText("Очікується, що параметр припустити() є Дією."));
    }

    const inverse = factObj["навпаки"].asJsValue();
    let expectedValue = inverse ? "не падає" : "падає";

    let actualValue = null;
    let fails = false;

    try {
      testedDiia.doCall(context);
      actualValue = "не падає";
    } catch (e) {
      actualValue = "падає";
    }

    fails = expectedValue !== actualValue;

    if (inverse) {
      expectedValue = actualValue;
    }
    
    let testMetadata = {
      title: "Очікується, що Дія падає",
      titleInverse: "Очікується, що Дія не падає",
      expectedValue,
      actualValue,
      inverse,
    };

    if (fails) {
      doTestFailure(testMetadata, factObj, context, mavka);
    }
  });
}
