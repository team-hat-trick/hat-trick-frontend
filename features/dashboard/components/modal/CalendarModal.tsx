"use client";

import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

interface ModalProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onClose: () => void;
}

const CalendarModal = ({ selectedDate, onSelectDate, onClose }: ModalProps) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs(selectedDate));

  const daysInMonth = currentMonth.daysInMonth();
  const startDayOfMonth = currentMonth.startOf("month").day();

  const handlePrevMonth = () =>
    setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const handleDateClick = (day: number) => {
    const newDate = currentMonth.date(day).format("YYYY-MM-DD");
    onSelectDate(newDate);
  };

  const blanks = Array.from({ length: startDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[400px] bg-[#121212] border border-white/10 rounded-3xl p-6 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.5)]">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white w-[100px] text-center">
              {currentMonth.format("YYYY. MM")}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-[#62748e] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 요일 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, idx) => (
            <div
              key={day}
              className={`text-center text-xs font-bold py-2 ${idx === 0 ? "text-[#ff4646]" : idx === 6 ? "text-[#3b82f6]" : "text-[#62748e]"}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((blank) => (
            <div key={`blank-${blank}`} className="h-10"></div>
          ))}

          {days.map((day) => {
            const dateStr = currentMonth.date(day).format("YYYY-MM-DD");
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === dayjs().format("YYYY-MM-DD");

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`h-10 w-full flex items-center justify-center rounded-full text-sm font-semibold transition-all
                  ${isSelected ? "bg-[#00bc7d] text-black shadow-[0_0_15px_rgba(0,188,125,0.4)]" : "text-white hover:bg-white/10"}
                  ${isToday && !isSelected ? "border border-[#00bc7d] text-[#00bc7d]" : ""}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
