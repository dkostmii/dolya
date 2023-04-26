#!/usr/bin/env node

import Mavka from "mavka";
import promptSync from "@kant2002/prompt-sync";
import FileLoader from "mavka/loaders/fileLoader.js";
import DiiaParserSyntaxError from "mavka";
import buildTestingContext from "../testing.js";
import { version } from "../../version.js";

import glob from "glob-promise";

const cwdPath = process.cwd();

let command = process.argv[2];

function buildGlobalContext(mavka) {
  const context = new mavka.Context(mavka, null, {
    друк: mavka.makeProxyFunction((args, context) => {
      console.log(
        ...args.map((arg) => {
          return arg.asText(context).asJsValue(context);
        })
      );

      return mavka.empty;
    }),
    вивести: mavka.makeProxyFunction((args, context) => {
      process.stdout.write(
        args
          .map((arg) => {
            return arg.asText(context).asJsValue(context);
          })
          .join("")
      );

      return mavka.empty;
    }),
    читати: mavka.makeProxyFunction((args, context) => {
      const ask = Object.values(args).length
        ? args[0].asText(context).asJsValue(context)
        : undefined;

      return mavka.makeText(
        mavka.external.promptSync({ sigint: true, encoding: "windows-1251" })(
          ask
        )
      );
    }),
  });

  context.set("__шлях_до_папки_кореневого_модуля__", mavka.makeText(cwdPath));
  context.set("__шлях_до_папки_модуля__", mavka.makeText(cwdPath));
  context.set("__шлях_до_папки_паків__", mavka.makeText(`${cwdPath}/.паки`));

  return context;
}

function buildLoader(mavka) {
  return new FileLoader(mavka);
}

function buildExternal() {
  return {
    promptSync,
  };
}

// Command handling
if (!command) {
  command = "*.тест.м"; // If command is not given, use доля *.тест.м to launch all test files
} else if (command.toLowerCase() === "версія") {
  console.log(version);
  process.exit();
} else if (command.toLowerCase() === "допомога") {
  console.log(
    `
Використання:
  доля <візерунок>
  доля <команда>

Доступні команди:
  доля <візерунок> - шукає усі файли за візерунком GLOB (файли повинні мати закінчення .м)
  доля версія - друкує версію Долі
  доля допомога - друкує це повідомлення

Візерунок:
  у візерунку можна писати звичайні шляхи
  крім цього, використовуються наступні позначення:
    * - будь-який знак, крім "/"
    ** - будь-який знак, включно з "/" (для рекурсивного сканування)
  `.trim()
  );
  process.exit();
}

if (!command.endsWith(".м")) {
  command = `${command}.м`;
}

const mavka = new Mavka({
  buildGlobalContext,
  buildLoader,
  buildExternal,
});

const testingContext = buildTestingContext(mavka);

mavka.context = testingContext;
mavka.global.getContext = () => mavka.context;

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
      console.error(
        `Не вдалось зловити: ${e.value
          .asText(testingContext)
          .asJsValue(testingContext)}`
      );
    } else {
      throw e;
    }
  }
}
