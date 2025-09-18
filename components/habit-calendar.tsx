"use client";

import { useMemo } from "react";

interface HabitCalendarProps {
  habitHistory: Record<string, boolean>; // date string -> completed
  className?: string;
}

export function HabitCalendar({
  habitHistory,
  className = "",
}: HabitCalendarProps) {
  const calendarData = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364); // Show last 365 days

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= today) {
      const dateString = currentDate.toISOString().split("T")[0];
      const completed = habitHistory[dateString] || false;

      days.push({
        date: new Date(currentDate),
        dateString,
        completed,
        isToday: dateString === today.toISOString().split("T")[0],
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [habitHistory]);

  const getIntensity = (completed: boolean) => {
    if (!completed) return "bg-muted";
    return "bg-green-500";
  };

  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const weekdays = ["D", "L", "M", "M", "J", "V", "S"];

  return (
    <div className={`p-4 bg-card rounded-xl ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Actividad del Año</h3>

      <div className="space-y-2">
        {/* Month labels */}
        <div className="flex text-xs text-muted-foreground ml-8">
          {months.map((month, index) => (
            <div key={month} className="flex-1 text-center">
              {index % 3 === 0 ? month : ""}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex gap-1">
          {/* Weekday labels */}
          <div className="flex flex-col gap-1 text-xs text-muted-foreground mr-1">
            {weekdays.map((day, index) => (
              <div
                key={`weekday-${index}`}
                className="w-3 h-3 flex items-center justify-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-53 gap-1">
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-sm ${getIntensity(day.completed)} ${
                  day.isToday ? "ring-2 ring-primary ring-offset-1" : ""
                }`}
                title={`${day.dateString}: ${
                  day.completed ? "Completado" : "No completado"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
          <span>Menos</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-green-200" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <div className="w-3 h-3 rounded-sm bg-green-600" />
          </div>
          <span>Más</span>
        </div>
      </div>
    </div>
  );
}
