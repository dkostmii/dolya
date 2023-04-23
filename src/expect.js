import { buildFailFn } from "./fail.js";
import buildFactObj from "./factObj/index.js";

import { testTitleStyle } from "./output/consoleThemes.js";

function buildExpectContext(mavka, testCaseContext) {
  testCaseContext.set(
    "припустити",
    mavka.makeProxyFunction((args) => {
      let value;

      if (Array.isArray(args)) {
        value = args[0];
      } else {
        value = args["значення"];
      }

      let factObj = {
        значення: value,
        навпаки: mavka.no,
        провалити: buildFailFn(mavka),
      };

      factObj = buildFactObj(mavka, factObj);

      return mavka.makePortal(factObj);
    })
  );

  testCaseContext.set("провалити", buildFailFn(mavka));

  testCaseContext.set(
    "друк",
    mavka.makeProxyFunction((args, context) => {
      if (!Array.isArray(args)) {
        args = Object.values(args);
      }

      console.log(
        testTitleStyle("Тестовий випадок виводить:"),
        ...args.map((arg) => {
          return arg.asText(context).asJsValue(context);
        })
      );

      return mavka.empty;
    })
  );
}

export default buildExpectContext;
