import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { createClient } from "@/lib/utils/supabase/server";
import { AuthStoreInitializer } from "@/store/AuthStoreInitializer";
import React from "react";

export const metadata = {
  title: "대시보드 - Hat Trick",
  description: "전 세계 주요 리그의 실시간 정보와 분석을 한눈에 확인하세요.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data: profileData } = await supabase
      .from("user_profile")
      .select("*")
      .eq("user_id", user.id)
      .single();
    profile = profileData;
  }

  return (
    <>
      <AuthStoreInitializer user={user} profile={profile} />
      <DashboardLayout />
    </>
  );
}
