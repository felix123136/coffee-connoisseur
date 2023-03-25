import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import classNames from "classnames";

import styles from "../../styles/coffee-store.module.css";
import { fetchCoffeeStores } from "../../../lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../store/store-context";
import { isEmpty } from "../../../utils";

import useSWR from "swr";

const CoffeeStore = ({ staticCoffeeStore }) => {
  const [coffeeStore, setCoffeeStore] = useState(staticCoffeeStore);
  const [votingCount, setVotingCount] = useState(0);
  const router = useRouter();

  const { id } = router.query;

  const {
    state: { coffeeStoresNearMe },
  } = useContext(StoreContext);

  useEffect(() => {
    const handleCreateCoffeeStore = async (newCoffeeStore) => {
      const { name, imgUrl, address, neighborhood } = newCoffeeStore;
      const res = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_COFFEE_CONNOISSEUR_API_TOKEN,
        },
        body: JSON.stringify({
          id,
          name,
          imgUrl,
          address: address || "",
          neighborhood: neighborhood || "",
          voting: 0,
        }),
      });
      return await res.json();
    };
    // Check if coffee store is empty or not. If it's empty, it means that it's not 1 of the
    // 6 coffee stores that we statically generate in getStaticProps
    if (!coffeeStore || isEmpty(coffeeStore)) {
      // Check if there's coffee stores in our context. If so, we want to search coffee store in there with this particular id
      if (coffeeStoresNearMe.length) {
        const coffeeStoreFromContext = coffeeStoresNearMe.find(
          (item) => item.id === id
        );
        // if we can find coffee store with this particular id, we then store this coffee store in airtable
        if (coffeeStoreFromContext) {
          // to avoid multiple store, we use promise and only set our coffeeStore state after the promise is resolved
          handleCreateCoffeeStore(coffeeStoreFromContext).then(() =>
            setCoffeeStore(coffeeStoreFromContext)
          );
        }
      }
    } else {
      // this else block is meant to catch statically generated coffee stores and store it in airtable
      handleCreateCoffeeStore(coffeeStore);
    }
  }, [coffeeStore, coffeeStoresNearMe, id]);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `/api/getCoffeeStoreById?id=${id}`,
    fetcher
  );

  useEffect(() => {
    // if we got data back from SWR, we want to set our coffeeStore and votinCount state
    if (data && data.length) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (isLoading || !coffeeStore) {
    return <div className={styles.layout}>Loading...</div>;
  }
  if (error) {
    return <div className={styles.layout}>Something went wrong</div>;
  }

  const handleUpvoteButton = async () => {
    try {
      await fetch("/api/favoriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_COFFEE_CONNOISSEUR_API_TOKEN,
        },
        body: JSON.stringify({
          id,
        }),
      });
      setVotingCount((prev) => prev + 1);
    } catch (e) {
      console.error("Something went wrong");
    }
  };

  const { name, imgUrl, address, neighborhood } = coffeeStore;

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">&#129060; Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <div className={styles.storeImgWrapper}>
            <Image
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              }
              width={600}
              height={360}
              className={styles.storeImg}
              alt={name || "Coffee Store Image"}
            />
          </div>
        </div>
        <div className={classNames("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/assets/icons/places.svg"
              width="24"
              height="24"
              alt="place icon"
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/assets/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/assets/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map(({ id }) => {
    return { params: { id: id.toString() } };
  });
  return {
    paths,
    fallback: true, // can also be true or 'blocking'
  };
}

export async function getStaticProps({ params }) {
  // Find if this current id is 1 of the 6 statically generated coffee stores.
  // If so, we pass it as props. else, we just pass an empty object
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find(
    (coffeeStore) => coffeeStore.id === params.id
  );
  return {
    props: {
      staticCoffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export default CoffeeStore;
