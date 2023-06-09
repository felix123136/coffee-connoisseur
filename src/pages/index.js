import Head from "next/head";
import Image from "next/legacy/image";
import styles from "@/styles/Home.module.css";

import Banner from "@/components/banner/banner.component";
import Card from "@/components/card/card.component";

import { fetchCoffeeStores } from "../../lib/coffee-stores";
import useTrackLocation from "../../hooks/use-track-location";
import { useContext, useEffect, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../../store/store-context";

export default function Home({ coffeeStores }) {
  const { locationErrorMsg, handleTrackLocation, isFindingLocation } =
    useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const {
    state: { latLong, coffeeStoresNearMe },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {
    const fetchCoffeeStoresNearMe = async () => {
      if (latLong) {
        try {
          const res = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`,
            {
              headers: {
                Authorization:
                  process.env.NEXT_PUBLIC_COFFEE_CONNOISSEUR_API_TOKEN,
              },
            }
          );
          const coffeeStoresData = await res.json();
          const action = {
            type: ACTION_TYPES.SET_COFFEE_STORES_NEAR_ME,
            payload: { coffeeStoresData },
          };
          dispatch(action);
          setCoffeeStoresError("");
        } catch (e) {
          setCoffeeStoresError(e.message);
        }
      }
    };
    fetchCoffeeStoresNearMe();
  }, [latLong, dispatch]);

  const bannerBtnOnClickHandler = () => {
    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Discover your local coffee stores" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Loading..." : "View stores nearby"}
          onClickHandler={bannerBtnOnClickHandler}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/assets/hero-image.png"
            width={800}
            height={343}
            alt="Hero Image"
          />
        </div>
        {coffeeStoresNearMe.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores Near Me</h2>
            <div className={styles.cardLayout}>
              {coffeeStoresNearMe.map(({ id, name, imgUrl }) => (
                <Card
                  key={id}
                  id={id}
                  name={name}
                  imgUrl={
                    imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(({ id, name, imgUrl }) => (
                <Card
                  key={id}
                  id={id}
                  name={name}
                  imgUrl={
                    imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    },
  };
}
