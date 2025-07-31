

import Announcements from "@/components/Announcements";
import BigCalender from "@/components/BigCalendar";
import Image from "next/image";
import Link from "next/link";
import Performance from "@/components/Performance";
import prisma from "@/lib/prisma";
import { Teacher } from "@prisma/client";
import { notFound } from "next/navigation";
import FormContainer from "@/components/FormContainer";
import { auth } from "@clerk/nextjs/server";
import BigCalendarContainer from "@/components/BigCalendarContainer";

const SingleTeacherPage =async ({params:{id}}:{params:{id:string}}) => {

    const { sessionClaims } =await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const teacher:Teacher&{_count:{subjects:number;lessons:number;classes:number}} | null= await prisma.teacher.findUnique({
where:{id},
include:{
  _count:{
    select:{
      subjects:true,
      lessons:true,
      classes:true,
    }
  }
}
  })

  if(!teacher){
    return notFound();
  }
  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-3">
      {/* LEFT SECTION */}
      <div className="w-full xl:w-2/3 flex flex-col gap-1">
        {/* TOP PROFILE + CARDS SECTION */}
        <div className="w-full flex flex-col xl:flex-row bg-gray-50 p-2 rounded-md gap-4">
          {/* PROFILE + INFO */}
          <div className="flex flex-col sm:flex-row items-center gap-3 xl:w-1/2 bg-purple-200 p-2 rounded-md">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <Image
                src={teacher.img || "/noAvatar.png"}
                alt="Teacher"
                width={100}
                height={100}
                className="w-28 h-28 rounded-full object-cover"
              />
            </div>

            {/* Info Text */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-4">
                <h1 className="text-md font-semibold">{teacher.name+" " +teacher.surname}</h1>
                {role==="admin" && (
                <FormContainer
                  table="teacher"
                  type="update"
                 data={teacher}
                />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2 mb-3">
                A passionate female educator committed to inspiring young minds.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Image src="/blood.png" alt="blood" width={14} height={14} />
                  <span>{teacher.bloodType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Image src="/date.png" alt="date" width={14} height={14} />
                  <span>{new Intl.DateTimeFormat("en-GB").format(teacher.birthday)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Image src="/phone.png" alt="phone" width={14} height={14} />
                  <span>{teacher.phone || "-"}</span>
                </div>
                <div className="flex items-center gap-1 break-all">
                  <Image src="/mail.png" alt="mail" width={14} height={14} />
                  <span>{teacher.email || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 gap-2 xl:w-1/2">
            <div className="bg-white p-4 rounded-md flex gap-4 items-center">
              <Image src="/singleAttendance.png" alt="att" width={24} height={24} />
              <div>
                <h1 className="text-lg font-semibold">90%</h1>
                <p className="text-sm text-gray-400">Attendance</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md flex gap-4 items-center">
              <Image src="/singleBranch.png" alt="branch" width={24} height={24} />
              <div>
                <h1 className="text-lg font-semibold">{teacher._count.subjects}</h1>
                <p className="text-sm text-gray-400">Branches</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md flex gap-4 items-center">
              <Image src="/singleLesson.png" alt="lesson" width={24} height={24} />
              <div>
                <h1 className="text-lg font-semibold">{teacher._count.lessons}</h1>
                <p className="text-sm text-gray-400">Lessons</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md flex gap-4 items-center">
              <Image src="/singleClass.png" alt="class" width={24} height={24} />
              <div>
                <h1 className="text-lg font-semibold">{teacher._count.classes}</h1>
                <p className="text-sm text-gray-400">Classes</p>
              </div>
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="mt-2 bg-white rounded-md p-2 h-[750px]">
          <h1 className="font-semibold text-xl mb-3">Teacher's Schedule</h1>
         <BigCalendarContainer type="teacherId" id={teacher.id} />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full xl:w-1/3 flex flex-col gap-5">
        {/* SHORTCUTS */}
        <div className="bg-white p-5 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-purple-100" href={`/list/classes/supervisorId=${"teacher2"}`}>
              Teachers Classes
            </Link>
            <Link className="p-3 rounded-md bg-pink-100" href={`/list/students?teacherId=teacher2`}>
              Teachers Students
            </Link>
            <Link className="p-3 rounded-md bg-yellow-100" href={`/list/lessons/?teacherId=${"teacher2"}`}>
              Teachers Lessons
            </Link>
            <Link className="p-3 rounded-md bg-blue-100" href={`/list/exams/?teacherId=${"teacher2"}`}>
              Teachers Exams
            </Link>
            <Link className="p-3 rounded-md bg-purple-100" href={`/list/asignments/?teacherId=${"teacher2"}`}>
              Teachers Assignments
            </Link>
          </div>
        </div>

        {/* PERFORMANCE + ANNOUNCEMENTS */}
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;