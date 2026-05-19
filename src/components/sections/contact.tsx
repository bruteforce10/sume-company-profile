import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { company } from "@/constants/site";

const contacts = [
  { icon: MapPin, label: "Office", value: company.address },
  { icon: Phone, label: "Phone", value: company.phone },
  { icon: Mail, label: "Email", value: company.email },
];

export function Contact() {
  return (
    <section id="contact" className="bg-sume-bg-contact py-20 lg:py-32">
      <div className="section-shell grid gap-10 lg:grid-cols-[392px_1fr] lg:items-start">
        <div>
          <h2 className="paper-heading">Get in Touch</h2>
          <p className="mt-6 paper-body">Ready to start your next engineering project? Our experts are here to provide a detailed consultation for your specific M&E needs.</p>
          <div className="mt-9 grid gap-5">
            {contacts.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex gap-4">
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-sume-bg-blue-soft text-sume-blue">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-sume-ink">{item.label}</div>
                    <div className="mt-1 text-sm leading-6 text-sume-body">{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-[24px] border border-white/70 bg-white/70 p-6 shadow-[var(--sume-shadow-soft)] backdrop-blur-xl sm:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
