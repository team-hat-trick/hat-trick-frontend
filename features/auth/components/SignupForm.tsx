"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/main_logo.png";
import { signupSchema, type SignupSchema } from "../schemas/signup";
import { signUpAction, verfiyCodeAction } from "@/app/auth/action";
import { OTPInput } from "./OTPInput";
import { createBrowserSupabaseClient } from "@/lib/utils/supabase/client";

export function SignupForm() {
  const [step, setStep] = useState<"info" | "verify">("info");
  const [userEmail, setUserEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    if (step === "info") {
      const result = await signUpAction(data);
      if (result.success) {
        setUserEmail(data.email);
        setStep("verify");
      } else {
        alert(result.message);
      }
    } else {
      const code = data.verificationCode;
      if (!code) {
        alert("인증 코드를 입력해주세요.");
        return;
      }

      const result = await verfiyCodeAction(userEmail, code);
      if (result.success) {
        alert("환영합니다! 가입이 완료되었습니다.");
        window.location.href = "/dashboard";
      } else {
        alert("코드가 일치하지 않습니다.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleKakaoLogin = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="backdrop-blur-[20px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[40px] w-full max-w-[448px] p-6 sm:p-[48px] relative z-10 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex justify-center mb-6">
        <Image
          src={logo}
          alt="HAT-TRICK Logo"
          width={80}
          height={80}
          className="object-contain drop-shadow-[0px_5px_15px_rgba(0,188,125,0.25)]"
        />
      </div>

      <h1 className="text-white text-center text-[24px] sm:text-[29.6px] font-bold italic uppercase tracking-[-1.5px] leading-[36px] mb-2">
        Join the Squad
      </h1>
      <p className="text-[#62748e] text-center text-[14px] font-bold tracking-[1.4px] uppercase mb-12">
        {step === "info" ? "HAT-TRICK 회원가입" : "이메일 인증"}
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === "info" && (
          <>
            {/* Name Input */}
            <div className="mb-4">
              <label className="text-[#62748e] text-[10px] font-black tracking-[1px] uppercase ml-1 block mb-2">
                이름
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#314158]">
                  <User className="size-5" />
                </div>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="홍길동"
                  className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] rounded-[16px] h-[56px] pl-[52px] pr-4 text-white font-bold text-[14px] outline-none focus:border-[#00bc7d] transition-colors placeholder:text-[#314158]"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label className="text-[#62748e] text-[10px] font-black tracking-[1px] uppercase ml-1 block mb-2 mt-4">
                이메일 주소
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#314158]">
                  <Mail className="size-5" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="soccer@kickoff.com"
                  className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] rounded-[16px] h-[56px] pl-[52px] pr-4 text-white font-bold text-[14px] outline-none focus:border-[#00bc7d] transition-colors placeholder:text-[#314158]"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="text-[#62748e] text-[10px] font-black tracking-[1px] uppercase ml-1 block mb-2 mt-4">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#314158]">
                  <Lock className="size-5" />
                </div>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] rounded-[16px] h-[56px] pl-[52px] pr-4 text-white font-bold text-[14px] outline-none focus:border-[#00bc7d] transition-colors placeholder:text-[#314158] tracking-widest"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Password Confirm Input */}
            <div className="mb-6">
              <label className="text-[#62748e] text-[10px] font-black tracking-[1px] uppercase ml-1 block mb-2 mt-4">
                비밀번호 확인
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#314158]">
                  <Lock className="size-5" />
                </div>
                <input
                  type="password"
                  {...register("passwordConfirm")}
                  placeholder="••••••••"
                  className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] rounded-[16px] h-[56px] pl-[52px] pr-4 text-white font-bold text-[14px] outline-none focus:border-[#00bc7d] transition-colors placeholder:text-[#314158] tracking-[5px]"
                />
              </div>
              {errors.passwordConfirm && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00bc7d] text-black text-[18px] font-black h-[56px] rounded-[16px] mt-6 shadow-[0px_20px_25px_-5px_rgba(0,188,125,0.2),0px_8px_10px_-6px_rgba(0,188,125,0.2)] hover:bg-[#00a870] transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "처리 중..." : "다음"}
            </button>
          </>
        )}

        {step === "verify" && (
          <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-6">
              <label className="text-[#62748e] text-[10px] font-black tracking-[1px] uppercase ml-1 block mb-2 mt-4">
                인증 코드
              </label>
              <div className="relative">
                <Controller
                  name="verificationCode"
                  control={control} // useForm에서 꺼내온 control
                  render={({ field }) => (
                    <OTPInput
                      value={field.value || ""}
                      onChange={field.onChange}
                      length={6}
                    />
                  )}
                />
              </div>
              <p className="text-[#62748e] text-[12px] font-medium text-center mt-4">
                입력하신 이메일로 발송된 인증코드를 입력해주세요.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00bc7d] text-black text-[18px] font-black h-[56px] rounded-[16px] mt-2 shadow-[0px_20px_25px_-5px_rgba(0,188,125,0.2),0px_8px_10px_-6px_rgba(0,188,125,0.2)] hover:bg-[#00a870] transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "처리 중..." : "회원가입 완료"}
            </button>
            <button
              type="button"
              onClick={() => setStep("info")}
              className="w-full mt-6 text-[#62748e] text-[14px] font-bold hover:text-white transition-colors cursor-pointer"
            >
              이전 단계로 돌아가기
            </button>
          </div>
        )}
      </form>

      <div className="relative flex items-center py-8 opacity-60">
        <div className="flex-grow border-t border-[rgba(255,255,255,0.2)]"></div>
        <span className="flex-shrink-0 mx-4 text-[#62748e] text-[10px] font-black tracking-[1px] uppercase">
          또는
        </span>
        <div className="flex-grow border-t border-[rgba(255,255,255,0.2)]"></div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          className="flex-1 bg-white h-[48px] rounded-[14px] flex items-center justify-center gap-2 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={handleGoogleLogin}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.6806 8.18182C15.6806 7.61455 15.6295 7.06909 15.5341 6.54545H8.00004V9.64364H12.3069C12.1228 10.6436 11.5432 11.4873 10.6978 12.0545V13.9273H13.2887C14.8055 12.5309 15.6806 10.5455 15.6806 8.18182Z"
              fill="#4285F4"
            />
            <path
              d="M8.00008 16C10.1614 16 11.9751 15.2836 13.2923 13.9273L10.7014 12.0545C9.98871 12.5309 9.07189 12.8218 8.00008 12.8218C5.92735 12.8218 4.17508 11.4218 3.5478 9.53455H0.875V11.6073C2.18417 14.2073 4.88871 16 8.00008 16Z"
              fill="#34A853"
            />
            <path
              d="M3.54452 9.53454C3.38089 9.04364 3.28885 8.53091 3.28885 8C3.28885 7.46909 3.38089 6.95636 3.54452 6.46545V4.39273H0.871796C0.334978 5.46182 0.03125 6.69818 0.03125 8C0.03125 9.30182 0.334978 10.5382 0.871796 11.6073L3.54452 9.53454Z"
              fill="#FBBC05"
            />
            <path
              d="M8.00008 3.17818C9.17622 3.17818 10.2296 3.58182 11.0614 4.37091L13.3435 2.08909C11.9751 0.814545 10.1614 0 8.00008 0C4.88871 0 2.18417 1.79273 0.875 4.39273L3.5478 6.46545C4.17508 4.57818 5.92735 3.17818 8.00008 3.17818Z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-black font-bold text-[11.8px]">
            Google로 로그인
          </span>
        </button>
        <button
          type="button"
          className="flex-1 bg-[#fee500] h-[48px] rounded-[14px] flex items-center justify-center gap-2 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] hover:bg-[#ebd500] transition-colors cursor-pointer"
          onClick={handleKakaoLogin}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 1.5C4.4445 1.5 0.75 4.31475 0.75 7.785C0.75 9.94425 2.17425 11.841 4.3215 12.9697L3.43575 16.2165C3.39375 16.3717 3.444 16.5367 3.56775 16.6358C3.6915 16.7348 3.861 16.7467 3.99675 16.6665L7.84275 14.2882C8.21625 14.331 8.601 14.3542 9 14.3542C13.5555 14.3542 17.25 11.5395 17.25 8.06925C17.25 4.599 13.5555 1.78425 9 1.5Z"
              fill="black"
              fillOpacity="0.85"
            />
          </svg>
          <span className="text-[rgba(0,0,0,0.85)] font-bold text-[11.8px]">
            카카오로 로그인
          </span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        <span className="text-[#62748e] font-bold text-[14px]">
          이미 계정이 있으신가요?
        </span>
        <Link
          href="/login"
          className="text-[#00bc7d] font-bold text-[14px] hover:underline"
        >
          로그인
        </Link>
      </div>
    </div>
  );
}
