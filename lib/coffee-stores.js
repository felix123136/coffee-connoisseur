import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?ll=${latLong}&query=${query}&v=20230322&limit=${limit}`;
};

const fetchCoffeeShopImages = async () => {
  const data = await unsplashApi.search.getPhotos({
    query: "coffee shops",
    perPage: 40,
  });
  const images = data.response.results.map((result) => result.urls.small);
  return images;
};

export const fetchCoffeeStores = async (
  latLong = "43.65267326999575,-79.39545615725015",
  limit = 6
) => {
  const coffeeShopImages = await fetchCoffeeShopImages();
  const res = await fetch(getUrlForCoffeeStores(latLong, "coffee", limit), {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  });
  const data = await res.json();
  const coffeeStores =
    data?.results?.map((venue, idx) => {
      const {
        fsq_id,
        name,
        location: { address, locality, cross_street },
      } = venue;
      return {
        id: fsq_id,
        imgUrl: coffeeShopImages[idx],
        name,
        address,
        neighborhood: locality || cross_street,
      };
    }) || [];
  return coffeeStores;
};
