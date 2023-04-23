export function buildListContainsElHelperFn(mavka) {
  return mavka.makeProxyFunction((args, context) => {
    let list, searchItem;

    if (Array.isArray(args)) {
      list = args[0];
      searchItem = args[1];
    } else {
      list = args["послідовність"];
      searchItem = args["елемент"];
    }

    if (!mavka.isList(list)) {
      mavka.fall(
        context,
        mavka.makeText(
          'Очікується, що у параметрі "послідовність" Дії м_ел() передано список.'
        )
      );
    }

    if (mavka.isUndefined(searchItem)) {
      mavka.fall(
        context,
        mavka.makeText(
          'Очікується, що у Дію м_ел() передано параметр "елемент".'
        )
      );
    }

    const predFn = mavka.makeProxyFunction((args, predFnContext) => {
      let listEl;

      if (Array.isArray(args)) {
        listEl = args[0];
      } else {
        listEl = args["ел"];
      }

      if (mavka.isUndefined(listEl)) {
        mavka.fall(
          predFnContext,
          mavka.makeText(
            'Очікується, що у функцію перевірки передано параметр "ел".'
          )
        );
      }

      return searchItem.doCompareEquals(predFnContext, listEl);
    });

    return list
      .get(context, "знайти_позицію")
      .doCall(context, [predFn])
      .doCompareGreaterThanOrEquals(context, mavka.makeNumber(0));
  });
}

export function buildListEquivalentToListHelperFn(mavka) {
  return mavka.makeProxyFunction((args, context) => {
    let factList, expectedList;

    if (Array.isArray(args)) {
      factList = args[0];
      expectedList = args[0];
    } else {
      factList = args["фактичний"];
      expectedList = args["очікуваний"];
    }

    if (!mavka.isList(factList)) {
      mavka.fall(
        context,
        mavka.makeText(
          'Очікується, що у параметрі "фактичний" Дії сп_екв() передано список.'
        )
      );
    }

    if (!mavka.isList(expectedList)) {
      mavka.fall(
        context,
        mavka.makeText(
          'Очікується, що у параметрі "очікуваний" Дії сп_екв() передано список.'
        )
      );
    }

    args = [factList, expectedList];

    const lengths = args
      .slice(0, 2)
      .map((list) => list.get(context, "довжина").doCall(context));

    const eqLength = lengths[0].doCompareEquals(context, lengths[1]);

    if (!eqLength.doCompareEquals(context, mavka.yes)) {
      return mavka.no;
    }

    const [actualValues, expectedValues] = args.map((list) => list.meta.values);

    for (let i = 0; i < expectedValues.length; i++) {
      if (
        !expectedValues[i].doCompareEquals(context, actualValues[i]).asJsValue()
      ) {
        return mavka.no;
      }
    }

    return mavka.yes;
  });
}
