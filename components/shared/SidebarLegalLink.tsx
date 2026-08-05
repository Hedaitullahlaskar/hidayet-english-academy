import Link from "next/link";

export function SidebarLegalLink() {
  return (
    <div className="mt-4 border-t border-navy-100 pt-4 dark:border-navy-800">
      <Link
        href="/legal"
        className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-navy-400 hover:text-gold-800 dark:text-navy-500 dark:hover:text-gold-400"
      >
        <span aria-hidden="true">📜</span> Legal Center
      </Link>
    </div>
  );
}
