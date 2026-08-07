import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhoneIcon, MailIcon, WhatsAppIcon, MapPinIcon } from "@/components/ui/icons";
import { site, mapsSearchQuery } from "@/content/site-data";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsSearchQuery)}`;

export function ContactSection() {
  const cards = [
    {
      icon: PhoneIcon,
      label: "Call Us",
      value: site.phoneDisplay,
      href: `tel:${site.phone}`,
    },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      value: "Chat instantly",
      href: whatsappLink(whatsappMessages.general),
    },
    {
      icon: MailIcon,
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: MapPinIcon,
      label: "Find Us",
      value: "Get directions",
      href: mapsSearchUrl,
    },
  ];

  return (
    <section id="contact" className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Get in Touch"
          title="We're One Message Away"
          description="Questions about a course, timing, or the free Madhyamik program? Reach us however's easiest for you."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center gap-3 rounded-xl border border-navy-100 bg-white p-7 text-center shadow-card transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-gold-300/60 hover:shadow-elevated dark:border-navy-700 dark:bg-navy-800"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-gold-800 transition-all duration-300 ease-premium group-hover:scale-105 group-hover:bg-gold-600 group-hover:text-navy-900 dark:bg-navy-700 dark:text-gold-400">
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">
                {label}
              </span>
              <span className="font-display font-semibold text-navy-900 dark:text-white">
                {value}
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
