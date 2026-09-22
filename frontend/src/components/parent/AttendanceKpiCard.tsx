"use client";

import React from "react";
import { CalendarCheck } from "lucide-react";
import PremiumKpiCard from "./PremiumKpiCard";

interface AttendanceKpiCardProps {
  percentage?: number;
  trend?: string;
  period?: string;
  className?: string;
  href?: string;
}

export default function AttendanceKpiCard({
  percentage = 92,
  trend = "↑ 2%",
  period = "This Month",
  className = "",
  href = "/parent/attendance",
}: AttendanceKpiCardProps) {
  return (
    <PremiumKpiCard
      title="Attendance"
      value={`${percentage}%`}
      trend={trend}
      period={period}
      icon={CalendarCheck}
      colorVariant="blue"
      progressPercent={percentage}
      className={className}
      href={href}
    />
  );
}
