"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  Folder,
  FolderPlus,
  Trash2,
  RotateCcw,
  X,
  ImageOff,
  ChevronRight,
  Home,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SearchInput } from "@/components/ui/SearchInput";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import {
  listMedia,
  listTrash,
  createMediaFolder,
  softDeleteMedia,
  restoreMedia,
  permanentlyDeleteMedia,
  type MediaItem,
  type TrashedMediaItem,
} from "@/lib/admin/media-repository";

const BUCKET = "site-content";
const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;
const SKIP_COMPRESSION_UNDER_BYTES = 400_000;

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Real client-side optimization: downscale to a sane max dimension and re-encode as JPEG at 82% quality — skipped for already-small files, PNGs with transparency stay PNG, and SVGs pass through untouched. */
async function optimizeImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;
  if (file.size < SKIP_COMPRESSION_UNDER_BYTES) return file;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const keepPng = file.type === "image/png";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, keepPng ? "image/png" : "image/jpeg", keepPng ? undefined : JPEG_QUALITY)
  );
  return blob ?? file;
}

interface MediaManagerProps {
  /** Provided when the manager is embedded as a picker (e.g. inside a Modal from ImageUploadField) — selecting an image calls this instead of just previewing it. */
  onSelect?: (url: string) => void;
}

export function MediaManager({ onSelect }: MediaManagerProps) {
  const [folder, setFolder] = useState("");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"browse" | "trash">("browse");
  const [trashItems, setTrashItems] = useState<TrashedMediaItem[]>([]);
  const [trashLoading, setTrashLoading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null);
  const [pendingPermanentDelete, setPendingPermanentDelete] = useState<TrashedMediaItem | null>(null);
  const [busyPath, setBusyPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async (targetFolder: string) => {
    setLoading(true);
    setItems(await listMedia(targetFolder));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh(folder);
  }, [folder, refresh]);

  async function refreshTrash() {
    setTrashLoading(true);
    setTrashItems(await listTrash());
    setTrashLoading(false);
  }

  useEffect(() => {
    if (view === "trash") refreshTrash();
  }, [view]);

  const breadcrumbs = useMemo(() => (folder ? folder.split("/") : []), [folder]);

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, query]);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setUploadingCount(list.length);
    const supabase = createClient();

    for (const file of list) {
      const optimized = await optimizeImage(file);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${folder ? folder + "/" : ""}${Date.now()}-${safeName}`;
      await supabase.storage.from(BUCKET).upload(path, optimized, { contentType: file.type });
      setUploadingCount((n) => Math.max(0, n - 1));
    }
    setUploadingCount(0);
    refresh(folder);
  }

  async function handleCreateFolder() {
    if (!newFolderName.trim()) return;
    const result = await createMediaFolder(folder, newFolderName);
    if (result.success) {
      setNewFolderName("");
      setNewFolderOpen(false);
      refresh(folder);
    }
  }

  async function handleDelete(item: MediaItem) {
    setBusyPath(item.path);
    const result = await softDeleteMedia(item.path);
    setBusyPath(null);
    setPendingDelete(null);
    if (result.success) refresh(folder);
  }

  async function handleRestore(item: TrashedMediaItem) {
    setBusyPath(item.trashPath);
    const result = await restoreMedia(item.trashPath, item.originalPath);
    setBusyPath(null);
    if (result.success) refreshTrash();
  }

  async function handlePermanentDelete(item: TrashedMediaItem) {
    setBusyPath(item.trashPath);
    const result = await permanentlyDeleteMedia(item.trashPath);
    setBusyPath(null);
    setPendingPermanentDelete(null);
    if (result.success) refreshTrash();
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-full border border-navy-200 p-0.5 dark:border-navy-700">
          <button
            onClick={() => setView("browse")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              view === "browse" ? "bg-navy-800 text-white dark:bg-gold-500 dark:text-navy-900" : "text-navy-600 dark:text-navy-300"
            )}
          >
            Library
          </button>
          <button
            onClick={() => setView("trash")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              view === "trash" ? "bg-navy-800 text-white dark:bg-gold-500 dark:text-navy-900" : "text-navy-600 dark:text-navy-300"
            )}
          >
            <Trash2 className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
            Trash
          </button>
        </div>

        {view === "browse" && (
          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <SearchInput value={query} onChange={setQuery} placeholder="Search this folder…" className="w-full max-w-[220px]" />
            <button
              onClick={() => setNewFolderOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-navy-200 px-3.5 py-2 text-xs font-semibold text-navy-700 transition-colors hover:border-gold-400 hover:text-gold-800 dark:border-navy-600 dark:text-navy-200 dark:hover:text-gold-400"
            >
              <FolderPlus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              New Folder
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingCount > 0}
              className="flex items-center gap-1.5 rounded-full bg-gold-600 px-4 py-2 text-xs font-semibold text-navy-900 shadow-gold transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:bg-gold-500 disabled:opacity-60"
            >
              {uploadingCount > 0 ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} aria-hidden="true" />
                  Uploading {uploadingCount}…
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  Upload
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            />
          </div>
        )}
      </div>

      {view === "browse" && (
        <>
          {/* Breadcrumbs */}
          <div className="mt-4 flex flex-wrap items-center gap-1 text-xs font-medium text-navy-500 dark:text-navy-400">
            <button onClick={() => setFolder("")} className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-navy-100 hover:text-navy-800 dark:hover:bg-white/5 dark:hover:text-white">
              <Home className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Library
            </button>
            {breadcrumbs.map((part, i) => {
              const path = breadcrumbs.slice(0, i + 1).join("/");
              return (
                <span key={path} className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                  <button onClick={() => setFolder(path)} className="rounded px-1.5 py-0.5 hover:bg-navy-100 hover:text-navy-800 dark:hover:bg-white/5 dark:hover:text-white">
                    {part}
                  </button>
                </span>
              );
            })}
          </div>

          {/* Drop zone / grid */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
            }}
            className={cn(
              "mt-3 min-h-[220px] rounded-lg border-2 border-dashed p-4 transition-colors",
              dragActive ? "border-gold-500 bg-gold-50/50 dark:bg-gold-500/5" : "border-navy-100 dark:border-navy-700"
            )}
          >
            {loading ? (
              <div className="flex h-40 items-center justify-center text-navy-400">
                <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} aria-hidden="true" />
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-sm text-navy-400 dark:text-navy-500">
                <ImageOff className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                {query ? `No files match "${query}".` : "This folder is empty — drag images here or click Upload."}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {visibleItems.map((item) =>
                  item.isFolder ? (
                    <button
                      key={item.path}
                      onClick={() => setFolder(item.path)}
                      className="flex flex-col items-center gap-2 rounded-lg border border-navy-100 bg-white p-4 text-center shadow-soft transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:border-gold-300/60 hover:shadow-card dark:border-navy-700 dark:bg-navy-800"
                    >
                      <Folder className="h-8 w-8 text-gold-600 dark:text-gold-400" strokeWidth={1.5} aria-hidden="true" />
                      <span className="truncate text-xs font-semibold text-navy-800 dark:text-navy-100">{item.name}</span>
                    </button>
                  ) : (
                    <div
                      key={item.path}
                      className="group relative overflow-hidden rounded-lg border border-navy-100 bg-white shadow-soft transition-all duration-200 ease-premium hover:shadow-card dark:border-navy-700 dark:bg-navy-800"
                    >
                      <button onClick={() => setPreviewItem(item)} className="block w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded URL */}
                        <img src={item.url} alt={item.name} className="aspect-square w-full object-cover" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-navy-950/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                        {onSelect && (
                          <button
                            onClick={() => onSelect(item.url)}
                            aria-label={`Use ${item.name}`}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-navy-900"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </button>
                        )}
                        <button
                          onClick={() => setPendingDelete(item)}
                          disabled={busyPath === item.path}
                          aria-label={`Delete ${item.name}`}
                          className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-error"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </>
      )}

      {view === "trash" && (
        <div className="mt-4">
          <p className="text-xs text-navy-500 dark:text-navy-400">
            Deleted files are kept here until you restore or permanently remove them — nothing is lost by accident.
          </p>
          {trashLoading ? (
            <div className="mt-6 flex h-32 items-center justify-center text-navy-400">
              <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2} aria-hidden="true" />
            </div>
          ) : trashItems.length === 0 ? (
            <div className="mt-6 flex h-32 flex-col items-center justify-center gap-2 text-center text-sm text-navy-400 dark:text-navy-500">
              <Trash2 className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
              Trash is empty.
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {trashItems.map((item) => (
                <div key={item.trashPath} className="overflow-hidden rounded-lg border border-navy-100 bg-white shadow-soft dark:border-navy-700 dark:bg-navy-800">
                  {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded URL */}
                  <img src={item.url} alt={item.name} className="aspect-square w-full object-cover opacity-60" />
                  <div className="p-2">
                    <p className="truncate text-xs font-semibold text-navy-800 dark:text-navy-100">{item.name}</p>
                    <p className="text-[10px] text-navy-400">{formatBytes(item.size)}</p>
                    <div className="mt-1.5 flex gap-2">
                      <button
                        onClick={() => handleRestore(item)}
                        disabled={busyPath === item.trashPath}
                        className="flex items-center gap-1 text-[11px] font-semibold text-gold-800 underline dark:text-gold-400"
                      >
                        <RotateCcw className="h-3 w-3" strokeWidth={2} /> Restore
                      </button>
                      <button
                        onClick={() => setPendingPermanentDelete(item)}
                        disabled={busyPath === item.trashPath}
                        className="text-[11px] font-semibold text-error underline"
                      >
                        Delete Forever
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New folder dialog */}
      <Modal
        open={newFolderOpen}
        onClose={() => setNewFolderOpen(false)}
        title="New Folder"
        description={folder ? `Inside "${folder}"` : "In the media library root"}
        size="sm"
        footer={
          <>
            <button onClick={() => setNewFolderOpen(false)} className="rounded-full px-5 py-2.5 text-sm font-semibold text-navy-700 hover:bg-navy-100 dark:text-navy-200 dark:hover:bg-white/10">
              Cancel
            </button>
            <button onClick={handleCreateFolder} className="rounded-full bg-gold-600 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-500">
              Create
            </button>
          </>
        }
      >
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Folder name"
          autoFocus
          className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
        />
      </Modal>

      {/* Preview */}
      <Modal open={previewItem !== null} onClose={() => setPreviewItem(null)} title={previewItem?.name ?? ""} size="lg">
        {previewItem && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded URL */}
            <img src={previewItem.url} alt={previewItem.name} className="max-h-[60vh] w-full rounded-lg object-contain" />
            <div className="mt-3 flex items-center justify-between text-xs text-navy-500 dark:text-navy-400">
              <span>{formatBytes(previewItem.size)}</span>
              {onSelect && (
                <button
                  onClick={() => {
                    onSelect(previewItem.url);
                    setPreviewItem(null);
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-gold-600 px-4 py-2 text-xs font-semibold text-navy-900 hover:bg-gold-500"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} /> Use This Image
                </button>
              )}
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && handleDelete(pendingDelete)}
        title="Move to Trash?"
        description={`"${pendingDelete?.name}" will move to Trash — you can restore it any time before it's permanently deleted.`}
        confirmLabel="Move to Trash"
        tone="danger"
        loading={busyPath === pendingDelete?.path}
      />

      <ConfirmDialog
        open={pendingPermanentDelete !== null}
        onClose={() => setPendingPermanentDelete(null)}
        onConfirm={() => pendingPermanentDelete && handlePermanentDelete(pendingPermanentDelete)}
        title="Delete Forever?"
        description={`"${pendingPermanentDelete?.name}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete Forever"
        tone="danger"
        loading={busyPath === pendingPermanentDelete?.trashPath}
      />
    </div>
  );
}
