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
      if (!mavka.isText(args[0])) {
        mavka.fall(
          context,
          mavka.makeText("Очікується, що перший параметр є текст.")
        );
      }

      if (!mavka.isDiia(args[1])) {
        mavka.fall(
          context,
          mavka.makeText("Очікується, що другий параметр є Дія.")
        );
      }

      buildExpectContext(mavka, context);

      const scenarioFn = args[1];

      try {
        scenarioFn.doCall(context);
        console.log(
          testPassStyle("✔ успішно"),
          testTitleStyle(args[0].asJsValue()) + "\n"
        );
      } catch (e) {
        if (e instanceof mavka.ThrowValue) {
          console.error(
            testFailStyle("✖ провалено"),
            testTitleStyle(args[0].asJsValue(context))
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
