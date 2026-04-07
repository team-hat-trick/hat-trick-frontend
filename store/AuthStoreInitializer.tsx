"use client";

import { useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { useAuthStore } from "@/store/authStore";

interface AuthStoreInitializerProps {
  user: User | null;
  profile: any | null;
}

export function AuthStoreInitializer({
  user,
  profile,
}: AuthStoreInitializerProps) {
  const initialized = useRef(false);

  useEffect(() => {
    // 💡 렌더링이 끝난 후 안전하게 상태를 업데이트합니다.
    if (!initialized.current) {
      useAuthStore.setState({ user, profile, isLoading: false });
      initialized.current = true;
    } else {
      // 서버에서 전달된 user, profile이 변경되었을 때만 업데이트 (예: 네비게이션)
      useAuthStore.setState({ user, profile, isLoading: false });
    }
  }, [user, profile]);

  // 렌더링 중에는 아무런 부수 효과(Side Effect)도 발생시키지 않습니다.
  return null;
}
