export type Weekday =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type OpportunityStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "absent";

export type StudyRisk = "on_track" | "at_risk" | "critical";

export type WeeklyRoutineEntry = {
  weekday: Weekday;
  subject: string;
  startTime?: string;
  endTime?: string;
  enabled?: boolean;
};

export type RoutineOccurrence = {
  date: string;
  weekday: Weekday;
  subject: string;
  status: OpportunityStatus;
};

export type SubjectOpportunitySummary = {
  subject: string;
  scheduled: number;
  completed: number;
  cancelled: number;
  absent: number;
  remaining: number;
};

export type ResultHistoryPoint = {
  examName: string;
  date: string;
  subject: string;
  percentage: number;
};

export type SubjectPerformance = {
  subject: string;
  latest?: number;
  previous?: number;
  average?: number;
  change?: number;
  trend: "improving" | "declining" | "stable" | "insufficient_data";
};

export type StudyTrajectory = {
  risk: StudyRisk;
  remainingWork: number;
  remainingOpportunities: number;
  coverageRatio: number;
  message: string;
};

const WEEKDAY_INDEX: Record<Weekday, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function weekdayForDate(date: Date): Weekday {
  const index = date.getDay();

  return (
    Object.keys(WEEKDAY_INDEX).find(
      (key) => WEEKDAY_INDEX[key as Weekday] === index,
    ) as Weekday
  );
}

export function countCalendarDays(
  startDate: string,
  endDate: string,
): number {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (end < start) return 0;

  return Math.floor(
    (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
  ) + 1;
}

/**
 * Expands a weekly routine into actual calendar opportunities.
 *
 * This is intentionally date-based rather than "days remaining".
 * Friday/off-days therefore contribute zero teaching opportunities.
 */
export function buildRoutineOccurrences(
  startDate: string,
  endDate: string,
  routine: WeeklyRoutineEntry[],
  overrides: Record<
    string,
    OpportunityStatus | undefined
  > = {},
): RoutineOccurrence[] {
  const occurrences: RoutineOccurrence[] = [];

  const current = parseDate(startDate);
  const end = parseDate(endDate);

  while (current <= end) {
    const date = toLocalDateKey(current);
    const weekday = weekdayForDate(current);

    for (const entry of routine) {
      if (entry.enabled === false) continue;
      if (entry.weekday !== weekday) continue;

      occurrences.push({
        date,
        weekday,
        subject: entry.subject,
        status: overrides[`${date}:${entry.subject}`] ?? "scheduled",
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return occurrences;
}

export function summarizeOpportunities(
  occurrences: RoutineOccurrence[],
): SubjectOpportunitySummary[] {
  const bySubject = new Map<string, SubjectOpportunitySummary>();

  for (const occurrence of occurrences) {
    const subject = occurrence.subject.trim();
    if (!subject) continue;

    const current = bySubject.get(subject) ?? {
      subject,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
      absent: 0,
      remaining: 0,
    };

    if (occurrence.status === "scheduled") {
      current.scheduled += 1;
      current.remaining += 1;
    }

    if (occurrence.status === "completed") {
      current.completed += 1;
    }

    if (occurrence.status === "cancelled") {
      current.cancelled += 1;
    }

    if (occurrence.status === "absent") {
      current.absent += 1;
    }

    bySubject.set(subject, current);
  }

  return [...bySubject.values()].map((item) => ({
    ...item,
    remaining: Math.max(
      0,
      item.scheduled,
    ),
  }));
}

/**
 * Work is represented as weighted units, not "number of chapters".
 * This avoids pretending every topic requires equal teaching effort.
 */
export function calculateTrajectory(
  remainingWork: number,
  remainingOpportunities: number,
): StudyTrajectory {
  if (remainingWork <= 0) {
    return {
      risk: "on_track",
      remainingWork: 0,
      remainingOpportunities,
      coverageRatio: Infinity,
      message: "No known academic workload remains.",
    };
  }

  if (remainingOpportunities <= 0) {
    return {
      risk: "critical",
      remainingWork,
      remainingOpportunities: 0,
      coverageRatio: 0,
      message:
        "No scheduled teaching opportunities remain for the current workload.",
    };
  }

  const coverageRatio = remainingOpportunities / remainingWork;

  if (coverageRatio >= 1.25) {
    return {
      risk: "on_track",
      remainingWork,
      remainingOpportunities,
      coverageRatio,
      message:
        "Current scheduled opportunities are sufficient for the known workload.",
    };
  }

  if (coverageRatio >= 0.85) {
    return {
      risk: "at_risk",
      remainingWork,
      remainingOpportunities,
      coverageRatio,
      message:
        "Coverage is possible but there is little room for missed or inefficient sessions.",
    };
  }

  return {
    risk: "critical",
    remainingWork,
    remainingOpportunities,
    coverageRatio,
    message:
      "The current routine does not provide enough opportunities to comfortably cover the remaining workload.",
  };
}

export function analyzeSubjectPerformance(
  history: ResultHistoryPoint[],
): SubjectPerformance[] {
  const grouped = new Map<string, ResultHistoryPoint[]>();

  for (const item of history) {
    const subject = item.subject.trim();
    if (!subject) continue;

    const current = grouped.get(subject) ?? [];
    current.push(item);
    grouped.set(subject, current);
  }

  return [...grouped.entries()].map(([subject, items]) => {
    const sorted = [...items].sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    const latest = sorted.at(-1)?.percentage;
    const previous = sorted.at(-2)?.percentage;

    const average =
      sorted.length > 0
        ? Math.round(
            sorted.reduce((sum, item) => sum + item.percentage, 0) /
              sorted.length,
          )
        : undefined;

    const change =
      latest != null && previous != null
        ? latest - previous
        : undefined;

    let trend: SubjectPerformance["trend"] = "insufficient_data";

    if (change != null) {
      if (change >= 5) trend = "improving";
      else if (change <= -5) trend = "declining";
      else trend = "stable";
    }

    return {
      subject,
      latest,
      previous,
      average,
      change,
      trend,
    };
  });
}

/**
 * Produces a simple evidence-based risk signal.
 *
 * This intentionally does NOT prescribe minutes or force a lesson plan.
 * It tells the teacher where the academic pressure actually exists.
 */
export function buildAcademicRisk(input: {
  historicalPercentage?: number;
  recentPercentage?: number;
  remainingWork: number;
  remainingOpportunities: number;
}): {
  risk: StudyRisk;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  if (
    input.recentPercentage != null &&
    input.recentPercentage < 50
  ) {
    score += 2;
    reasons.push("Recent performance is below 50%.");
  } else if (
    input.recentPercentage != null &&
    input.recentPercentage < 65
  ) {
    score += 1;
    reasons.push("Recent performance is below 65%.");
  }

  if (
    input.historicalPercentage != null &&
    input.recentPercentage != null
  ) {
    const change =
      input.recentPercentage - input.historicalPercentage;

    if (change <= -10) {
      score += 2;
      reasons.push("Recent performance has declined materially from the historical baseline.");
    } else if (change <= -5) {
      score += 1;
      reasons.push("Recent performance is below the historical baseline.");
    }
  }

  const trajectory = calculateTrajectory(
    input.remainingWork,
    input.remainingOpportunities,
  );

  if (trajectory.risk === "critical") {
    score += 2;
    reasons.push("Scheduled teaching opportunities are insufficient for the remaining workload.");
  } else if (trajectory.risk === "at_risk") {
    score += 1;
    reasons.push("There is limited schedule capacity for the remaining workload.");
  }

  const risk: StudyRisk =
    score >= 4
      ? "critical"
      : score >= 2
        ? "at_risk"
        : "on_track";

  if (!reasons.length) {
    reasons.push("No strong risk signal was detected from the available evidence.");
  }

  return { risk, reasons };
}
