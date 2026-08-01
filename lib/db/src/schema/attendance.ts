import { pgTable, text, serial, timestamp, date, integer, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { studentsTable } from "./students";

export const attendanceTable = pgTable(
  "attendance",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .notNull()
      .references(() => studentsTable.id, { onDelete: "cascade" }),
    date: date("date", { mode: "string" }).notNull(),
    status: text("status").notNull(), // present | absent
    batch: text("batch").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("attendance_student_date_unique").on(t.studentId, t.date)]
);

export const insertAttendanceSchema = createInsertSchema(attendanceTable).omit({
  id: true,
  createdAt: true,
});
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendanceTable.$inferSelect;
