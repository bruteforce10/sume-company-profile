import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { OverlaySection } from "@/components/ui/overlay-section";

export function ClosingCta() {
  const t = useTranslations("Home");

  return (
    <OverlaySection
      id="contact"
      className="bg-sume-blue"
      image="/images/home/pattern-1.png"
      imageClassName="object-cover opacity-50 mix-blend-luminosity"
      overlayClassName="bg-[linear-gradient(120deg,rgba(0,88,190,0.96),rgba(14,36,60,0.3))]"
      contentClassName="sume-wrap relative z-[2] py-30 text-center"
    >
      <h2 className="mx-auto max-w-[20ch] font-head text-[clamp(34px,4.6vw,58px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
        {t("closingHeading")}
      </h2>
      <p className="mx-auto my-6 mb-10 max-w-[60ch] text-[19px] leading-[1.55] text-white/85">
        {t("closingBody")}
      </p>
      <Link href="/contact" className="sume-btn sume-btn-white">
        {t("closingCta")}
        <ArrowRight className="h-[18px] w-[18px]" />
      </Link>
    </OverlaySection>
  );
}
