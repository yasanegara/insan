
import { MissionItem, PeranType, RoleType, User, LeaderboardEntry, Gender } from "./types";

// Helper to generate last 7 days mock history
const generateMockHistory = () => {
  const days = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'];
  return days.map(day => ({
    day,
    xp: Math.floor(Math.random() * 400) + 100 // Random XP between 100-500
  }));
};

export const MOCK_USER: User = {
  id: "u1",
  name: "Abdullah Fulan",
  username: "@abdullah_f",
  email: "abdullah@example.com",
  city: "Jakarta Selatan",
  whatsapp: "081234567890",
  gender: Gender.IKHWAN,
  role: RoleType.CANDIDATE,
  level: 3,
  totalXP: 1250,
  referralCode: "INSAN-99X",
  avatarUrl: "https://ui-avatars.com/api/?name=Abdullah+Fulan&background=0D8ABC&color=fff",
  joinDate: "2023-10-01",
  streakDays: 12,
  velocityHistory: generateMockHistory(),
  plannedMissionIds: [], // Default empty
  jalsahId: undefined
};

export const CATEGORY_XP_WEIGHTS: Record<PeranType, number> = {
  [PeranType.MUSLIM]: 99,
  [PeranType.DAKWAH]: 66,
  [PeranType.MASYARAKAT]: 56,
  [PeranType.BEKERJA]: 33,
  [PeranType.KELUARGA]: 33,
  [PeranType.INVESTOR]: 33,
  [PeranType.BEBAS]: 22,
  [PeranType.SUNNAH]: 22
};

// Default Configuration: Which level unlocks which role?
// 3 Roles for Newbies (Level 0), others unlock progressively
export const DEFAULT_ROLE_UNLOCKS: Record<PeranType, number> = {
  [PeranType.MUSLIM]: 0,     // Core
  [PeranType.KELUARGA]: 0,   // Core
  [PeranType.BEKERJA]: 0,    // Core
  [PeranType.SUNNAH]: 1,     // Unlock at Level 1
  [PeranType.MASYARAKAT]: 2, // Unlock at Level 2
  [PeranType.BEBAS]: 3,      // Unlock at Level 3
  [PeranType.INVESTOR]: 4,   // Unlock at Level 4
  [PeranType.DAKWAH]: 5      // Unlock at Level 5
};

// Daily Missions with Gender Logic
export const DAILY_MISSIONS: MissionItem[] = [
  // Muslim (Prioritas)
  { id: "m1", title: "Sholat Subuh Berjamaah (Masjid)", type: PeranType.MUSLIM, xp: 99, completed: false, genderTarget: Gender.IKHWAN },
  { id: "m1_f", title: "Sholat Subuh Awal Waktu", type: PeranType.MUSLIM, xp: 99, completed: false, genderTarget: Gender.AKHWAT },
  
  { id: "m2", title: "Sholat Dzuhur Berjamaah", type: PeranType.MUSLIM, xp: 99, completed: false, genderTarget: Gender.IKHWAN },
  { id: "m2_f", title: "Sholat Dzuhur Awal Waktu", type: PeranType.MUSLIM, xp: 99, completed: false, genderTarget: Gender.AKHWAT },

  { id: "m3", title: "Sholat Ashar Berjamaah", type: PeranType.MUSLIM, xp: 99, completed: false, genderTarget: Gender.IKHWAN },
  { id: "m3_f", title: "Sholat Ashar Awal Waktu", type: PeranType.MUSLIM, xp: 99, completed: false, genderTarget: Gender.AKHWAT },

  { id: "m4", title: "Sholat Maghrib Berjamaah", type: PeranType.MUSLIM, xp: 99, completed: false, genderTarget: Gender.IKHWAN },
  { id: "m4_f", title: "Sholat Maghrib Awal Waktu", type: PeranType.MUSLIM, xp: 99, completed: false, genderTarget: Gender.AKHWAT },

  { id: "m5", title: "Sholat Isya Berjamaah", type: PeranType.MUSLIM, xp: 99, completed: false, genderTarget: Gender.IKHWAN },
  { id: "m5_f", title: "Sholat Isya Awal Waktu", type: PeranType.MUSLIM, xp: 99, completed: false, genderTarget: Gender.AKHWAT },

  { id: "m6", title: "Tilawah Al-Quran (1 Juz)", type: PeranType.MUSLIM, xp: 99, completed: false },
  
  // Sunnah Bonus
  { id: "s1", title: "Sholat Tahajud", type: PeranType.SUNNAH, xp: 20, completed: false },
  { id: "s2", title: "Sholat Dhuha", type: PeranType.SUNNAH, xp: 20, completed: false },
  { id: "s3", title: "Sedekah Subuh", type: PeranType.SUNNAH, xp: 20, completed: false },

  // Peran Lainnya (Examples)
  { id: "p1", title: "Fokus Kerja Deep Work (4 Jam)", type: PeranType.BEKERJA, xp: 33, completed: false },
  { id: "p2", title: "Quality Time Keluarga", type: PeranType.KELUARGA, xp: 33, completed: false },
  { id: "p3", title: "Olahraga 30 Menit", type: PeranType.BEBAS, xp: 33, completed: false },
  { id: "p4", title: "Share Postingan Dakwah", type: PeranType.DAKWAH, xp: 33, completed: false },
];

export const JALSAH_LEADERBOARD: LeaderboardEntry[] = [
  { id: "u2", name: "Fatih Karim", avatarUrl: "https://ui-avatars.com/api/?name=Fatih+Karim&background=random", weeklyXP: 3400, trend: 'up', rank: 1 },
  { id: "u3", name: "Aisyah Zahra", avatarUrl: "https://ui-avatars.com/api/?name=Aisyah+Zahra&background=pink&color=fff", weeklyXP: 3150, trend: 'stable', rank: 2 },
  { id: "u1", name: "Abdullah Fulan", avatarUrl: "https://ui-avatars.com/api/?name=Abdullah+Fulan&background=0D8ABC&color=fff", weeklyXP: 2890, trend: 'up', rank: 3 }, // Current User
  { id: "u4", name: "Umar Hasan", avatarUrl: "https://ui-avatars.com/api/?name=Umar+Hasan&background=random", weeklyXP: 2100, trend: 'down', rank: 4 },
  { id: "u5", name: "Khalid Basalamah", avatarUrl: "https://ui-avatars.com/api/?name=Khalid+Basalamah&background=random", weeklyXP: 1500, trend: 'stable', rank: 5 },
];

export const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100));
};

export const getProgressToNextLevel = (currentXP: number, currentLevel: number) => {
  const nextLevel = currentLevel + 1;
  const nextLevelXP = Math.pow(nextLevel, 2) * 100;
  const currentLevelBaseXP = Math.pow(currentLevel, 2) * 100;
  
  const progress = ((currentXP - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100;
  return {
    progress: Math.min(Math.max(progress, 0), 100),
    nextXP: nextLevelXP,
    needed: nextLevelXP - currentXP
  };
};
