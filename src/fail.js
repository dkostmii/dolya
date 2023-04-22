import buildTestFailMsg from "./output/testFailMsg.js";

export function buildFailFn(mavka) {
  return mavka.makeProxyFunction((args, context) => {
    const message = Array.isArray(args) ? args[0] : args;

    if (!mavka.isText(message)) {
      mavka.fall(
        context,
        mavka.makeText("Очікується, що перший параметр є текст.")
      );
    }

    mavka.fall(context, message);
  });
}

export function doTestFailure(testMetadata, factObj, context, mavka) {
  const fallMsg = buildTestFailMsg(testMetadata);

  factObj["провалити"].doCall(context, mavka.makeText(fallMsg));
}
