import { MediaManager } from "@/components/admin/MediaManager";

export const metadata = { robots: { index: false, follow: false } };

export default function AdminMediaPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Media Library</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Every image uploaded through the Website CMS, in one browsable, searchable place — organized into
        folders, with a real Trash you can restore from.
      </p>
      <div className="mt-8">
        <MediaManager />
      </div>
    </div>
  );
}
