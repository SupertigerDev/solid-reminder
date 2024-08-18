import style from "./App.module.scss";
import { createSignal, Accessor, onMount, For, createEffect } from "solid-js";
import { BottomDrawer, BottomDrawerRef } from "../bottom-drawer";
import { createContextProvider } from "@solid-primitives/context";
import { RandomReminderNotePlaceholder } from "../../common/randomFunnyPlaceholder";

const [CounterProvider, useContext] = createContextProvider(
  (props: { newReminderDrawer?: Accessor<BottomDrawerRef | undefined> }) => {
    return {
      newReminderDrawer: props.newReminderDrawer,
    };
  }
);

const useApp = () => {
  const app = useContext();
  if (!app) {
    throw new Error("App not found");
  }
  return app;
};

const date10MinutesAfter = () => {
  return new Date(Date.now() + 10 * 60 * 1000);
};

export const App = () => {
  const [newReminderDrawer, setNewReminderDrawer] =
    createSignal<BottomDrawerRef>();

  const [date, setDate] = createSignal(() => date10MinutesAfter());

  const [text, setText] = createSignal("");

  return (
    <CounterProvider newReminderDrawer={newReminderDrawer}>
      <h1 class={style.title}>Solid Reminder</h1>
      <NoReminders />
      <BottomDrawer.Root ref={setNewReminderDrawer}>
        <BottomDrawer.Header title="Add Reminder" />
        <BottomDrawer.Content class={style.newReminderDrawerContainer}>
          <textarea
            placeholder={RandomReminderNotePlaceholder()}
            oninput={(t) => setText(t.currentTarget.value)}
          ></textarea>
          <Predictions
            text={text()}
            onClick={(p) => setDate(() => () => new Date(p.ms()))}
          />
          <DateTime date={date()} />
        </BottomDrawer.Content>
      </BottomDrawer.Root>
    </CounterProvider>
  );
};

const DateTime = (props: { date: Accessor<Date> }) => {
  const day = () => props.date().getDate();
  const month = () => props.date().getMonth() + 1;
  const year = () => props.date().getFullYear();

  const hour = () => props.date().getHours();
  const minute = () => props.date().getMinutes();

  return (
    <div class={style.dateTime}>
      <div class={style.time}>
        <div>
          <p>Hours</p>
          <input value={hour()} placeholder="HH" accept="[0-9]*" />
        </div>
        <div>
          <p>Minutes</p>
          <input value={minute()} placeholder="MM" accept="[0-9]*" />
        </div>
      </div>
      <div class={style.date}>
        <div>
          <p>Day</p>
          <input value={day()} type="number" placeholder="DD" accept="[0-9]*" />
        </div>
        <div>
          <p>Month</p>
          <input
            value={month()}
            type="number"
            placeholder="MM"
            accept="[0-9]*"
          />
        </div>
        <div>
          <p>Year</p>
          <input
            value={year()}
            type="number"
            placeholder="YYYY"
            accept="[0-9]*"
          />
        </div>
      </div>
    </div>
  );
};

const Predictions = (props: {
  text: string;
  onClick: (pred: Prediction) => void;
}) => {
  const [predictions, setPredictions] = createSignal<Prediction[]>([]);

  createEffect(() => {
    setPredictions(getPredictions(props.text));
  });

  return (
    <div class={style.predictions}>
      <For each={predictions()}>
        {(p) => (
          <button onClick={() => props.onClick(p)} class={style.prediction}>
            {p.text}
          </button>
        )}
      </For>
    </div>
  );
};

const NoReminders = () => {
  const app = useApp();

  return (
    <div class={style.noReminders}>
      <p>There are no reminders.</p>
      <button onClick={() => app.newReminderDrawer?.()?.toggle()}>
        Click To Add
      </button>
    </div>
  );
};

type Prediction = ReturnType<typeof getPredictions>[number];
function getPredictions(text: string) {
  // mm/dd/yyyy
  const date = /(\d{1,2})\/(\d{1,2})\/(\d{4})/i;

  const inXMinutes = /(\d+) m(inute)?/i;
  const inXHours = /(\d+) h(our)?/i;
  const inXDays = /(\d+) d(ay)?/i;

  let list = [];
  const minutes = parseInt(inXMinutes.exec(text)?.[1] || "0");
  const hours = parseInt(inXHours.exec(text)?.[1] || "0");
  const days = parseInt(inXDays.exec(text)?.[1] || "0");

  if (days) {
    list.push({
      text: `${days} days`,
      rawMs: days * 24 * 60 * 60 * 1000,
      ms: () => Date.now() + days * 24 * 60 * 60 * 1000,
    });
  }

  if (hours) {
    list.push({
      text: `${hours} hours`,
      rawMs: hours * 60 * 60 * 1000,
      ms: () => Date.now() + hours * 60 * 60 * 1000,
    });
  }

  if (minutes) {
    list.push({
      text: `${minutes} minutes`,
      rawMs: minutes * 60 * 1000,
      ms: () => Date.now() + minutes * 60 * 1000,
    });
  }
  if (list.length > 1) {
    const enlf = new Intl.ListFormat("en");
    const allMs = list.map((p) => p.rawMs).reduce((a, b) => a + b, 0);
    list.push({
      text: enlf.format(list.map((p) => p.text)),
      rawMs: allMs,
      ms: () => Date.now() + allMs,
    });
  }

  const dateMatch = date.exec(text);
  const dateDay = parseInt(dateMatch?.[1] || "0");
  const dateMonth = parseInt(dateMatch?.[2] || "0");
  const dateYear = parseInt(dateMatch?.[3] || "0");

  if (dateMatch) {
    list.push({
      text: `${dateDay}/${dateMonth}/${dateYear}`,
      ms: () => new Date(dateYear, dateMonth - 1, dateDay).getTime(),
    });
  }
  return list;
}
