import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  CreateTestimonialForm,
  TestimonialList,
  CreateBannerForm,
  BannerList,
  SiteSettingsForm,
  HeroContentForm,
  FaqManager,
  GalleryManager,
} from "@/components/admin/CmsForms";
import { getAllTestimonials, getAllBanners, getAllFaqsAdmin, getAllGalleryImagesAdmin, getCmsSection } from "@/lib/admin/repository";
import { getSiteSettings } from "@/lib/settings/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminCmsPage() {
  const [testimonials, banners, faqs, galleryImages, siteSettings, heroSection] = await Promise.all([
    getAllTestimonials(),
    getAllBanners(),
    getAllFaqsAdmin(),
    getAllGalleryImagesAdmin(),
    getSiteSettings(),
    getCmsSection("homepage"),
  ]);

  const heroValues = Object.fromEntries(
    heroSection.map((row: { content_key: string; value_en: string | null }) => [row.content_key, row.value_en ?? ""])
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Website CMS</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Every change here goes live immediately — no code, no deploy.
      </p>

      <div className="mt-8 space-y-12">
        <section>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Site Settings</h2>
          <p className="mb-4 text-sm text-navy-600 dark:text-navy-300">Academy name, logo, contact info, and social links — used across the header, footer, and legal pages.</p>
          <SiteSettingsForm
            settings={{
              academy_name: siteSettings.academyName,
              tagline_en: siteSettings.taglineEn,
              tagline_bn: siteSettings.taglineBn,
              sub_tagline: siteSettings.subTagline,
              footer_tagline: siteSettings.footerTagline,
              phone: siteSettings.phone,
              phone_display: siteSettings.phoneDisplay,
              whatsapp_number: siteSettings.whatsappNumber,
              email: siteSettings.email,
              address: siteSettings.address,
              logo_url: siteSettings.logoUrl,
              facebook_url: siteSettings.facebookUrl,
              youtube_url: siteSettings.youtubeUrl,
              instagram_url: siteSettings.instagramUrl,
              google_map_url: siteSettings.googleMapUrl,
            }}
          />
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Homepage Hero</h2>
          <p className="mb-4 text-sm text-navy-600 dark:text-navy-300">The headline, subtitle, and call-to-action at the very top of the homepage.</p>
          <HeroContentForm initialValues={heroValues} />
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">FAQ</h2>
          {faqs.length === 0 ? (
            <EmptyState icon="❓" title="No FAQs yet" body="Questions you add will appear on the homepage FAQ section." />
          ) : (
            <FaqManager faqs={faqs} />
          )}
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Gallery</h2>
          <GalleryManager images={galleryImages} />
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Testimonials</h2>
          <CreateTestimonialForm />
          <div className="mt-6">
            {testimonials.length === 0 ? (
              <EmptyState icon="💬" title="No testimonials yet" body="Real, consented student testimonials you add will appear here as drafts until published." />
            ) : (
              <TestimonialList testimonials={testimonials} />
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Site Banners</h2>
          <CreateBannerForm />
          {banners.length === 0 ? (
            <EmptyState className="mt-6" icon="📣" title="No banners yet" body="Promotional banners you add will appear here, toggleable on/off." />
          ) : (
            <BannerList banners={banners} />
          )}
        </section>
      </div>
    </div>
  );
}
