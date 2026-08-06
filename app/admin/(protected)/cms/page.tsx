import { EmptyState } from "@/components/dashboard/EmptyState";
import { CreateTestimonialForm, TestimonialList, CreateBannerForm, BannerList } from "@/components/admin/CmsForms";
import { getAllTestimonials, getAllBanners } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminCmsPage() {
  const [testimonials, banners] = await Promise.all([getAllTestimonials(), getAllBanners()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Website CMS</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Manage testimonials and banners here. <strong>Important:</strong> the live Homepage, About, and FAQ pages
        still read from their original static files, not this table yet — see ADMIN_MODULE_README.md for why, and
        what wiring them together would involve.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Testimonials</h2>
          <CreateTestimonialForm />
          <div className="mt-6">
            {testimonials.length === 0 ? (
              <EmptyState icon="💬" title="No testimonials yet" body="Real, consented student testimonials you add will appear here as drafts until published." />
            ) : (
              <TestimonialList testimonials={testimonials} />
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Site Banners</h2>
          <CreateBannerForm />
          {banners.length === 0 ? (
            <EmptyState className="mt-6" icon="📣" title="No banners yet" body="Promotional banners you add will appear here, toggleable on/off." />
          ) : (
            <BannerList banners={banners} />
          )}
        </div>
      </div>
    </div>
  );
}
