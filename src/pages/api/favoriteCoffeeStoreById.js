import {
  findCoffeeStoreById,
  table,
  getMinifiedRecords,
} from "../../../lib/airtable";

const favoriteCoffeeStoreById = async (req, res) => {
  if (
    req.headers.authorization !==
    process.env.NEXT_PUBLIC_COFFEE_CONNOISSEUR_API_TOKEN
  )
    return res.status(403).json({ msg: "Unauthorized user" });
  // method should be put
  if (req.method === "PUT") {
    try {
      const { id } = req.body;
      // id should exist
      if (!id) return res.status(400).json({ msg: "ID is missing" });

      const coffeeStoreData = await findCoffeeStoreById(id);
      // if we don't find the coffee store, just return an error
      if (!coffeeStoreData || !coffeeStoreData.length)
        return res.status(404).json({ msg: "ID could not be found" });

      const { voting, recordId } = coffeeStoreData[0];

      const rawCoffeeStoreData = await table.update([
        {
          id: recordId,
          fields: {
            voting: voting + 1,
          },
        },
      ]);

      const record = getMinifiedRecords(rawCoffeeStoreData);
      return res.status(200).json(record);
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  }
};

export default favoriteCoffeeStoreById;
