import { useLocale, useTranslations } from "next-intl";
import { ContactForm } from "@/components/contact-form";
import { contactItems } from "@/constants/site";

export function Contact() {
  const locale = useLocale();
  const t = useTranslations("Home");
  const items = contactItems[locale];

  return (
    <section id="contact" className="bg-sume-bg-contact py-20 lg:py-32">
      <div className="section-shell grid gap-10 lg:grid-cols-[392px_1fr] lg:items-start">
        <div>
          <h2 className="paper-heading">{t("contactHeading")}</h2>
          <p className="mt-6 paper-body">{t("contactBody")}</p>
          <div className="mt-9 grid gap-5">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex gap-4">
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-sume-bg-blue-soft text-sume-blue">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-sume-ink">
                      {item.label}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-sume-body">
                      {item.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-sm bg-white p-8 shadow-xl sm:p-12">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
