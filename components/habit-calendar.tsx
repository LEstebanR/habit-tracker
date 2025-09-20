"use client";

import { useMemo } from "react";

interface HabitCalendarProps {
  habitHistory: Record<string, number>; // date string -> completion percentage (0-1)
  className?: string;
}

export function HabitCalendar({
  habitHistory,
  className = "",
}: HabitCalendarProps) {
  const calendarData = useMemo(() => {
    const today = new Date();
    const todayDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

    // Calculate how many weeks we need to show today in the last row on the right
    // We want to show about 20 weeks total for 5 months
    const totalWeeks = 20;
    const totalDays = totalWeeks * 7;

    // Calculate start date: go back from today to fill the grid
    // Position today in the last row, rightmost position
    const daysFromStart = totalDays - (7 - todayDayOfWeek);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysFromStart);

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < totalDays; i++) {
      const dateString = currentDate.toISOString().split("T")[0];
      const completionPercentage = habitHistory[dateString] || 0;

      // Consider "in range" as the last 140 days from today (5 months)
      const daysDiff = Math.floor(
        (today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const isInRange = daysDiff >= 0 && daysDiff <= 140;

      days.push({
        date: new Date(currentDate),
        dateString,
        completionPercentage: isInRange ? completionPercentage : 0,
        isToday: dateString === today.toISOString().split("T")[0],
        isInRange,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [habitHistory]);

  const getIntensity = (completionPercentage: number, isInRange: boolean) => {
    if (!isInRange) return "bg-gray-100"; // Out of range days
    if (completionPercentage === 0) return "bg-muted";
    if (completionPercentage <= 0.25) return "bg-green-200";
    if (completionPercentage <= 0.5) return "bg-green-300";
    if (completionPercentage <= 0.75) return "bg-green-400";
    return "bg-green-500";
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get month labels based on the calendar data
  const getMonthLabels = () => {
    if (calendarData.length === 0) return [];

    // Create labels for roughly 4 months worth of space (16 weeks)
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(today.getMonth() - 2);

    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    return [
      months[threeMonthsAgo.getMonth()],
      months[twoMonthsAgo.getMonth()],
      months[oneMonthAgo.getMonth()],
      months[today.getMonth()],
    ];
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className={`p-4 bg-card rounded-xl ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

      <div className="space-y-2">
        {/* Month labels */}
        <div className="flex text-xs text-muted-foreground">
          <div className="w-9 flex-shrink-0"></div>{" "}
          {/* Space for weekday labels */}
          <div className="flex flex-1">
            {getMonthLabels().map((monthName, index) => (
              <div key={`month-${index}`} className="flex-1 text-center">
                {monthName}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="flex gap-3">
          {/* Weekday labels */}
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            {weekdays.map((day, index) => (
              <div
                key={`weekday-${index}`}
                className="w-6 h-3 flex items-center justify-start"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div
            className="grid grid-rows-7 gap-1 flex-1"
            style={{
              gridTemplateColumns: `repeat(${Math.ceil(
                calendarData.length / 7
              )}, 1fr)`,
            }}
          >
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-sm border border-gray-300 ${getIntensity(
                  day.completionPercentage,
                  day.isInRange
                )} ${day.isToday ? "ring-2 ring-primary ring-offset-1" : ""}`}
                title={`${day.dateString}: ${
                  !day.isInRange
                    ? "Outside range"
                    : day.completionPercentage === 0
                    ? "Not completed"
                    : `${Math.round(day.completionPercentage * 100)}% completed`
                }`}
                style={{
                  gridColumn: Math.floor(index / 7) + 1,
                  gridRow: (index % 7) + 1,
                }}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-green-200" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <div className="w-3 h-3 rounded-sm bg-green-600" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
