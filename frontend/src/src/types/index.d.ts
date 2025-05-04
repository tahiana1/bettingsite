interface MenuInfo {
  key: string;
  keyPath: string[];
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

interface Profile {
  key: string;
  id: number;
  nickname: string;
  level: number;
  userId: 8;
  name: string;
  bankName: string;
  holderName: string;
  accountNumber: string;
  birthday: string; // ISO string format, you could also use Date if needed
  phone: string;
  mobile: string;
  balance: number;
  point: number;
  comp: number;
  favorites: string; // Assuming favorites are stored as comma-separated values (CSV)
  referral: string;
  lastDeposit?: string;
  lastWithdraw?: string;
  coupon: number;
  createdAt?: string; // ISO string format
  updatedAt?: string; // ISO string format
}

interface User {
  key: string;
  id: number;
  name: string;
  userid: string;
  role: string; // Could be a more specific type like 'USER' | 'ADMIN' if roles are limited
  usdtAddress: string;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  profile: Profile;
  status: boolean;
}


