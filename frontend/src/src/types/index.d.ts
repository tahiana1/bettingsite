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
  views: number;
  noticeType: string;
  description: string;
  domain: Domain;
  status: boolean;
  duration?: (string | Date | dayjs.Dayjs)[];
  showFrom?: string | Date | dayjs.Dayjs;
  showTo?: string | Date | dayjs.Dayjs;
  orderNum?: number;
  level?: number;
  registerDate: string;
  mainImage: string;
  imageUpload: any;
  'main-image'?: string;
  'register-date'?: any;
  user?: {
    userid: string;
  };
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

interface Bulletin {
  key: string;
  id: number;
  title: string;
  description: string;
  views: number;
  category: string;
  nickname: string;
  recommend: number;
  notrecommend: number;
  level: number;
  memberId: number;
  top: boolean;
  alllas: boolean;
  check: boolean;
  domainId: number;
  domain: Domain;
  userId: number;
  user: User;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

interface Comment {
  key: string;
  id: number;
  title: string;
  description: string;
  orderNum: number; // ISO string format
  status: boolean;
  userId: number;
  user: User;
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

interface AdminPermission {
  key: string;
  id: number;
  user: User;
  memebership: boolean;
  game: boolean;
  ip: boolean;
  statistical: boolean;
  financials: boolean;
  dwdelete: boolean;
  settlment: boolean;
  sales: boolean;
  qna: boolean;
}

interface Bank {
  key: string;
  id: number;
  name: string;
  status: boolean;
  orderNum: number;
}

interface SmsApi {
  key: string;
  id: number;
  name: string;
  url: string;
  agent: string;
  token: string;
  passwork: string;
  status: boolean;
  orderNum: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string;
}

interface Transaction {
  id: number;
  userId: number;
  user: User;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  pointBefore: number;
  pointAfter: number;
  explation: string;
  status: string;
  shortcut: string;
  usdtDesc: string;
  transactionAt: Date | string | undefined | null;
  approvedAt: Date | string | undefined | null;
  createdAt: Date | string | undefined | null;
  updatedAt: Date | string | undefined | null;
  deletedAt: ate | string | undefined | null;
}

interface Qna {
  key: string;
  id: number;
  question: string;
  answer: string;
  userId: number;
  user: User;
  domainId: number;
  domain: Domain;
  status: boolean;
  repliedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string;
}
