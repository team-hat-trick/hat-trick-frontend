import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoginForm from "@/features/auth/components/LoginForm";

const LoginPage = () => {
  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto px-4"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgb(10, 10, 10) 0%, rgb(10, 10, 10) 100%)",
      }}
    >
      {/* Background layer */}
      <div className="absolute inset-0 bg-[#050505] z-0"></div>

      {/* Blurs */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(0,188,125,0.05)] blur-[75px] rounded-full size-[1000px] pointer-events-none z-0"></div>
      <div className="absolute right-[-128px] top-[-128px] bg-[rgba(0,188,125,0.1)] blur-[60px] rounded-full size-[384px] pointer-events-none z-0"></div>

      {/* Nav Link */}
      <div className="absolute left-[20px] top-[20px] md:left-[40px] md:top-[40px] z-20">
        <Link
          href="/"
          className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[14px] h-[38px] px-[16px] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
        >
          <ArrowLeft className="size-[18px] text-[#62748e]" />
          <span className="text-[#62748e] font-bold text-[14px] tracking-[-0.35px]">
            홈으로
          </span>
        </Link>
      </div>

      {/* Form */}
      <div className="w-full flex justify-center z-10 my-[40px]">
        <LoginForm />
      </div>

      {/* Footer text */}
      <div className="absolute bottom-[20px] md:bottom-[40px] left-1/2 -translate-x-1/2 text-center w-full z-20 hidden md:block">
        <p className="text-[#314158] text-[10px] font-bold tracking-[2px] uppercase">
          By continuing, you agree to HAT-TRICK&apos;s Terms of Service and
          Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
