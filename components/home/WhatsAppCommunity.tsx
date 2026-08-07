import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export function WhatsAppCommunity() {
  return (
    <section className="bg-navy-800 py-16 dark:bg-navy-900 sm:py-20">
      <Container>
        <Reveal>
          <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-xl bg-gradient-to-br from-navy-900 to-navy-800 p-10 text-center shadow-elevated sm:p-14">
            <div className="bg-grid-navy pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-whatsapp/15 shadow-[0_0_0_8px_rgba(37,211,102,0.08)]">
              <WhatsAppIcon className="h-8 w-8 text-whatsapp" />
            </span>
            <div className="relative">
              <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Join Our Official WhatsApp Community
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-balance text-navy-200">
                Get class updates, free grammar tips, and direct support from the
                HEA team — the same trusted community thousands of students already
                rely on.
              </p>
            </div>
            <Button href={whatsappLink(whatsappMessages.joinCommunity)} size="lg" className="relative">
              Join WhatsApp Group →
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
