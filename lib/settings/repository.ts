import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * PUBLIC SITE CONTENT — read-only, unauthenticated-safe. Same seam pattern
 * as lib/courses/repository.ts and lib/testimonials.ts: every public page
 * reads through these functions, never queries the tables directly, so a
 * future data-source change (e.g. adding caching) touches one file.
 */

export interface SiteSettings {
  academyName: string;
  taglineEn: string | null;
  taglineBn: string | null;
  subTagline: string | null;
  footerTagline: string | null;
  phone: string | null;
  phoneDisplay: string | null;
  whatsappNumber: string | null;
  email: string | null;
  address: string | null;
  logoUrl: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  instagramUrl: string | null;
  googleMapUrl: string | null;
}

const FALLBACK_SETTINGS: SiteSettings = {
  academyName: "Hidayet English Academy",
  taglineEn: "Learn English, Build Your Future",
  taglineBn: "ইংরেজি শিখুন, গড়ুন আপনার ভবিষ্যৎ",
  subTagline: "English Learning for Bengali Speakers Worldwide",
  footerTagline: "Learn Today, Lead Tomorrow",
  phone: "6290056461",
  phoneDisplay: "+91 62900 56461",
  whatsappNumber: "916290056461",
  email: "hidayetenglishacademy@gmail.com",
  address: null,
  logoUrl: "/images/hea-logo.png",
  facebookUrl: "https://facebook.com/hidayetenglishacademy",
  youtubeUrl: "https://youtube.com/@hidayetenglishacademy",
  instagramUrl: "https://instagram.com/hidayetenglishacademy",
  googleMapUrl: null,
};

// Falls back to today's real hardcoded values (not a placeholder — the
// literal content that shipped before this table existed), so a database
// that's momentarily unreachable never blanks the header/footer.
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (!data) return FALLBACK_SETTINGS;
    return {
      academyName: data.academy_name ?? FALLBACK_SETTINGS.academyName,
      taglineEn: data.tagline_en,
      taglineBn: data.tagline_bn,
      subTagline: data.sub_tagline,
      footerTagline: data.footer_tagline,
      phone: data.phone,
      phoneDisplay: data.phone_display,
      whatsappNumber: data.whatsapp_number,
      email: data.email,
      address: data.address,
      logoUrl: data.logo_url ?? FALLBACK_SETTINGS.logoUrl,
      facebookUrl: data.facebook_url,
      youtubeUrl: data.youtube_url,
      instagramUrl: data.instagram_url,
      googleMapUrl: data.google_map_url,
    };
  } catch {
    return FALLBACK_SETTINGS;
  }
}

export interface PublicFaq {
  id: string;
  question: string;
  answer: string;
}

export async function getFaqs(): Promise<PublicFaq[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("faqs")
      .select("id, question, answer")
      .eq("is_published", true)
      .order("order_index", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export interface PublicGalleryImage {
  id: string;
  imageUrl: string;
  altText: string;
  caption: string | null;
}

export async function getGalleryImages(): Promise<PublicGalleryImage[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("gallery_images")
      .select("id, image_url, alt_text, caption")
      .eq("is_published", true)
      .order("order_index", { ascending: true });
    return (data ?? []).map((row: { id: string; image_url: string; alt_text: string; caption: string | null }) => ({
      id: row.id,
      imageUrl: row.image_url,
      altText: row.alt_text,
      caption: row.caption,
    }));
  } catch {
    return [];
  }
}

/**
 * Generic reader for cms_content (Module 7's key-value content store) —
 * used for homepage sections whose fields are a small evolving set of
 * scalars rather than a growing list (which gets its own table, like
 * faqs/gallery_images above). Returns a plain { content_key: value_en }
 * map for one section, so callers can destructure the keys they need.
 */
export async function getCmsContentMap(section: string): Promise<Record<string, string>> {
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("cms_content").select("content_key, value_en").eq("section", section);
    const map: Record<string, string> = {};
    for (const row of data ?? []) {
      if (row.value_en) map[row.content_key] = row.value_en;
    }
    return map;
  } catch {
    return {};
  }
}
