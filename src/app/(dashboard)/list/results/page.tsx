import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { currentUserId, role } from "@/lib/utils"; // ✅ Fixed import
import { Prisma } from "@prisma/client";
import Image from "next/image";

type ResultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
};

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const userRole = await role(); // ✅ Renamed variable
  const userId = await currentUserId(); // ✅ Renamed variable

  const { page, ...queryParams } = searchParams;
  const currentPage = page ? parseInt(page) : 1;

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Student", accessor: "student" },
    { header: "Score", accessor: "score", className: "hidden md:table-cell" },
    { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
    { header: "Class", accessor: "class", className: "hidden md:table-cell" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    ...(userRole === "admin" || userRole === "teacher"
      ? [{ header: "Actions", accessor: "action" }]
      : []),
  ];

  const renderRow = (item: ResultList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{`${item.studentName} ${item.studentSurname}`}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">
        {`${item.teacherName} ${item.teacherSurname}`}
      </td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.startTime)}
      </td>
      <td>
        {(userRole === "admin" || userRole === "teacher") && (
          <div className="flex items-center gap-2">
            <FormModal table="result" type="update" data={item} />
            <FormModal table="result" type="delete" id={item.id} />
          </div>
        )}
      </td>
    </tr>
  );

  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    const { studentId, search } = queryParams;

    if (studentId) query.studentId = studentId;

    if (search) {
      query.OR = [
        { exam: { title: { contains: search, mode: "insensitive" } } },
        { student: { name: { contains: search, mode: "insensitive" } } },
      ];
    }
  }

  if (userRole === "teacher") {
    query.OR = [
      { exam: { lesson: { teacherId: userId! } } },
      { assignment: { lesson: { teacherId: userId! } } },
    ];
  } else if (userRole === "student") {
    query.studentId = userId!;
  } else if (userRole === "parent") {
    query.student = { parentId: userId! };
  }

  const [results, total] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (currentPage - 1),
    }),
    prisma.result.count({ where: query }),
  ]);

  const data: ResultList[] = results
    .map((result) => {
      const assessment = result.exam || result.assignment;
      if (!assessment) return null;

      const isExam = "startTime" in assessment;

      return {
        id: result.id,
        title: assessment.title,
        studentName: result.student.name,
        studentSurname: result.student.surname,
        teacherName: assessment.lesson.teacher.name,
        teacherSurname: assessment.lesson.teacher.surname,
        className: assessment.lesson.class.name,
        startTime: isExam ? assessment.startTime : assessment.startDate,
        score: result.score,
      };
    })
    .filter(Boolean) as ResultList[];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200">
              <Image src="/sort.png" alt="sort" width={14} height={14} />
            </button>
            {(userRole === "admin" || userRole === "teacher") && (
              <FormModal table="result" type="create" />
            )}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={currentPage} count={total} />
    </div>
  );
};

export default ResultListPage;
