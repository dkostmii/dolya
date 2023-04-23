import buildTestFailMsg from "./output/testFailMsg.js";

export function buildFailFn(mavka) {
  return mavka.makeProxyFunction((args, context) => {
    let message;

    if (Array.isArray(args)) {
      message = args[0];
    } else {
      message = args["повідомлення"];
    }

    if (typeof message === "undefined" || !mavka.isText(message)) {
      mavka.fall(
        context,
        mavka.makeText('Очікується, що "повідомлення" є текст.')
      );
    }

    mavka.fall(context, message);
  });
}

export function doTestFailure(testMetadata, factObj, context, mavka) {
  const fallMsg = buildTestFailMsg(testMetadata);

  factObj["провалити"].doCall(context, [mavka.makeText(fallMsg)]);
}
