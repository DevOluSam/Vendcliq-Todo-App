"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
