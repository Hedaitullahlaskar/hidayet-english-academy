"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/dashboard/Avatar";
import { createClient } from "@/lib/supabase/client";

interface SettingsFormProps {
  initialName: string;
  initialPhone: string;
  initialTimezone: string;
  initialAvatarUrl: string | null;
}

export function SettingsForm({ initialName, initialPhone, initialTimezone, initialAvatarUrl }: SettingsFormProps) {
  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setAvatarUploading(false);
      return;
    }

    const filePath = `${user.id}/avatar-${Date.now()}.${file.name.split(".").pop()}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setAvatarUrl(publicUrlData.publicUrl);
      await supabase.from("profiles").update({ avatar_url: publicUrlData.publicUrl }).eq("id", user.id);
    }
    setAvatarUploading(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("error");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, timezone })
      .eq("id", user.id);

    setStatus(error ? "error" : "saved");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800 sm:p-8"
    >
      <div className="mb-6 flex items-center gap-4">
        <Avatar name={fullName || "Student"} avatarUrl={avatarUrl} size={64} />
        <div>
          <label className="cursor-pointer text-sm font-semibold text-gold-800 underline dark:text-gold-400">
            {avatarUploading ? "Uploading…" : "Change Photo"}
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" disabled={avatarUploading} />
          </label>
          <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">JPG or PNG, up to 2MB.</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="set-name" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
            Full Name
          </label>
          <input
            id="set-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="set-phone" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
            Phone
          </label>
          <input
            id="set-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="set-tz" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
            Timezone
          </label>
          <select
            id="set-tz"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          >
            <option value="Asia/Kolkata">India Standard Time</option>
            <option value="Asia/Dhaka">Bangladesh Time</option>
            <option value="Asia/Dubai">Gulf Standard Time</option>
            <option value="Europe/London">UK Time</option>
            <option value="America/New_York">US Eastern Time</option>
            <option value="Australia/Sydney">Australia Eastern Time</option>
          </select>
        </div>
      </div>

      {status === "saved" && <p className="mt-4 text-sm font-medium text-success-text dark:text-success">Saved.</p>}
      {status === "error" && (
        <p className="mt-4 text-sm font-medium text-error">Couldn&apos;t save — please try again.</p>
      )}

      <Button type="submit" size="lg" className="mt-6" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
