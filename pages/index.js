import Head from "next/head";
import Header from "../components/Header";
import LotterEntrance from "../components/LotterEntrance";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Smart Contract Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <LotterEntrance />
    </div>
  );
}
