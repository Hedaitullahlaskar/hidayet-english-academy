import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="relative z-50 bg-navy-950 py-2 text-center text-xs font-medium text-navy-100 sm:text-sm">
      <p className="px-4">
        🎓 100% Free English Program for Madhyamik (Class 10) Students —{" "}
        <Link
          href="/#madhyamik"
          className="font-semibold text-gold-400 underline underline-offset-2 hover:text-gold-300"
        >
          Limited Seats, Join Now
        </Link>
      </p>
    </div>
  );
}
