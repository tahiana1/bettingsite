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
  role: string; // Could be a more specific type like 'U' | 'A' if roles are limited
  type: string;
  usdtAddress: string;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  profile: Profile;
  status: string;
  root: User;
  parent: User;
  parentId: number;
  rootId: number;
}

interface Noti {
  key: string;
  id: number;
  title: string;
  description: string;
  showFrom: string | Date | dayjs.Dayjs;
  showTo: string | Date | dayjs.Dayjs; // ISO string format
  duration?: (string | Date | dayjs.Dayjs)[];
  orderNum: number; // ISO string format
  status: boolean;
}

interface Domain {
  key: string;
  id: number;
  name: string;
  userId: number;
  user: User;
  description: string;
  showFrom: string | Date | dayjs.Dayjs;
  showTo: string | Date | dayjs.Dayjs; // ISO string format
  orderNum: number; // ISO string format
  status: boolean;
}

interface Event {
  key: string;
  id: number;
  title: string;
  description: string;
  showFrom: string | Date | dayjs.Dayjs;
  showTo: string | Date | dayjs.Dayjs; // ISO string format
  duration?: (string | Date | dayjs.Dayjs)[];
  orderNum: number; // ISO string format
  status: boolean;
  level: number;
  userId: number;
  domainId: number;
  user: User;
  domain: Domain;
}

interface Announcement {
  key: string;
  id: number;
  title: string;
  description: string;
  showFrom: string | Date | dayjs.Dayjs;
  showTo: string | Date | dayjs.Dayjs; // ISO string format
  duration?: (string | Date | dayjs.Dayjs)[];
  orderNum: number; // ISO string format
  status: boolean;
  userId: number;
  user: User;
}

interface Inbox {
  key: string;
  id: number;
  type: string;
  title: string;
  description: string;
  openedAt: string | Date | dayjs.Dayjs;
  createdAt: string | Date | dayjs.Dayjs;
  updatedAt: string | Date | dayjs.Dayjs;
  orderNum: number; // ISO string format
  status: boolean;
  userId: number;
  user: User;
  fromId: number;
  from: User;
}

interface Menu {
  key: string;
  id: number;
  icon: string;
  path: string;
  label: string;
  description: string;
  orderNum: number; // ISO string format
  status: boolean;
  parentId: number;
  children: Menu[];
}

interface Log {
  key: string;
  id: number;
  userid: string;
  data: string;
  path: string;
  ip: string;
  user?: User;
  method: string;
  os: string;
  device: string;
  host: string;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  profile?: Profile;
  status: string;
}
