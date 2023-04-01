import { testGoodValue, testBadValue } from "./consoleThemes.js";

function buildTestFailMsg({ title, titleInverse, expectedValue, actualValue, inverse = false }) {
  let message = inverse ? titleInverse : title;

  message += "\n";

  const exceptStr = inverse ? "усе, крім " : "";

  expectedValue = testGoodValue(`${exceptStr}${expectedValue}`);

  message += `Очікувано: ${expectedValue}\n`;
  message += `Фактично: ${testBadValue(actualValue)}`;

  return message;
}

export default buildTestFailMsg;
