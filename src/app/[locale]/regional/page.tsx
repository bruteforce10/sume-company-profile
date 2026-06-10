import Link from "next/link";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader, PageHeaderStats } from "@/components/sections/page-header";
import { RegionalMap } from "@/components/regional-map";
import { regionalStats } from "@/constants/regional";

export const metadata = {
  title: "Regional Presence — SUME Group",
  description:
    "Regional reach across Southeast Asia. Offices anchoring delivery in Indonesia, Singapore, and Myanmar — with on-the-ground engineering, distribution, and lifetime maintenance.",
};

export default function RegionalPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Regional Presence"
        title="Regional Reach Across Southeast Asia."
        description="Offices anchoring delivery in Indonesia, Singapore, and Myanmar — supporting clients across the region with on-the-ground engineering, distribution, and lifetime maintenance."
      >
        <PageHeaderStats stats={regionalStats} />
      </PageHeader>

      {/* ── Map + Locations ──────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="sume-wrap">
          <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <span className="sume-eyebrow mb-3.5 block">Our Offices</span>
              <h2 className="max-w-[18ch] font-head text-[clamp(28px,3vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
                Engineering presence, built where our clients operate.
              </h2>
            </div>
            <p className="max-w-[38ch] text-[17px] text-sume-body">
              Headquartered in Jakarta with regional offices across Southeast
              Asia — delivered and supported locally, wherever the facility runs.
            </p>
          </div>

          <RegionalMap />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <CtaBand
        title="Operating across the region? Let's engineer your next facility together."
        description="Talk to our regional team about your power, cooling, monitoring, or M&E requirements."
      >
        <Link href="/contact" className="sume-btn sume-btn-white">
          Contact Our Regional Team
        </Link>
      </CtaBand>
    </main>
  );
}
