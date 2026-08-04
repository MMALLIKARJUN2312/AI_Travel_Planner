import Link from "next/link";
import { Plane } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Plane className="size-3.5" />
          </span>
          AI Travel Planner
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a
            href="https://github.com/MMALLIKARJUN2312/AI_Travel_Planner"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
          <span>© {new Date().getFullYear()} AI Travel Planner</span>
        </div>
      </div>
    </footer>
  );
}
