import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { galleryItems } from "@/content/about-data";

export function PhotoGallery() {
  return (
    <section className="bg-white py-20 dark:bg-navy-950 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Photo Gallery" title="A Look Inside Hidayet English Academy" />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, i) => (
            <Reveal key={item.src} delay={(i % 3) * 80}>
              <figure className="group overflow-hidden rounded-lg border border-navy-100 bg-paper-100 shadow-card dark:border-navy-700 dark:bg-navy-900">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="px-4 py-3 text-sm font-semibold text-navy-700 dark:text-navy-200">
                  {item.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
