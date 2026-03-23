"use client";

import { useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { useAuthStore } from "@/store/authStore";

interface AuthStoreInitializerProps {
  user: User | null;
  profile: any | null;
}

export function AuthStoreInitializer({ user, profile }: AuthStoreInitializerProps) {
  const initialized = useRef(false);

  // Initialize the store immediately on client render (before effects run)
  if (!initialized.current) {
    useAuthStore.setState({ user, profile, isLoading: false });
    initialized.current = true;
  }

  // Update store if the server-provided user changes (e.g., on navigation)
  useEffect(() => {
    useAuthStore.setState({ user, profile, isLoading: false });
  }, [user, profile]);

  return null;
}
