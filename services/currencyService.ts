import { CurrencyRate } from "@/app/(tabs)/HomeScreen";

const token = process.env.EXPO_PUBLIC_EXCHANGERATE_TOKEN;

export const getAllRating = async (baseRate: string) => {
   
    let url = `https://v6.exchangerate-api.com/v6/${token}/latest/${baseRate}`;
    try {
      const response = await fetch(url, { method: "GET" });
   
      if (!response.ok) {
        throw new Error("Error fetching api");
      }
      const { conversion_rates, time_last_update_utc } = await response.json();
   
      const formattedCurrencyList: CurrencyRate[] = Object.entries(
        conversion_rates
      )?.map(([currency, rate]) => ({
        currency,
        rate: Number(rate),
      }));

      const filteredCurrencyList = formattedCurrencyList?.filter((itm) => itm.currency !== "MYR");
      const formattedLastUpdated = new Date(time_last_update_utc).toUTCString();

     
      return {formattedCurrencyList, formattedLastUpdated};
    } catch (error) {
      console.log("error");
    }
  };