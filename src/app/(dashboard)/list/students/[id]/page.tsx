
import Image from "next/image";
import Link from "next/link";
//import Performance from "@/components/Perfomance";
//import Anouncements from "@/components/Anouncements";
import { auth } from "@clerk/nextjs/server";
import { Class, Student } from "@prisma/client";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
// BigCalendarContainer from "@/components/BigCalendarContainer";
import dynamic from "next/dynamic";
import FormContainer from "@/components/FormContainer";

const Performance = dynamic(() => import("@/components/Performance"), { ssr: false });
const Announcements = dynamic(() => import("@/components/Announcements"), { ssr: false });
const BigCalendarContainer = dynamic(() => import("@/components/BigCalendarContainer"), { ssr: false });

const SingleStudentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const student: 
  (Student & { class: (Class& {_count:{lessons:number}} )
  }) | null =
    await prisma.student.findUnique({
      where: { id },
      include: {
        class: { include: { _count: { select:{lessons: true }} } },
      },
    });

  if (!student) {
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
                src={student.img || "/noAvatar.png"}
                alt="Student"
                width={100}
                height={100}
                className="w-28 h-28 rounded-full object-cover"
              />
            </div>

            {/* Info Text */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-4">
              <h1 className="text-md font-semibold">
                {student.name + " " + student.surname}
              </h1>
                {role==="admin" && (
                <FormContainer
                  table="student"
                  type="update"
                 data={student}
                />
                )}
                </div>
              <p className="text-xs text-gray-500 mt-2 mb-3">
                Dedicated learner striving for academic excellence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Image src="/blood.png" alt="blood" width={14} height={14} />
                  <span>{student.bloodType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Image src="/date.png" alt="date" width={14} height={14} />
                  <span>
                    {new Intl.DateTimeFormat("en-GB").format(student.birthday)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Image src="/phone.png" alt="phone" width={14} height={14} />
                  <span>{student.phone || "-"}</span>
                </div>
                <div className="flex items-center gap-1 break-all">
                  <Image src="/mail.png" alt="mail" width={14} height={14} />
                  <span>{student.email || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 gap-2 xl:w-1/2">
            {/* Attendance */}
            <div className="bg-white p-4 rounded-md flex gap-4 items-center">
              <Image
                src="/singleAttendance.png"
                alt="att"
                width={24}
                height={24}
              />
              <Suspense fallback="loading..">
                <StudentAttendanceCard id={student.id}/>
              </Suspense>
    
            </div>

            {/* Grade */}
            <div className="bg-white p-4 rounded-md flex gap-4 items-center">
              <Image
                src="/singleBranch.png"
                alt="branch"
                width={24}
                height={24}
              />
              <div>
                <h1 className="text-lg font-semibold">
                  {student.class.name.charAt(0)}th
                </h1>
                <p className="text-sm text-gray-400">Grade</p>
              </div>
            </div>

            {/* Lessons */}
            <div className="bg-white p-4 rounded-md flex gap-4 items-center">
              <Image
                src="/singleLesson.png"
                alt="lesson"
                width={24}
                height={24}
              />
              <div>
                <h1 className="text-lg font-semibold">{student.class._count.lessons}</h1>
                <p className="text-sm text-gray-400">Lessons</p>
              </div>
            </div>

            {/* Class */}
            <div className="bg-white p-4 rounded-md flex gap-4 items-center">
              <Image
                src="/singleClass.png"
                alt="class"
                width={24}
                height={24}
              />
              <div>
                <h1 className="text-lg font-semibold">{student.class.name}</h1>
                <p className="text-sm text-gray-400">Class</p>
              </div>
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="mt-2 bg-white rounded-md p-2 h-[750px]">
          <h1 className="font-semibold text-xl mb-3">Student's Schedule</h1>
          <BigCalendarContainer type="classId" id={student.class.id} />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full xl:w-1/3 flex flex-col gap-5">
        {/* SHORTCUTS */}
        <div className="bg-white p-5 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-purple-100"
              href={`/list/lessons?classId=${2}`}
            >
              Students Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-100"
              href={`/list/teachers?classId=${2}`}
            >
              Students Teachers
            </Link>
            <Link
              className="p-3 rounded-md bg-yellow-100"
              href={`/list/exams?classId=${2}`}
            >
              Students Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-blue-100"
              href={`/list/assignments?classId=${2}`}
            >
              Students Assignments
            </Link>
            <Link
              className="p-3 rounded-md bg-purple-100"
              href={`/list/results?studentId=${"student2"}`}
            >
              Students Results
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

export default SingleStudentPage;