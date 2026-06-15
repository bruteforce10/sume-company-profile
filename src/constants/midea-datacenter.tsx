import type { ReactNode } from "react";

// Liquid-cooling product set shared by the Data Center page "Liquid Cooling &
// CDU" featured section and the dedicated Midea Data Center catalog page. Only
// the icons live in code — every label/description is CMS-managed (see the
// `DataCenterPage` and `MideaDataCenterPage` namespaces), so the four products
// are editable per page without touching this file.

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-6 w-6 flex-none stroke-sume-blue",
};

const icons: ReactNode[] = [
  // Maglev Active CDU — closed coolant loop with a droplet core.
  <svg key="maglev" {...iconProps}>
    <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
    <path d="M20.5 4v4h-4" />
    <path d="M12 9.5c-1.3 1.6-2 2.7-2 3.6a2 2 0 1 0 4 0c0-.9-.7-2-2-3.6z" />
  </svg>,
  // Industrial-Grade CDU — stacked server/rack units.
  <svg key="cdu" {...iconProps}>
    <rect x="4" y="3.5" width="16" height="17" rx="1.5" />
    <path d="M4 9h16M4 14.5h16" />
    <path d="M7 6.2h.01M7 11.7h.01M7 17.2h.01" />
  </svg>,
  // Liquid-Cooling Terminals — processor / chip with pins.
  <svg key="terminal" {...iconProps}>
    <rect x="8" y="8" width="8" height="8" rx="1" />
    <path d="M10 4v2.5M14 4v2.5M10 17.5V20M14 17.5V20M4 10h2.5M4 14h2.5M17.5 10H20M17.5 14H20" />
  </svg>,
  // Air-Fluid Synergy — layered air + liquid architecture.
  <svg key="synergy" {...iconProps}>
    <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3z" />
    <path d="M3 12.5 12 17l9-4.5" />
    <path d="M3 16.5 12 21l9-4.5" />
  </svg>,
];

/** Data Center page — featured cards (DataCenterPage namespace, richer copy). */
export const liquidCoolingCards = [
  {
    icon: icons[0],
    titleKey: "liquidCard1Title",
    specKey: "liquidCard1Spec",
    bodyKey: "liquidCard1Body",
  },
  {
    icon: icons[1],
    titleKey: "liquidCard2Title",
    specKey: "liquidCard2Spec",
    bodyKey: "liquidCard2Body",
  },
  {
    icon: icons[2],
    titleKey: "liquidCard3Title",
    specKey: "liquidCard3Spec",
    bodyKey: "liquidCard3Body",
  },
  {
    icon: icons[3],
    titleKey: "liquidCard4Title",
    specKey: "liquidCard4Spec",
    bodyKey: "liquidCard4Body",
  },
] as const;

/** Catalog page — product cards (MideaDataCenterPage namespace, terse copy). */
export const mideaCatalogProducts = [
  { icon: icons[0], titleKey: "card1Title", bodyKey: "card1Body" },
  { icon: icons[1], titleKey: "card2Title", bodyKey: "card2Body" },
  { icon: icons[2], titleKey: "card3Title", bodyKey: "card3Body" },
  { icon: icons[3], titleKey: "card4Title", bodyKey: "card4Body" },
] as const;
