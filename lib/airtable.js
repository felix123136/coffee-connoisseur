const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

export const table = base("Coffee Stores");

const getMinifiedRecord = (record) => {
  return {
    ...record.fields,
    recordId: record.id,
  };
};

export const getMinifiedRecords = (records) => {
  return records.map(getMinifiedRecord);
};

export const findCoffeeStoreById = async (id) => {
  const rawCoffeeStoreData = await table
    .select({
      filterByFormula: `{id} = "${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(rawCoffeeStoreData);
};
