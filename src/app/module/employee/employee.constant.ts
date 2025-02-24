export const WORK_SHIFTS = ['Morning', 'Evening', 'Night'] as const;

export type WorkShiftType = (typeof WORK_SHIFTS)[number];
