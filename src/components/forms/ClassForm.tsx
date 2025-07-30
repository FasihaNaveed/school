"use client";

import { useForm } from "react-hook-form";
// @ts-ignore
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createClass, updateClass } from "@/lib/actions";
import { classSchema, ClassSchema } from "@/lib/formValidationSchemas";

type Props = {
  type: "create" | "update";
  data?: {
    id: string;
    name: string;
    capacity: number;
    gradeId: number;
    supervisorId: string;
  };
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  relatedData?: {
    teachers: { id: string; name: string; surname: string }[];
    grades: { id: number; level: string }[];
  };
};

export default function ClassForm({ type, data, setOpen, relatedData }: Props) {
  const [state, setState] = useState({ success: false, error: false });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      id: data?.id ? parseInt(data.id) : undefined,
      name: data?.name || "",
      capacity: data?.capacity || 0,
      gradeId: data?.gradeId || 0,
      supervisorId: data?.supervisorId || "",
    },
  });

  const teachers = relatedData?.teachers ?? [];
  const grades = relatedData?.grades ?? [];

  useEffect(() => {
    if (type === "update" && data) {
      reset({
        id: data?.id ? parseInt(data.id) : undefined,
        name: data.name || "",
        capacity: data.capacity || 0,
        gradeId: data.gradeId || 0,
        supervisorId: data.supervisorId || "",
      });
    }
  }, [type, data, reset]);

  const onSubmit = async (formData: ClassSchema) => {
    try {
      if (type === "create") {
        await createClass(state, formData);
      } else {
        await updateClass(state, formData);
      }

      toast(`Class has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      setState({ ...state, error: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">
        {type === "create" ? "Create a New Class" : "Update Class"}
      </h1>

      {type === "update" && <input type="hidden" {...register("id")} />}

      <label htmlFor="name" className="text-sm font-medium">
        Class Name
      </label>
      <input
        id="name"
        type="text"
        {...register("name")}
        className="border border-gray-300 p-2 rounded-md"
      />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message}</p>
      )}

      <label htmlFor="capacity" className="text-sm font-medium">
        Capacity
      </label>
      <input
        id="capacity"
        type="number"
        {...register("capacity", { valueAsNumber: true })}
        className="border border-gray-300 p-2 rounded-md"
      />
      {errors.capacity && (
        <p className="text-red-500 text-sm">{errors.capacity.message}</p>
      )}

      <label htmlFor="supervisorId" className="text-sm font-medium">
        Supervisor
      </label>
      <select
        id="supervisorId"
        {...register("supervisorId")}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
      >
        <option value="">Select a Supervisor</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.name} {teacher.surname}
          </option>
        ))}
      </select>
      {errors.supervisorId && (
        <p className="text-red-500 text-sm">{errors.supervisorId.message}</p>
      )}

      <label htmlFor="gradeId" className="text-sm font-medium">
        Grade
      </label>
      <select
        id="gradeId"
        {...register("gradeId", { valueAsNumber: true })}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
      >
        <option value="">Select Grade</option>
        {grades.map((grade) => (
          <option key={grade.id} value={grade.id}>
            {grade.level}
          </option>
        ))}
      </select>
      {errors.gradeId && (
        <p className="text-red-500 text-sm">{errors.gradeId.message}</p>
      )}

      {state.error && (
        <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}