import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const ParentPage = () => {
  // Example calendar data (you can replace this with dynamic data later)
  const calendarData = [
    {
      title: "Math Class",
      start: new Date(2025, 6, 31, 10, 0), // July is month 6 (0-indexed)
      end: new Date(2025, 6, 31, 11, 0),
    },
    {
      title: "Science Fair",
      start: new Date(2025, 7, 1, 12, 0),
      end: new Date(2025, 7, 1, 14, 0),
    },
  ];

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        {/* LEFT */}
        <div className="flex-1 w-full lg:w-2/3 bg-white p-4 rounded-md h-[770px]">
          <h1 className="text-xl font-semibold mb-4">Schedule (Fasiha)</h1>
          <BigCalendar data={calendarData} />
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default ParentPage;
