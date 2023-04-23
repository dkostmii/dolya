import buildExpectContext from "./expect.js";
import {
  testFailStyle,
  testPassStyle,
  testTitleStyle,
} from "./output/consoleThemes.js";

function buildTestingContext(mavka) {
  const context = new mavka.Context(mavka, mavka.context);

  context.set(
    "тестовий_випадок",
    mavka.makeProxyFunction((args, context) => {
      let testName, testScenario;

      if (Array.isArray(args)) {
        testName = args[0];
        testScenario = args[1];
      } else {
        testName = args["назва"];
        testScenario = args["сценарій"];
      }

      if (typeof testName === "undefined" || !mavka.isText(testName)) {
        mavka.fall(context, mavka.makeText('Очікується, що "назва" є текст.'));
      }

      if (typeof testScenario === "undefined" || !mavka.isDiia(testScenario)) {
        mavka.fall(context, mavka.makeText('Очікується, що "сценарій" є Дія.'));
      }

      buildExpectContext(mavka, context);

      try {
        testScenario.doCall(context);
        console.log(
          testPassStyle("✔ успішно"),
          testTitleStyle(testName.asJsValue()) + "\n"
        );
      } catch (e) {
        if (e instanceof mavka.ThrowValue) {
          console.error(
            testFailStyle("✖ провалено"),
            testTitleStyle(testName.asJsValue(context))
          );
          console.error(e.value.asText(context).asJsValue(context) + "\n");
        } else {
          console.error(`Не вдалось зловити: ${e}`);
        }
      }
    })
  );

  return context;
}

export default buildTestingContext;
