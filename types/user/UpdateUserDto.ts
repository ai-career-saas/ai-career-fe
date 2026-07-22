export interface UpdateUserDto {
  name: string;
  locale: string;
  timezone: string;
  notifyEmail: boolean;
  notifyProduct: boolean;
  notifyUsageAlerts: boolean;
}