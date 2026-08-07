"use client";

import { useState, useRef } from "react";
import { FolderOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/ui/Modal";
import { MediaManager } from "@/components/admin/MediaManager";

/**
 * Uploads to the public `site-content` storage bucket (see schema.sql) and
 * reports back the resulting public URL — the one basic upload primitive
 * every Website CMS field that needs an image (hero background, logo,
 * gallery photo) is built on. "Browse Library" opens the full Media
 * Manager (components/admin/MediaManager.tsx) as a picker, so reusing an
 * already-uploaded image no longer means re-uploading a duplicate.
 */
export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);

    const supabase = createClient();
    const filePath = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const { error: uploadError } = await supabase.storage.from("site-content").upload(filePath, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("site-content").getPublicUrl(filePath);
    onChange(publicUrlData.publicUrl);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded URL, next/image's domain allowlist would need updating per upload host
          <img src={value} alt="" className="h-16 w-16 shrink-0 rounded-lg border border-navy-200 object-cover dark:border-navy-600" />
        )}
        <div className="flex-1">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setLibraryOpen(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-navy-200 px-3.5 py-2.5 text-xs font-semibold text-navy-700 transition-colors hover:border-gold-400 hover:text-gold-800 dark:border-navy-600 dark:text-navy-200 dark:hover:text-gold-400"
            >
              <FolderOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Browse Library
            </button>
          </div>
          {uploading && <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">Uploading…</p>}
          {error && <p className="mt-1 text-xs text-error">{error}</p>}
        </div>
      </div>

      <Modal open={libraryOpen} onClose={() => setLibraryOpen(false)} title="Media Library" description="Pick an existing image, or upload a new one here." size="lg">
        <MediaManager
          onSelect={(url) => {
            onChange(url);
            setLibraryOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
