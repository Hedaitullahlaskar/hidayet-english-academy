export function SuspendedAccountNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-100 p-6 dark:bg-navy-900">
      <div className="max-w-md rounded-xl border border-error/30 bg-white p-8 text-center shadow-elevated dark:bg-navy-800">
        <span className="text-3xl" aria-hidden="true">
          🚫
        </span>
        <h1 className="mt-4 font-display text-xl font-semibold text-navy-900 dark:text-white">
          Account Suspended
        </h1>
        <p className="mt-2 text-navy-600 dark:text-navy-300">
          Your account access has been suspended. If you believe this is a
          mistake, please contact the academy directly.
        </p>
        <a
          href="mailto:hidayetenglishacademy@gmail.com"
          className="mt-5 inline-block text-sm font-semibold text-gold-800 underline dark:text-gold-400"
        >
          hidayetenglishacademy@gmail.com
        </a>
      </div>
    </div>
  );
}
