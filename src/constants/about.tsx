import type { ReactNode } from "react";

/** Company timeline years — events are sourced from AboutPage translations (milestoneNEvent). */
export const milestoneYears: string[] = [
  "2014",
  "2015",
  "2017",
  "2025",
  "2025",
  "2026",
];

// Certification icons — shared <svg> inner paths, name/detail come from translations.
const iconQuality: ReactNode = (
  <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2-6.3-4.6L5.7 21l2.3-7.2-6-4.4h7.6z" />
);
const iconEnvironment: ReactNode = (
  <>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.18 2 8a7 7 0 0 1-7 7c-1 0-2 0-3-.5" />
    <path d="M2 22c0-3 1-5 3-7" />
  </>
);
const iconSafety: ReactNode = (
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
);
const iconCompliance: ReactNode = <path d="M20 6L9 17l-5-5" />;

/** Certification card icons, in display order (paired with AboutPage certNName/Detail). */
export const certificationIcons: ReactNode[] = [
  iconQuality,
  iconEnvironment,
  iconSafety,
  iconCompliance,
];
