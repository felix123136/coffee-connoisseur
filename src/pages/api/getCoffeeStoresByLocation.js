import { fetchCoffeeStores } from "../../../lib/coffee-stores";

const getCoffeeStoresByLocation = async (req, res) => {
  if (
    req.headers.authorization !==
    process.env.NEXT_PUBLIC_COFFEE_CONNOISSEUR_API_TOKEN
  )
    return res.status(403).json({ msg: "Unauthorized user" });

  try {
    const { latLong, limit } = req.query;
    const coffeeStoresData = await fetchCoffeeStores(latLong, limit);
    res.status(200).send(coffeeStoresData);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Something went wrong" });
  }
};

export default getCoffeeStoresByLocation;
