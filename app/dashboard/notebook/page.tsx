import Link from "next/link";
import { PenLine, Bookmark, SpellCheck2 } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getMyNotes, getMyVocabulary } from "@/lib/dashboard/repository";
import { getMyBookmarkedLessons } from "@/lib/lessons/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function NotebookPage() {
  const [notes, bookmarks, vocabulary] = await Promise.all([getMyNotes(), getMyBookmarkedLessons(), getMyVocabulary()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Notebook</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Your notes, saved moments, and personal vocabulary list — all in one place.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-navy-900 dark:text-white">
            <PenLine className="h-4 w-4 text-gold-700 dark:text-gold-400" strokeWidth={1.75} aria-hidden="true" /> My Notes
          </h2>
          {notes.length === 0 ? (
            <EmptyState className="mt-3" icon={<PenLine className="h-6 w-6" strokeWidth={1.75} />} title="No notes yet" body="Notes you take during lessons will appear here." />
          ) : (
            <ul className="mt-3 space-y-2">{notes.map((n: { id: string; content: string }) => <li key={n.id} className="rounded-lg border border-navy-100 p-3 text-sm dark:border-navy-700">{n.content}</li>)}</ul>
          )}
        </div>
        <div>
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-navy-900 dark:text-white">
            <Bookmark className="h-4 w-4 text-gold-700 dark:text-gold-400" strokeWidth={1.75} aria-hidden="true" /> Bookmarked Lessons
          </h2>
          {bookmarks.length === 0 ? (
            <EmptyState className="mt-3" icon={<Bookmark className="h-6 w-6" strokeWidth={1.75} />} title="No bookmarks yet" body="Bookmark a lesson from its player page to find it again quickly." />
          ) : (
            <ul className="mt-3 space-y-2">
              {bookmarks.map((b: { id: string; lessons: { id: string; title: string; course_slug: string } | null }) => (
                <li key={b.id} className="rounded-lg border border-navy-100 p-3 text-sm dark:border-navy-700">
                  {b.lessons ? (
                    <Link href={`/dashboard/courses/${b.lessons.course_slug}/learn/${b.lessons.id}`} className="font-medium text-navy-800 hover:text-gold-800 dark:text-navy-100">
                      {b.lessons.title}
                    </Link>
                  ) : (
                    "Lesson no longer available"
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-navy-900 dark:text-white">
            <SpellCheck2 className="h-4 w-4 text-gold-700 dark:text-gold-400" strokeWidth={1.75} aria-hidden="true" /> Vocabulary Notebook
          </h2>
          {vocabulary.length === 0 ? (
            <EmptyState className="mt-3" icon={<SpellCheck2 className="h-6 w-6" strokeWidth={1.75} />} title="No words saved yet" body="Save new words as you learn them, with your own example sentences." />
          ) : (
            <ul className="mt-3 space-y-2">{vocabulary.map((v: { id: string; word: string }) => <li key={v.id} className="rounded-lg border border-navy-100 p-3 text-sm dark:border-navy-700">{v.word}</li>)}</ul>
          )}
        </div>
      </div>
    </div>
  );
}
