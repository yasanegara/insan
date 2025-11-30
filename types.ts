
export enum RoleType {
  NEWBIE = "Newbie",
  CANDIDATE = "Candidate",
  MEMBER = "Member",
  STAR_MEMBER = "Star Member",
  MUSYRIF_MUDA = "Musyrif Muda",
  MUSYRIF = "Musyrif",
  ADMIN = "Admin"
}

export enum PeranType {
  MUSLIM = "Muslim (Prioritas)",
  KELUARGA = "Keluarga",
  BEKERJA = "Bekerja",
  INVESTOR = "Investor",
  DAKWAH = "Dakwah",
  MASYARAKAT = "Masyarakat",
  BEBAS = "Bebas",
  SUNNAH = "Sunnah Bonus"
}

export enum Gender {
  IKHWAN = "Ikhwan",
  AKHWAT = "Akhwat"
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  city: string;
  whatsapp: string;
  gender: Gender;
  role: RoleType;
  level: number;
  totalXP: number;
  referralCode: string;
  avatarUrl: string;
  joinDate: string;
  streakDays: number;
  velocityHistory: { day: string; xp: number }[];
  plannedMissionIds?: string[];
  jalsahId?: string; // Renamed from halaqahId
}

export interface MissionItem {
  id: string;
  title: string;
  type: PeranType;
  xp: number;
  completed: boolean;
  maxPerDay?: boolean;
  genderTarget?: Gender;
  userId?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string;
  weeklyXP: number;
  trend: 'up' | 'down' | 'stable';
  rank: number;
}

export interface Jalsah { // Renamed from Halaqah
  id: string;
  name: string;
  musyrifId: string;
  memberIds: string[];
  meetingTime: string; // e.g., "Jumat, 20:00 WIB"
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface JalsahInvitation { // Renamed from HalaqahInvitation
  id: string;
  jalsahId: string; // Renamed from halaqahId
  jalsahName: string; // Renamed from halaqahName
  musyrifName: string;
  memberId: string; 
  targetUsername: string; 
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}

export interface Kajian {
  id: string;
  title: string;
  description: string;
  category: PeranType;
  musyrifId: string;
  musyrifName: string;
  date: string;
  isPaid: boolean;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Article {
  id: string;
  title: string;
  category: PeranType;
  content: string;
  musyrifId: string;
  musyrifName: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}
