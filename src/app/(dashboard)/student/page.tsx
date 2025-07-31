
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import "react-big-calendar/lib/css/react-big-calendar.css";

const StudentPage =async () => {

  const {userId} = await auth();

  
  if (!userId) return <div>Unauthorized</div>;

  const classItem =await prisma.class.findMany({
    where:{
      students:{some:{id:userId}},
    }
  })
  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        
        {/* LEFT */}
        <div className="w-full lg:w-2/3 bg-white p-5 rounded-md h-[850px]">
          <h1 className="text-xl font-semibold mb-4 mt-3">Schedule (4A)</h1>
          <div className="mt-10 " ><BigCalendarContainer type="classId" id={classItem[0].id}/></div>
          
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/3 flex flex-col gap-2">
        <div className=""> <EventCalendar /></div>
         
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default StudentPage;