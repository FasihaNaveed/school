import { auth } from "@clerk/nextjs/server";

/**
 * Get current user ID
 */
export async function currentUserId(): Promise<string | undefined> {
  const { userId } = await auth();
  return userId ?? undefined; // Convert null to undefined to match return type
}

/**
 * Get current user's role
 */
export async function role(): Promise<string | undefined> {
  const { sessionClaims } = await auth();
  const claims = sessionClaims as { metadata?: { role?: string | null } };
  return claims?.metadata?.role ?? undefined; // Convert null to undefined
}

/**
 * Returns the Date object for the start of the current work week (Monday)
 */
const currentWorkWeek = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);

  if (dayOfWeek === 0) {
    // Sunday → shift to Monday
    startOfWeek.setDate(today.getDate() + 1);
  } else if (dayOfWeek === 6) {
    // Saturday → shift to next Monday
    startOfWeek.setDate(today.getDate() + 2);
  } else {
    // Any weekday → move to Monday
    startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
  }

  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

/**
 * Adjust a list of lessons to match the current work week dates
 */
export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const startOfWeek = currentWorkWeek();

  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay();
    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustedStartDate = new Date(startOfWeek);
    adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds()
    );

    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds()
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};
