"use client";

import { useForm } from "react-hook-form";
// @ts-ignore
import { zodResolver } from "@hookform/resolvers/zod";
import { createSubject, updateSubject } from "@/lib/actions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas"; 
type Props = {
  type: "create" | "update";
  data?: {
    id: string;
    name: string;
    teachers?: string[];
  };
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  relatedData?: {
    teachers: { id: string; name: string; surname: string }[];
  };
};

export default function SubjectForm({ type, data, setOpen, relatedData }: Props) {
  const [state, setState] = useState({ success: false, error: false });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      id: data?.id ? parseInt(data.id) : undefined,
      name: data?.name || "",
      teachers: data?.teachers || [],
    },
  });

  const teachers = relatedData?.teachers || [];

  useEffect(() => {
    reset({
      id: data?.id ? parseInt(data.id) : undefined,
      name: data?.name || "",
      teachers: data?.teachers || [],
    });
  }, [data, reset]);

  const onSubmit = async (formData: SubjectSchema) => {
    try {
      if (type === "create") {
        await createSubject(state, formData);
      } else {
        await updateSubject(state, formData);
      }

      toast(`Subject has been ${type === "create" ? "created" : "updated"}!`);
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
        {type === "create" ? "Create a New Subject" : "Update Subject"}
      </h1>

      {type === "update" && <input type="hidden" {...register("id")} />}

      <label htmlFor="name" className="text-sm font-medium">
        Subject Name
      </label>
      <input
        type="text"
        id="name"
        className="border border-gray-300 p-2 rounded-md"
        {...register("name")}
      />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message}</p>
      )}

      <label className="text-xs text-gray-500">Teachers</label>
      <select
        multiple
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full h-32"
        {...register("teachers")}
        
      >
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.name + " " + teacher.surname}
          </option>
        ))}
      </select>
      {errors.teachers && (
        <p className="text-xs text-red-400">{errors.teachers.message?.toString()}</p>
      )}

      {state.error && (
        <p className="text-red-500 text-sm">Failed to save subject. Please try again.</p>
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