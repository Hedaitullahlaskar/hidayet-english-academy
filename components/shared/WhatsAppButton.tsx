import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(whatsappMessages.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Hidayet English Academy on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-elevated transition-transform duration-200 hover:scale-110 active:scale-95 sm:bottom-8 sm:right-8"
    >
      <WhatsAppIcon className="h-7 w-7 text-white" />
      <span className="absolute right-16 hidden whitespace-nowrap rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white group-hover:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
