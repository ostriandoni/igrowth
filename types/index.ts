export type Gender = "male" | "female";

export interface ChildProfile {
  id: string;
  name: string;
  nickname: string;
  birthDate: string; // YYYY-MM-DD
  gender: Gender;
  birthWeight: number; // in kg
  birthHeight: number; // in cm
  birthHeadCircumference: number; // in cm
  bloodType?: string;
  avatarIcon?: string;
}

export interface CaregiverProfile {
  id: string;
  role: "Ayah" | "Ibu" | "Nenek" | "Kakek" | "Pengasuh" | "Lainnya";
  name: string;
}

export interface GrowthRecord {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD
  ageMonths: number;
  ageDays: number;
  weight: number; // kg
  height: number; // cm
  headCircumference: number; // cm
  measurePosition: "recumbent" | "standing"; // telentang / berdiri
  notes?: string;
}

export type MilestoneCategory =
  | "motorik_kasar"
  | "motorik_halus"
  | "komunikasi"
  | "sosial_emosional"
  | "kognitif";

export type MilestoneStatus = "not_yet" | "learning" | "achieved";

export interface MilestoneItem {
  id: string;
  ageGroup: string; // e.g. "0-3 bln", "4-6 bln", "7-9 bln", "10-12 bln", "1-2 thn", "2-3 thn"
  ageGroupMonths: number; // e.g. 9 for checklist 9 bulan
  category: MilestoneCategory;
  title: string;
  description: string;
  stimulationTips: string;
  isRedFlagWarning?: string;
}

export interface MilestoneProgress {
  childId: string;
  milestoneId: string;
  status: MilestoneStatus;
  achievedDate?: string;
  notes?: string;
}

export type MealTime =
  | "sarapan"
  | "snack_pagi"
  | "makan_siang"
  | "snack_sore"
  | "makan_malam";

export type MealEatenAmount = "habis" | "tiga_perempat" | "setengah" | "sedikit" | "gtm";

export interface MealRecord {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mealTime: MealTime;
  menuName: string;
  amountEaten: MealEatenAmount;
  carbs?: string;
  protein?: string;
  vegetables?: string;
  fat?: string;
  notes?: string;
}

export interface FoodAllergyTest {
  id: string;
  childId: string;
  foodName: string;
  introducedDate: string;
  dayCount: number; // 1, 2, 3 (aturan 3 hari pengenalan)
  status: "safe" | "monitoring" | "allergic";
  reactionDescription?: string;
}

export interface MpasiRecipe {
  id: string;
  title: string;
  ageRange: string;
  prepTime: string;
  ironRich: boolean;
  ingredients: string[];
  instructions: string[];
  nutritionTags: string[];
  highlight: string;
}

export type ActivityType = "milk" | "sleep" | "diaper" | "vaccine" | "moment";

export interface ActivityLog {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: ActivityType;
  title: string;
  details: {
    // for milk
    milkType?: "breast_direct" | "breast_bottle" | "formula";
    amountMl?: number;
    durationMinutes?: number;
    // for sleep
    sleepType?: "day_nap" | "night_sleep";
    wakeTime?: string;
    durationFormatted?: string;
    // for diaper
    diaperType?: "wet" | "dirty" | "both";
    stoolColor?: string;
    stoolConsistency?: "normal" | "encer" | "keras" | "berlendir";
    // for vaccine
    vaccineName?: string;
    healthCenter?: string;
    temperature?: number;
    // for moment
    momentTitle?: string;
    story?: string;
  };
  notes?: string;
}

export interface VaccineScheduleItem {
  id: string;
  name: string;
  recommendedAgeMonths: number;
  description: string;
  isMandatory: boolean;
  completed: boolean;
  completedDate?: string;
}

export type ActiveTab = "beranda" | "tumbuh" | "ukur" | "mpasi" | "memo";
