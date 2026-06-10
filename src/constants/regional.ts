import type { Locale } from "@/i18n/routing";
import { company } from "@/constants/site";

/** Header stat figures for the Regional Presence page. */
export const regionalStats: Record<Locale, { value: string; label: string }[]> = {
  en: [
    { value: "3", label: "Countries" },
    { value: "4", label: "Offices" },
    { value: "24/7", label: "Regional Support" },
  ],
  id: [
    { value: "3", label: "Negara" },
    { value: "4", label: "Kantor" },
    { value: "24/7", label: "Dukungan Regional" },
  ],
};

export type RegionalLocation = {
  id: string;
  city: string;
  country: string;
  hq?: boolean;
  address: string;
  coords: [number, number];
};

/** Office markers rendered on the Regional Presence map. */
export const regionalLocations: Record<Locale, RegionalLocation[]> = {
  en: [
    {
      id: "jakarta",
      city: "Jakarta",
      country: "Indonesia · HQ",
      hq: true,
      address: company.address,
      coords: [-6.1662, 106.8103],
    },
    {
      id: "singapore",
      city: "Singapore",
      country: "Singapore",
      address: "Regional Office · Singapore",
      coords: [1.2776, 103.8336],
    },
    {
      id: "yangon",
      city: "Yangon",
      country: "Myanmar",
      address: "Yangon, Myanmar",
      coords: [16.8855, 96.2519],
    },
    {
      id: "mandalay",
      city: "Mandalay",
      country: "Myanmar",
      address: "Mandalay, Myanmar",
      coords: [21.9784, 96.0852],
    },
  ],
  id: [
    {
      id: "jakarta",
      city: "Jakarta",
      country: "Indonesia · HQ",
      hq: true,
      address: company.address,
      coords: [-6.1662, 106.8103],
    },
    {
      id: "singapore",
      city: "Singapura",
      country: "Singapura",
      address: "Kantor Regional · Singapura",
      coords: [1.2776, 103.8336],
    },
    {
      id: "yangon",
      city: "Yangon",
      country: "Myanmar",
      address: "Yangon, Myanmar",
      coords: [16.8855, 96.2519],
    },
    {
      id: "mandalay",
      city: "Mandalay",
      country: "Myanmar",
      address: "Mandalay, Myanmar",
      coords: [21.9784, 96.0852],
    },
  ],
};
