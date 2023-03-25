import {
  table,
  getMinifiedRecords,
  findCoffeeStoreById,
} from "../../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (
    req.headers.authorization !==
    process.env.NEXT_PUBLIC_COFFEE_CONNOISSEUR_API_TOKEN
  )
    return res.status(403).json({ msg: "Unauthorized user" });
  // Method should be post
  if (req.method === "POST") {
    try {
      const { id, name, address, neighborhood, imgUrl, voting } = req.body;
      // id should exist
      if (!id) return res.status(400).json({ message: "ID is missing" });

      const coffeeStoreData = await findCoffeeStoreById(id);

      // if we find coffee store with this particular id, we just return it
      if (coffeeStoreData.length) {
        return res.status(200).json(coffeeStoreData);
      }

      // else, we store it in airtable
      if (!name) return res.status(400).json({ message: "Name is missing" });
      const createRecords = await table.create([
        {
          fields: {
            id,
            name,
            address,
            neighborhood,
            imgUrl,
            voting,
          },
        },
      ]);
      const records = getMinifiedRecords(createRecords);
      return res.status(200).json(records);
    } catch (e) {
      return res.status(500).json({ msg: "Something Went Wrong", e });
    }
  }
};

export default createCoffeeStore;
