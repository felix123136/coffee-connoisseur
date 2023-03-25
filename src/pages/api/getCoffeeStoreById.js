import { findCoffeeStoreById } from "../../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  try {
    const { id } = req.query;
    // id should exist
    if (!id) return res.status(400).json({ msg: "ID is missing" });

    // if we find the coffee store with this particular id, we return it.
    const coffeeStoreData = await findCoffeeStoreById(id);
    if (coffeeStoreData.length) {
      return res.status(200).json(coffeeStoreData);
    }
    // else, we return an error
    return res.status(400).json({ msg: "ID could not be found" });
  } catch (e) {
    return res.status(500).json({ msg: "Something went wrong!", e });
  }
};

export default getCoffeeStoreById;
