import { currencyToCountry } from "@/constants/currencies";

 export type CurrencyCountry = { currency: string; country: string };

 export const mapCurrencyToCountry: CurrencyCountry[] = Object.entries(
    currencyToCountry
  ).map(([currency, country]) => ({ currency, country }));