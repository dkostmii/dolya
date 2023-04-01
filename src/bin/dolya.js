#!/usr/bin/env node

import Mavka from "mavka";
import FileLoader from "mavka/loaders/fileLoader.js";
import DiiaParserSyntaxError from "mavka";
import buildTestingContext from "../testing.js";

import glob from "glob-promise";

//const cwd = process.cwd();

let command = process.argv[2];

function buildGlobalContext(mavka) {
  const context = new mavka.Context(mavka, null, {
    "друк": mavka.makeProxyFunction((args, context) => {
      console.log(
        ...args
          .map((arg) => {
            return arg.asText(context).asJsValue(context);
          })
      );

      return mavka.empty;
    }),
  });

  mavka.global.getContext = () => context;

  return context;
}

function buildLoader(mavka) {
  return new FileLoader(mavka);
}

function buildExternal(mavka) {
  // FIXME: return promptSync as in https://github.com/mavka-ukr/mavka/blob/main/src/bin/mavka.js
  return;
}

const mavka = new Mavka({
  buildGlobalContext,
  buildLoader,
  buildExternal
});

const testingContext = buildTestingContext(mavka);

mavka.context = testingContext;
mavka.global.getContext = () => mavka.context;

if (!command.endsWith(".м")) {
  command = `${command}.м`;
}

const files = await glob(command);

if (files.length === 0) {
  console.log(`Не знайдено жодного файлу з тестами для візерунку ${command}`);
  process.exit(0);
}

console.log(`Знайдено ${files.length} файли/-ів з тестами\n`);

for (const file of files) {
  try {
    console.log(`${file}\n`);
    await mavka.loader.loadModuleFromFile(testingContext, file);
  } catch (e) {
    if (e instanceof DiiaParserSyntaxError) {
      console.error(`Не вдалось зловити: ${e.message}`);
    } else if (e instanceof mavka.ThrowValue) {
      console.error(`Не вдалось зловити: ${e.value.asText(testingContext).asJsValue(testingContext)}`);
    } else {
      throw e;
    }
  }
}

