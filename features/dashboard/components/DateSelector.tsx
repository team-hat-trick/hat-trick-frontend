"use client";

import React, { useMemo, useState } from "react";
import { MOCK_DATES } from "../constants/mockData";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

interface Props {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export function DateSelector({ selectedDate, setSelectedDate }: Props) {
  const dateRange = useMemo(() => {
    const dates = [];

    for (let i = -7; i <= 7; i++) {
      const date = dayjs().add(i, "day");
      dates.push({
        fullDate: date.format("YYYY-MM-DD"),
        dayName: date.format("ddd"),
        dateNum: date.format("D"),
        isToday: date.isSame(dayjs(), "day"),
      });
    }
    return dates;
  }, []);

  return (
    <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl p-2.5 flex items-center gap-1 overflow-x-auto custom-scrollbar">
      {dateRange.map((dateObj, idx) => {
        const isSelected = selectedDate === dateObj.fullDate;

        return (
          <button
            key={idx}
            className={`min-w-[70px] relative rounded-[14px] shrink-0 flex flex-col items-center justify-center py-3 transition-colors ${
              isSelected ? "bg-[#00bc7d]" : "hover:bg-white/5"
            }`}
            onClick={() => setSelectedDate(dateObj.fullDate)}
          >
            {dateObj.isToday && !isSelected && (
              <div className="absolute top-2 w-1 h-1 bg-[#00bc7d] rounded-full" />
            )}

            <div
              className={`opacity-70 font-black text-[10px] tracking-[0.5px] uppercase mb-1 z-10 ${
                isSelected ? "text-black" : "text-[#62748e]"
              }`}
            >
              {dateObj.dayName}
            </div>

            <div
              className={`font-bold text-[18px] leading-[28px] z-10 ${
                isSelected ? "text-black" : "text-[#62748e]"
              }`}
            >
              {dateObj.dateNum}
            </div>

            {isSelected && (
              <div className="absolute inset-0 rounded-[14px] shadow-[0_10px_15px_-3px_rgba(0,188,125,0.3)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
