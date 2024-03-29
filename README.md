# Доля

Середовище тестування для [Мавки](https://xn--80aaf6ah.xn--j1amh/).

Проєкт знаходиться у стадії розробки.

## Оновлення

Долю було оновлено для роботи з
[МаМою](https://github.com/mavka-ukr/mavka) та [Джеджаликом](https://github.com/mavka-ukr/jejalyk).
Тепер вона реалізована у вигляді паку Мавки.

## Використання

На даний момент МаМа не підтримує взяття з репозиторію.
Тимчасовим рішенням є завантаження [`доля.м`](./доля.м)
у бажане місце проекту та взяття `Долі` й `ТестовогоВипадку`:

```мавка
взяти доля [Доля, ТестовийВипадок]
```

Короткий приклад використання:

```мавка
взяти доля [Доля, ТестовийВипадок]

Доля(тестові_випадки=[
  ТестовийВипадок(
    назва="Тестування вірного твердження (1 рівно 1)",
    сценарій=дія(я)
      я.вірно(1 рівно 1)
    кінець
  )
]).старт()
```

Довгий приклад використання можна переглянути [тут](./examples/старт_тест.м).

Документацію можна переглянути у цьому [розділі](./docs/README.md).
