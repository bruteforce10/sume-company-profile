"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { useLocale, useTranslations } from "next-intl";
import { regionalLocations } from "@/constants/regional";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

export function RegionalMap() {
  const locale = useLocale();
  const t = useTranslations("RegionalMap");
  const locations = regionalLocations[locale];

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const [active, setActive] = useState<string | null>(null);

  const focusLoc = useCallback(
    (id: string) => {
      setActive(id);
      const loc = regionalLocations[locale].find((item) => item.id === id);
      const map = mapRef.current;
      if (loc && map) {
        map.flyTo(loc.coords, 11, { duration: 1.1 });
        markersRef.current[id]?.openTooltip();
      }
    },
    [locale],
  );

  useEffect(() => {
    let cancelled = false;
    const locs = regionalLocations[locale];

    async function initMap() {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([10, 102], 5);
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 18,
          minZoom: 3,
        },
      ).addTo(map);

      const pulseIcon = L.divIcon({
        className: "pulse-marker",
        html: '<div class="pulse-ring"></div><div class="pulse-ring2"></div><div class="pulse-core"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      locs.forEach((loc) => {
        const marker = L.marker(loc.coords, {
          icon: pulseIcon,
          title: loc.city,
        }).addTo(map);
        marker.bindTooltip(`<strong>${loc.city}</strong><br>${loc.country}`, {
          direction: "top",
          offset: [0, -6],
          className: "sume-tip",
        });
        marker.on("click", () => focusLoc(loc.id));
        markersRef.current[loc.id] = marker;
      });

      map.fitBounds(
        locs.map((loc) => loc.coords),
        { padding: [60, 60], maxZoom: 6 },
      );
    }

    initMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, [focusLoc, locale]);

  return (
    <div className="grid items-stretch gap-9 lg:grid-cols-[1.45fr_1fr]">
      <div
        ref={containerRef}
        aria-label={t("mapAria")}
        className="z-[1] h-[440px] w-full border border-sume-line bg-sume-mist lg:h-[560px]"
      />

      <div className="flex flex-col gap-3.5">
        {locations.map((loc) => {
          const isActive = active === loc.id;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => focusLoc(loc.id)}
              onMouseEnter={() => markersRef.current[loc.id]?.openTooltip()}
              className={cn(
                "group relative border border-sume-line bg-white px-[26px] pb-[26px] pt-6 text-left transition",
                isActive
                  ? "-translate-y-px border-sume-blue shadow-[0_10px_28px_-22px_rgba(0,88,190,0.55)]"
                  : "hover:-translate-y-px hover:border-sume-blue hover:shadow-[0_10px_28px_-22px_rgba(0,88,190,0.55)]",
              )}
            >
              <div className="mb-2.5 flex items-center justify-between">
                <h3 className="font-head text-[11px] font-semibold uppercase tracking-[0.18em] text-sume-muted">
                  {loc.country}
                </h3>
                <span
                  className={cn(
                    "rounded-[2px] px-2.5 py-[5px] font-head text-[11px] font-semibold uppercase tracking-[0.1em]",
                    loc.hq
                      ? "bg-sume-blue text-white"
                      : "bg-sume-accent text-sume-blue",
                  )}
                >
                  {loc.hq ? t("badgeHq") : t("badgeOffice")}
                </span>
              </div>
              <div
                className={cn(
                  "font-head text-[26px] font-semibold tracking-[-0.01em] transition",
                  isActive
                    ? "text-sume-blue"
                    : "text-sume-navy group-hover:text-sume-blue",
                )}
              >
                {loc.city}
              </div>
              <div className="mt-2 max-w-[28ch] text-[14.5px] leading-[1.5] text-sume-body">
                {loc.address}
              </div>
              <span
                className={cn(
                  "absolute bottom-6 right-6 font-head text-[20px] font-semibold transition",
                  isActive
                    ? "translate-x-1 text-sume-blue"
                    : "text-sume-line group-hover:translate-x-1 group-hover:text-sume-blue",
                )}
              >
                →
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
