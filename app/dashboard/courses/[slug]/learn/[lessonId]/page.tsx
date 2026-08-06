import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonMediaPlayer } from "@/components/lessons/LessonMediaPlayer";
import { LessonBookmarkButton } from "@/components/lessons/LessonBookmarkButton";
import { LessonQuiz } from "@/components/lessons/LessonQuiz";
import { LessonHomeworkPanel } from "@/components/lessons/LessonHomeworkPanel";
import {
  getLessonById,
  getLessonsForCourse,
  getMyProgressForLesson,
  isLessonBookmarked,
  touchLessonProgress,
  getLessonQuiz,
  getLessonAssignment,
  getMySubmissionForAssignment,
} from "@/lib/lessons/repository";

export const metadata = { robots: { index: false, follow: false } };

interface LessonPageParams {
  params: { slug: string; lessonId: string };
}

export default async function LessonDetailPage({ params }: LessonPageParams) {
  const lesson = await getLessonById(params.lessonId);
  if (!lesson || lesson.course_slug !== params.slug) notFound();

  // Real "last viewed" tracking — this single call is what powers both
  // "Continue Lesson" (course list page) and "Recently Viewed Lessons"
  // (dashboard overview), by keeping lesson_progress.updated_at current.
  await touchLessonProgress(params.lessonId);

  const [allLessons, progress, bookmarked, quiz, assignment] = await Promise.all([
    getLessonsForCourse(params.slug),
    getMyProgressForLesson(params.lessonId),
    isLessonBookmarked(params.lessonId),
    getLessonQuiz(params.lessonId),
    getLessonAssignment(params.lessonId),
  ]);

  const submission = assignment ? await getMySubmissionForAssignment(assignment.id) : null;

  const orderedLessons = (allLessons as { id: string; title: string; order_index: number }[]).sort(
    (a, b) => a.order_index - b.order_index
  );
  const currentIndex = orderedLessons.findIndex((l) => l.id === params.lessonId);
  const prevLesson = currentIndex > 0 ? orderedLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < orderedLessons.length - 1 ? orderedLessons[currentIndex + 1] : null;

  return (
    <div>
      <Link href={`/dashboard/courses/${params.slug}/learn`} className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
        ← Back to Lessons
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-semibold text-navy-900 dark:text-white sm:text-2xl">{lesson.title}</h1>
        <LessonBookmarkButton lessonId={params.lessonId} initiallyBookmarked={bookmarked} />
      </div>
      <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">{lesson.module_title}</p>

      <div className="mt-6">
        <LessonMediaPlayer
          lessonId={params.lessonId}
          lessonType={lesson.lesson_type}
          contentUrl={lesson.content_url}
          notesUrl={lesson.notes_url}
          initiallyCompleted={Boolean(progress?.completed_at)}
        />
      </div>

      {quiz && quiz.test_questions?.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Quick Quiz</h2>
          {/* correct_answer is stripped here, before this becomes a client
              prop — grading happens server-side in submitLessonQuizAttempt. */}
          <LessonQuiz
            testId={quiz.id}
            totalMarks={quiz.total_marks}
            questions={quiz.test_questions.map((tq: { questions: Record<string, unknown>; [key: string]: unknown }) => {
              const { correct_answer, ...safeQuestion } = tq.questions;
              return { ...tq, questions: safeQuestion };
            })}
          />
        </div>
      )}

      {assignment && (
        <div className="mt-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Homework for This Lesson</h2>
          <LessonHomeworkPanel
            assignmentId={assignment.id}
            title={assignment.title}
            description={assignment.description}
            alreadySubmitted={Boolean(submission)}
            dueAt={assignment.due_at}
          />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between border-t border-navy-100 pt-6 dark:border-navy-700">
        {prevLesson ? (
          <Link href={`/dashboard/courses/${params.slug}/learn/${prevLesson.id}`} className="text-sm font-semibold text-navy-600 hover:text-gold-800 dark:text-navy-300 dark:hover:text-gold-400">
            ← {prevLesson.title}
          </Link>
        ) : <span />}
        {nextLesson ? (
          <Link href={`/dashboard/courses/${params.slug}/learn/${nextLesson.id}`} className="text-sm font-semibold text-navy-600 hover:text-gold-800 dark:text-navy-300 dark:hover:text-gold-400">
            {nextLesson.title} →
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
