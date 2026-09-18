export type ToastNotificationColor =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "neutral";

export interface ToastNotificationConfig {
  title: string;
  description: string;
  color?: ToastNotificationColor;
}

export type ExtendedTimelineFilters =
  | FilterTimelines
  | "last_six_months"
  | "last_one_year";
