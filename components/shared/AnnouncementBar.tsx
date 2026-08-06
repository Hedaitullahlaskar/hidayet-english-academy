import Link from "next/link";
import { getActiveBanner } from "@/lib/banners";

// Reads a real, admin-published banner (see /admin/cms) when one is active
// and in its scheduled window; falls back to the evergreen Madhyamik promo
// otherwise — same honest-fallback pattern as Testimonials, never a blank bar.
export async function AnnouncementBar() {
  const banner = await getActiveBanner();

  if (banner) {
    return (
      <div className="relative z-50 bg-navy-950 py-2 text-center text-xs font-medium text-navy-100 sm:text-sm">
        <p className="px-4">
          {banner.link_url ? (
            <a
              href={banner.link_url}
              className="font-semibold text-gold-400 underline underline-offset-2 hover:text-gold-300"
            >
              {banner.message}
            </a>
          ) : (
            banner.message
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-50 bg-navy-950 py-2 text-center text-xs font-medium text-navy-100 sm:text-sm">
      <p className="px-4">
        🎓 100% Free English Program for Madhyamik (Class 10) Students —{" "}
        <Link
          href="/#madhyamik"
          className="font-semibold text-gold-400 underline underline-offset-2 hover:text-gold-300"
        >
          Limited Seats, Join Now
        </Link>
      </p>
    </div>
  );
}
