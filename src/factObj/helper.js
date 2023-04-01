export function buildListContainsElHelperFn(mavka) {
  return mavka.makeProxyFunction((args, context) => {
    if (!mavka.isList(args[0])) {
      mavka.fall(context, mavka.makeText("Очікується, що у м_ел() передано список та шуканий елемент."));
    }

    if (args.length !== 2) {
      mavka.fall(context, mavka.makeText("Очікується, що у м_ел() передано список та шуканий елемент."));
    }

    const [list, searchItem] = args;

    const predFn = mavka.makeProxyFunction((args, predFnContext) => {
      if (args.length !== 1) {
        mavka.fall(predFnContext, mavka.makeText("Очікується, у функцію перевірки передано елемент списку."));
      }

      return searchItem.doCompareEquals(predFnContext, args[0]);
    });

    return list
      .get(context, "знайти_позицію")
      .doCall(context, [predFn])
      .doCompareGreaterThanOrEquals(context, mavka.makeNumber(0));
  });
}

export function buildListEquivalentToListHelperFn(mavka) {
  return mavka.makeProxyFunction((args, context) => {
    if (!(mavka.isList(args[0]) && mavka.isList(args[1]))) {
      mavka.fall(context, mavka.makeText("Очікується, що у сп_екв() передано фактичний та очікуваний списки."));
    }

    const lengths = args
      .slice(0, 2)
      .map(list => list
        .get(context, "довжина")
        .doCall(context));

    const eqLength = lengths[0].doCompareEquals(context, lengths[1]);

    if (!eqLength.doCompareEquals(context, mavka.yes)) {
      return mavka.no;
    }

    const [actualValues, expectedValues] = args.map(list => list.meta.values);

    for (let i = 0; i < expectedValues.length; i++) {
      if (!expectedValues[i].doCompareEquals(context, actualValues[i]).asJsValue()) {
        return mavka.no;
      }
    }

    return mavka.yes;
  });
}