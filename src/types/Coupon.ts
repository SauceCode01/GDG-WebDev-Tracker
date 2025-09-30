
export type Coupon = {
  code?: string;
  multiuse: boolean;
  points: Record<string, number>
  voided?: boolean;
  expirationDate?: number; // unix timestamp
  createdAt?: number; // unix timestamp
  claimedBy?: string[]; // array of uid of users who claimed the coupon
  claimedAt?: number; // unix timestamp
};
