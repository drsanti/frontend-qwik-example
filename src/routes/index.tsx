import { component$, useStore, $, useVisibleTask$ } from "@builder.io/qwik";
import { BfsWsLink, type WsMessage } from "bfs-net-link";
import "./index.css";
export default component$(() => {
  const wsStore = useStore({ id: "none", text: "not update", topic: "none" });

  const store = useStore({ count: 0, t0: 0, rtt: "100 ms" });

  const clientRef = { value: null as any };
  const init = $(() => {
    const uri = `ws://178.128.98.237:3000`; // OR wss://178.128.98.237:8080
    const client = new BfsWsLink(uri);
    clientRef.value = client as BfsWsLink;

    client.on("ready", (e) => {
      console.clear();
      store.t0 = performance.now();
      wsStore.id = e.id;
      wsStore.topic = `${e.id}-data`;
      // wsStore.topic = `share-data`;
      client.subscribe(wsStore.topic);
      client.publish(wsStore.topic, `${store.count}`);
    });

    client.on("message", (e: WsMessage) => {
      wsStore.text = e.data;
      if (e.id == wsStore.id) {
        store.rtt = `rtt: ${(performance.now() - store.t0).toFixed(3)} ms`;
      } else {
        store.count = Number(e.data);
        store.rtt = `sender: ${wsStore.id}`;
      }
    });
  });

  useVisibleTask$(({ cleanup }) => {
    init();
    cleanup(() => {
      console.log("cleanup");
    });
  });

  const sendToServer = $(() => {
    store.t0 = performance.now();
    clientRef.value?.publish(wsStore.topic, store.count);
  });

  const inc = $(() => {
    store.count++;
    sendToServer();
  });
  const dec = $(() => {
    store.count--;
    sendToServer();
  });

  return (
    <main class="container">
      <div class="wrapper">
        <p class="client-id">client: {wsStore.id}</p>
        <p class="text-topic">topic: {wsStore.topic}</p>
        <p class="text-info">counter: {wsStore.text}</p>
        <p class="text-rtt">{store.rtt}</p>
      </div>
      <div class="flex space-x-4">
        <button class="btn-inc" onClick$={inc}>
          +1
        </button>
        <button class="btn-dec" onClick$={dec}>
          -1
        </button>
      </div>
    </main>
  );
});
