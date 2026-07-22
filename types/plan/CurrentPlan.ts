export interface PublicPlan {
  status: string;
  plan_name: string;
  price_thb: number;
  quota: Record<string, number>;
  features: string[];
  description: string;
}

export interface CurrentPlan extends PublicPlan {
  subscriptionStatus: string | null;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
}
