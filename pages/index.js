import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";

const saveLocalStorageInteraction = (interaction) => {
  let interactions = getLocalStorageInteraction();
  interactions.push(interaction);
  localStorage.setItem("interactions", JSON.stringify(interactions));
}

const getLocalStorageInteraction = () => {
  return JSON.parse(localStorage.getItem("interactions") || "[]");
}

export default function Home() {
  const [pedidoInput, setPedidoInput] = useState("");
  const [result, setResult] = useState();
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    const interactionsLocal = getLocalStorageInteraction();
    if (interactionsLocal.length > 0 && interactions.length == 0) {
      setInteractions(interactionsLocal);
    }
  });

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pedido: pedidoInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      saveLocalStorageInteraction({input: pedidoInput, result: data.result});
      interactions.push({input: pedidoInput, result: data.result});
      setInteractions(interactions);
      setPedidoInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Conteúdo do dia</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Manda seu Pedido!</h3>
        <p>Te respondo com uma piada curta.</p>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="pedido"
            placeholder="Escreva seu pedido"
            value={pedidoInput}
            onChange={(e) => setPedidoInput(e.target.value)}
          />
          <input type="submit" value="Gerar com openai" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
      <hr />
      <footer className={styles.main}>
        <h5>Historico:</h5>
        <textarea readOnly
          className={styles.textHistory}
          value={interactions.map(function(d){
            return `Pedido: ${d.input} : ${d.result}\n\n`
          })}>
        </textarea>
      </footer>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3047032865762951" crossorigin="anonymous"></script>
    </div>
  );
}
