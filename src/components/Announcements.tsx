const Announcements = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-lamaSkyLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">New Library Books Arrived</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-08-15
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
           Students can now borrow the latest books.
          </p>
        </div>
        <div className="bg-lamaPurpleLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Mid-Term Exam Schedule</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-10-15
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Exam dates are now available online.
          </p>
        </div>
        <div className="bg-lamaYellowLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Winter Uniform Reminder</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-11-01
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
           Wear winter uniform from next Monday.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;