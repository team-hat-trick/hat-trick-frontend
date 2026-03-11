"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { SignupSchema } from "@/features/auth/schemas/signup";
import { redirect } from "next/navigation";
import { LoginSchema } from "@/features/auth/schemas/login";

export async function signUpAction(data: SignupSchema) {
  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `http://localhost:3000/auth/callback`,
      data: {
        full_name: data.name,
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  // identities 배열이 비어있다면 이미 가입된 계정인 것
  if (authData?.user?.identities && authData.user.identities.length === 0) {
    return { success: false, message: "이미 가입된 이메일입니다." };
  }

  return { success: true };
}

export async function verfiyCodeAction(email: string, token: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  if (error) {
    console.error("Google Login Error:", error.message);
    return { success: false, message: error.message };
  }

  if (data.url) {
    return redirect(data.url);
  }
}

export async function signInWithKakao() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (error) {
    console.error("Kakao Login Error:", error.message);
    return { success: false, message: error.message };
  }

  if (data.url) {
    return redirect(data.url);
  }
}

export async function signInAction(data: LoginSchema) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return {
      success: false,
      message: "이메일 또는 비밀번호가 일치하지 않습니다.",
    };
  }

  return { success: true };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
