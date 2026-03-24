import { createClient } from "@/lib/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // 로그인 성공 후 이동할 페이지 (기본값: 메인 '/' )
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    // 1. 전달받은 code를 사용하여 세션을 생성하고 쿠키에 저장합니다.
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 2. 인증 성공 시 원하는 페이지로 리다이렉트
      return NextResponse.redirect(
        `${origin}${next}`,
      );
    }
  }

  // 인증 실패 시 에러 페이지나 로그인 페이지로 리다이렉트
  return NextResponse.redirect(
    `${origin}/login?error=auth_code_error`,
  );
}
