import { testGoodValue, testBadValue } from "./consoleThemes.js";

function buildTestFailMsg({
  title,
  titleInverse,
  expectedValue,
  actualValue,
  inverse = false,
}) {
  if (typeof title !== "string") {
    throw new TypeError("Expected title to be a string.");
  }

  if (typeof titleInverse !== "string") {
    throw new TypeError("Expected titleInverse to be a string.");
  }

  if (typeof inverse !== "boolean") {
    throw new TypeError("Expected inverse to be a boolean.");
  }

  let message = inverse ? titleInverse : title;

  message += "\n";

  const exceptStr = inverse ? "усе, крім " : "";

  expectedValue = testGoodValue(`${exceptStr}${expectedValue}`);

  message += `Очікувано: ${expectedValue}\n`;
  message += `Фактично: ${testBadValue(actualValue)}`;

  return message;
}

export default buildTestFailMsg;
