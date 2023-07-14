import { component$, useStore, $, useVisibleTask$ } from "@builder.io/qwik";
import "./style.css";
export default component$(() => {
  const store = useStore({ count: 0 });

  useVisibleTask$(({ cleanup }) => {
    cleanup(() => {
      console.log("cleanup");
    });
  });

  const inc = $(() => {
    store.count++;
  });

  const dec = $(() => {
    store.count--;
  });

  return (
    <main class="container">
      <p class="counter">Count: {store.count}</p>
      <div class="wrapper">
        <button class="bg-lime-900" onClick$={inc}>
          +1
        </button>
        <button class="bg-red-900" onClick$={dec}>
          -1
        </button>
      </div>
    </main>
  );
});
