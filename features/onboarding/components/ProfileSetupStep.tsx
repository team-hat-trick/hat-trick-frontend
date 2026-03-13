"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/utils/supabase/client";
import { updateProfileAction } from "@/app/auth/action";

interface ProfileSetupStepProps {
  initialName?: string;
  initialBio?: string;
  initialImageUrl?: string;
}

export function ProfileSetupStep({
  initialName = "",
  initialBio = "",
  initialImageUrl = "",
}: ProfileSetupStepProps) {
  const [nickname, setNickname] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  // Optional: For handling newly uploaded images locally
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const supabase = createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/profile-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      console.log(publicUrl);

      setImageUrl(publicUrl);
    } catch (error: any) {
      alert("이미지 업로드 실패: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNextStep = async () => {
    console.log(imageUrl);
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const result = await updateProfileAction({
      nickname,
      bio,
      avataUrl: imageUrl,
    });

    if (result.success) {
      router.push("/");
    } else {
      alert("저장 실패: " + result.message);
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#050505] overflow-hidden flex justify-center items-center">
      {/* Background Effect */}
      <div className="absolute top-[-69px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[rgba(0,188,125,0.05)] rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-[672px] px-6 py-12 flex flex-col gap-8 h-full min-h-[682px] justify-center z-10">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end w-full">
            <div className="flex flex-col gap-1">
              <h2 className="text-[30px] font-black italic text-white uppercase tracking-[-1.1px] leading-[36px] font-['Inter']">
                Set Profile
              </h2>
              <p className="text-[#90a1b9] text-[14px] font-bold tracking-[1.25px]">
                나만의 멋진 프로필을 완성하세요
              </p>
            </div>

            <div className="flex items-center">
              <span className="text-[#00bc7d] text-[20px] font-black italic tracking-[-0.45px] font-['Inter']">
                01{" "}
              </span>
              <span className="text-[#45556c] text-[14px] font-black italic tracking-[-0.15px] font-['Inter'] ml-1">
                / 03
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-[4px] bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-[#00bc7d] rounded-full" />
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />

        {/* Input Card */}
        <div className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[32px] p-8 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col items-center gap-8">
          {/* Avatar Upload */}
          <div className="relative w-[128px] h-[128px]">
            <p className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#62748e] text-[12px] font-bold tracking-[1.2px] uppercase whitespace-nowrap">
              사진 업로드
            </p>
            <div
              className="w-full h-full bg-[rgba(0,0,0,0.5)] border-4 border-[rgba(255,255,255,0.1)] rounded-full flex items-center justify-center cursor-pointer overflow-hidden relative group"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="w-10 h-10 text-[#00bc7d] animate-spin" />
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
                />
              ) : (
                <User className="w-12 h-12 text-[#62748e] group-hover:text-white transition-colors" />
              )}
            </div>
            <button
              className="absolute bottom-0 right-0 w-10 h-10 bg-[#00bc7d] border-4 border-[#121212] rounded-full shadow-[0px_10px_15px_0px_rgba(0,188,125,0.2)] flex items-center justify-center hover:bg-[#00a36c] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-4 h-4 text-black" />
            </button>
          </div>

          {/* Text Inputs */}
          <div className="w-full flex flex-col gap-6">
            {/* Nickname Input */}
            <div className="relative w-full">
              <label className="absolute -top-[10px] left-4 text-[#62748e] text-[10px] font-black tracking-[1.1px] uppercase z-10 bg-[#0c1015] px-1 rounded-sm">
                닉네임
              </label>
              <input
                type="text"
                placeholder="홍길동"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full h-[56px] bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] rounded-[16px] px-4 text-white text-[14px] font-bold placeholder:text-[#314158] focus:outline-none focus:border-[#00bc7d] transition-colors"
              />
            </div>

            {/* Bio Input */}
            <div className="relative w-full">
              <label className="absolute -top-[10px] left-4 text-[#62748e] text-[10px] font-black tracking-[1.1px] uppercase z-10 bg-[#0c1015] px-1 rounded-sm">
                한 줄 소개 (선택)
              </label>
              <input
                type="text"
                placeholder="축구를 사랑하는 팬입니다."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full h-[56px] bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] rounded-[16px] px-4 text-white text-[14px] font-bold placeholder:text-[#314158] focus:outline-none focus:border-[#00bc7d] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-4 mt-8">
          <button
            onClick={handleNextStep}
            disabled={isUploading}
            className="w-full h-[56px] bg-[#00bc7d] rounded-[16px] text-black text-[18px] font-black tracking-[-0.44px] shadow-[0px_20px_25px_0px_rgba(0,188,125,0.2),0px_8px_10px_0px_rgba(0,188,125,0.2)] hover:bg-[#00a36c] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isUploading ? "업로드 중..." : "다음 단계"}
            {!isUploading && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <button className="w-full py-2 text-[#62748e] text-[12px] font-bold tracking-[1.2px] uppercase hover:text-white transition-colors">
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  );
}
