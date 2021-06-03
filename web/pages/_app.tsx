import "../styles/globals.css";
import Head from "next/head";
import StoreProvider from "../components/StoreProvider";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>ICARUS</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </div>
  );
}

export default MyApp;
