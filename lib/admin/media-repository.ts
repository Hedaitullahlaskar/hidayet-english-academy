"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { MutationResult } from "@/lib/admin/repository";

/**
 * Media Manager — built entirely on the `site-content` Storage bucket that
 * already existed (Website CMS Phase 1), not a new database table. Supabase
 * Storage's own list/move/remove primitives already give real folder
 * navigation (prefix-based), so "folders" here are just path segments, not
 * a schema addition. Soft-delete is implemented the same way: a deleted
 * file moves under a flat `_trash/` prefix rather than actually being
 * removed, so "Restore" is a real, working move back — not a fabricated
 * button with no backing behavior.
 */

const BUCKET = "site-content";
const TRASH_PREFIX = "_trash";
const PLACEHOLDER_NAME = ".keep";

export interface MediaItem {
  name: string;
  path: string;
  url: string;
  size: number;
  updatedAt: string;
  isFolder: boolean;
}

export interface TrashedMediaItem {
  trashPath: string;
  originalPath: string;
  name: string;
  url: string;
  size: number;
  deletedAt: string;
}

function publicUrlFor(supabase: ReturnType<typeof createServerSupabaseClient>, path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function listMedia(folder: string): Promise<MediaItem[]> {
  const supabase = createServerSupabaseClient();
  const prefix = folder ? `${folder}/` : "";
  const { data, error } = await supabase.storage.from(BUCKET).list(folder || undefined, {
    limit: 500,
    sortBy: { column: "name", order: "asc" },
  });
  if (error || !data) return [];

  return data
    .filter((item) => item.name !== PLACEHOLDER_NAME && !(folder === "" && item.name === TRASH_PREFIX))
    .map((item) => {
      // Supabase Storage's list() convention: real objects have an `id`
      // and `metadata`; a "folder" is really just another prefix and
      // comes back with neither.
      const isFolder = item.id === null || item.id === undefined;
      const path = `${prefix}${item.name}`;
      return {
        name: item.name,
        path,
        url: isFolder ? "" : publicUrlFor(supabase, path),
        size: item.metadata?.size ?? 0,
        updatedAt: item.updated_at ?? item.created_at ?? "",
        isFolder,
      };
    })
    .sort((a, b) => (a.isFolder === b.isFolder ? a.name.localeCompare(b.name) : a.isFolder ? -1 : 1));
}

export async function createMediaFolder(parentFolder: string, name: string): Promise<MutationResult> {
  const clean = name.trim().replace(/[^a-zA-Z0-9._-]/g, "-");
  if (!clean) return { success: false, error: "Please enter a folder name." };
  const supabase = createServerSupabaseClient();
  const path = `${parentFolder ? parentFolder + "/" : ""}${clean}/${PLACEHOLDER_NAME}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, new Blob([""]), { upsert: false });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function softDeleteMedia(path: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const trashPath = `${TRASH_PREFIX}/${encodeURIComponent(path)}__${Date.now()}`;
  const { error } = await supabase.storage.from(BUCKET).move(path, trashPath);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function listTrash(): Promise<TrashedMediaItem[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.storage.from(BUCKET).list(TRASH_PREFIX, {
    limit: 500,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error || !data) return [];

  return data.map((item) => {
    const trashPath = `${TRASH_PREFIX}/${item.name}`;
    const match = item.name.match(/^(.*)__(\d+)$/);
    const originalPath = match ? decodeURIComponent(match[1]) : item.name;
    const deletedAtMs = match ? Number(match[2]) : 0;
    return {
      trashPath,
      originalPath,
      name: originalPath.split("/").pop() ?? originalPath,
      url: publicUrlFor(supabase, trashPath),
      size: item.metadata?.size ?? 0,
      deletedAt: deletedAtMs ? new Date(deletedAtMs).toISOString() : (item.created_at ?? ""),
    };
  });
}

export async function restoreMedia(trashPath: string, originalPath: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.storage.from(BUCKET).move(trashPath, originalPath);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function permanentlyDeleteMedia(trashPath: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.storage.from(BUCKET).remove([trashPath]);
  return error ? { success: false, error: error.message } : { success: true };
}
