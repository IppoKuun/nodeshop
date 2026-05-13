"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/authApi";
import NavBar from "./NavBar";

const ALLOWED_ROLES = new Set(["owner", "admin", "viewer"]);

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const res = await auth.me();
        const role = res?.user?.role;

        if (!ALLOWED_ROLES.has(role)) {
          router.replace("/login");
          return;
        }

        if (mounted) setStatus("allowed");
      } catch {
        router.replace("/login");
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (status === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        <div className="w-56 overflow-hidden rounded bg-slate-200 dark:bg-slate-800">
          <div className="h-1 w-1/2 animate-progress bg-brand-600" />
        </div>
      </main>
    );
  }

  return (
    <>
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </>
  );
}
