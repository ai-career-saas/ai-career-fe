export interface GetProfileResponse {
  name: string;
  email: string;
  locale: string;
  timezone: string;
  notifyEmail: boolean;
  notifyProduct: boolean;
  notifyUsageAlerts: boolean;
}