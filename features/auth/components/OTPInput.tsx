"use client";

import { useEffect, useRef, useState } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export function OTPInput({ value, onChange, length = 6 }: OTPInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // 박스를 클릭하면 실제 input에 포커스
  const handleClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full" onClick={handleClick}>
      {/* 1. 실제 값을 입력받는 숨겨진 Input */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={length}
        value={value}
        onChange={(e) => {
          const val = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
          onChange(val);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute inset-0 opacity-0 cursor-default"
      />

      {/* 2. 시각적으로 보여지는 6개의 슬롯 */}
      <div className="flex justify-between gap-2">
        {Array.from({ length }).map((_, idx) => {
          const char = value[idx] || "";
          const isActive = isFocused && value.length === idx;
          const isFilled = value.length > idx;

          return (
            <div
              key={idx}
              className={`
                flex-1 h-[72px] rounded-[16px] border-[2px] 
                flex items-center justify-center 
                text-[28px] font-black transition-all duration-200
                ${
                  isActive
                    ? "border-[#00bc7d] bg-[rgba(0,188,125,0.1)] shadow-[0_0_15px_rgba(0,188,125,0.3)]"
                    : isFilled
                      ? "border-[#00bc7d] text-white bg-[rgba(0,0,0,0.4)]"
                      : "border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.4)] text-[#314158]"
                }
              `}
            >
              {char}
              {/* 커서 애니메이션 (현재 입력 위치일 때만 노출) */}
              {isActive && (
                <div className="w-[2px] h-6 bg-[#00bc7d] animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
