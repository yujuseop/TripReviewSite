"use client";

import { useState } from "react";

interface Event {
  id: string;
  title: string;
  date: string;
}

interface CalendarProps {
  events: Event[];
}

export default function Calendar({ events }: CalendarProps) {
  const [currentEvents, setCurrentEvents] = useState<Event[]>(events);

  const addEvent = () => {
    const newEvent = {
      id: String(Date.now()),
      title: "새 여행지",
      date: new Date().toISOString().split("T")[0],
    };
    setCurrentEvents([...currentEvents, newEvent]);
    //TODO:API 호풀해서 서버에도 저장
  };

  return (
    <div>
      <button
        onClick={addEvent}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        일정 추가
      </button>
      <ul className="space-y-2">
        {currentEvents.map((event) => (
          <li
            key={event.id}
            className="border p-2 rounded shadow-sm bg-gray-50"
          >
            <strong>{event.title}</strong> - {event.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
