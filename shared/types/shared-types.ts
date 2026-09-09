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
