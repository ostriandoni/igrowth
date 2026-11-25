import { SupabaseClient } from "@supabase/supabase-js";
import {
  ActivityLog,
  CaregiverProfile,
  ChildProfile,
  FoodAllergyTest,
  GrowthRecord,
  MealRecord,
  MilestoneProgress,
  MilestoneStatus,
  VaccineScheduleItem,
} from "@/types";
import {
  DEFAULT_CAREGIVER,
  DEFAULT_CHILD,
  INITIAL_ACTIVITIES,
  INITIAL_ALLERGIES,
  INITIAL_GROWTH_RECORDS,
  INITIAL_MEALS,
  INITIAL_MILESTONE_PROGRESS,
  INITIAL_VACCINES,
} from "@/lib/storage";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(id: string): boolean {
  return UUID_REGEX.test(id);
}

// --- Mappers ---

interface DbChildRow {
  id: string;
  user_id: string;
  name: string;
  nickname: string;
  birth_date: string;
  gender: "male" | "female";
  birth_weight: number;
  birth_height: number;
  birth_head_circumference: number;
  blood_type: string | null;
  avatar_icon: string | null;
  is_active: boolean;
}

function mapChild(row: DbChildRow): ChildProfile {
  return {
    id: row.id,
    name: row.name,
    nickname: row.nickname,
    birthDate: row.birth_date,
    gender: row.gender,
    birthWeight: Number(row.birth_weight),
    birthHeight: Number(row.birth_height),
    birthHeadCircumference: Number(row.birth_head_circumference),
    bloodType: row.blood_type ?? undefined,
    avatarIcon: row.avatar_icon ?? "👶",
  };
}

interface DbGrowthRow {
  id: string;
  child_id: string;
  date: string;
  age_months: number;
  age_days: number;
  weight: number;
  height: number;
  head_circumference: number;
  measure_position: "recumbent" | "standing";
  notes: string | null;
}

function mapGrowth(row: DbGrowthRow): GrowthRecord {
  return {
    id: row.id,
    childId: row.child_id,
    date: row.date,
    ageMonths: row.age_months,
    ageDays: row.age_days,
    weight: Number(row.weight),
    height: Number(row.height),
    headCircumference: Number(row.head_circumference),
    measurePosition: row.measure_position,
    notes: row.notes ?? undefined,
  };
}

interface DbMealRow {
  id: string;
  child_id: string;
  date: string;
  time: string;
  meal_time: MealRecord["mealTime"];
  menu_name: string;
  amount_eaten: MealRecord["amountEaten"];
  carbs: string | null;
  protein: string | null;
  vegetables: string | null;
  fat: string | null;
  notes: string | null;
}

function mapMeal(row: DbMealRow): MealRecord {
  return {
    id: row.id,
    childId: row.child_id,
    date: row.date,
    time: row.time,
    mealTime: row.meal_time,
    menuName: row.menu_name,
    amountEaten: row.amount_eaten,
    carbs: row.carbs ?? undefined,
    protein: row.protein ?? undefined,
    vegetables: row.vegetables ?? undefined,
    fat: row.fat ?? undefined,
    notes: row.notes ?? undefined,
  };
}

interface DbAllergyRow {
  id: string;
  child_id: string;
  food_name: string;
  introduced_date: string;
  day_count: number;
  status: FoodAllergyTest["status"];
  reaction_description: string | null;
}

function mapAllergy(row: DbAllergyRow): FoodAllergyTest {
  return {
    id: row.id,
    childId: row.child_id,
    foodName: row.food_name,
    introducedDate: row.introduced_date,
    dayCount: row.day_count,
    status: row.status,
    reactionDescription: row.reaction_description ?? undefined,
  };
}

interface DbActivityRow {
  id: string;
  child_id: string;
  date: string;
  time: string;
  type: ActivityLog["type"];
  title: string;
  details: ActivityLog["details"];
  notes: string | null;
}

function mapActivity(row: DbActivityRow): ActivityLog {
  return {
    id: row.id,
    childId: row.child_id,
    date: row.date,
    time: row.time,
    type: row.type,
    title: row.title,
    details: row.details ?? {},
    notes: row.notes ?? undefined,
  };
}

export interface DashboardData {
  caregiver: CaregiverProfile;
  children: ChildProfile[];
  activeChildId: string | null;
  growthRecords: GrowthRecord[];
  milestoneProgress: MilestoneProgress[];
  meals: MealRecord[];
  allergies: FoodAllergyTest[];
  activities: ActivityLog[];
  vaccines: VaccineScheduleItem[];
}

export async function fetchDashboardData(
  supabase: SupabaseClient,
  userId: string
): Promise<DashboardData> {
  const [
    caregiverRes,
    childrenRes,
    growthRes,
    milestoneRes,
    mealsRes,
    allergiesRes,
    activitiesRes,
    vaccinesRes,
  ] = await Promise.all([
    supabase.from("caregivers").select("*").eq("user_id", userId).maybeSingle(),
    supabase
      .from("children")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
    supabase
      .from("growth_records")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true }),
    supabase.from("milestone_progress").select("*").eq("user_id", userId),
    supabase
      .from("meal_records")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .order("time", { ascending: false }),
    supabase
      .from("food_allergy_tests")
      .select("*")
      .eq("user_id", userId)
      .order("introduced_date", { ascending: false }),
    supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .order("time", { ascending: false }),
    supabase.from("vaccine_records").select("*").eq("user_id", userId),
  ]);

  if (caregiverRes.error) throw caregiverRes.error;
  if (childrenRes.error) throw childrenRes.error;
  if (growthRes.error) throw growthRes.error;
  if (milestoneRes.error) throw milestoneRes.error;
  if (mealsRes.error) throw mealsRes.error;
  if (allergiesRes.error) throw allergiesRes.error;
  if (activitiesRes.error) throw activitiesRes.error;
  if (vaccinesRes.error) throw vaccinesRes.error;

  const caregiver: CaregiverProfile = caregiverRes.data
    ? {
        id: caregiverRes.data.id,
        role: caregiverRes.data.role,
        name: caregiverRes.data.name,
      }
    : DEFAULT_CAREGIVER;

  const childRows = (childrenRes.data ?? []) as DbChildRow[];
  const children = childRows.map(mapChild);
  const activeRow = childRows.find((c) => c.is_active) ?? childRows[0] ?? null;

  const milestoneProgress: MilestoneProgress[] = (milestoneRes.data ?? []).map(
    (m: {
      child_id: string;
      milestone_id: string;
      status: MilestoneStatus;
      achieved_date: string | null;
      notes: string | null;
    }) => ({
      childId: m.child_id,
      milestoneId: m.milestone_id,
      status: m.status,
      achievedDate: m.achieved_date ?? undefined,
      notes: m.notes ?? undefined,
    })
  );

  // Merge user vaccine records for the active child into the master vaccine catalog
  const vaccineRows = (vaccinesRes.data ?? []) as Array<{
    child_id: string;
    vaccine_id: string;
    completed: boolean;
    completed_date: string | null;
  }>;
  const activeVaccineMap = new Map(
    vaccineRows
      .filter((v) => !activeRow || v.child_id === activeRow.id)
      .map((v) => [v.vaccine_id, v])
  );

  const vaccines: VaccineScheduleItem[] = INITIAL_VACCINES.map((base) => {
    const rec = activeVaccineMap.get(base.id);
    if (!rec) {
      return { ...base, completed: false, completedDate: undefined };
    }
    return {
      ...base,
      completed: rec.completed,
      completedDate: rec.completed_date ?? undefined,
    };
  });

  return {
    caregiver,
    children,
    activeChildId: activeRow?.id ?? null,
    growthRecords: ((growthRes.data ?? []) as DbGrowthRow[]).map(mapGrowth),
    milestoneProgress,
    meals: ((mealsRes.data ?? []) as DbMealRow[]).map(mapMeal),
    allergies: ((allergiesRes.data ?? []) as DbAllergyRow[]).map(mapAllergy),
    activities: ((activitiesRes.data ?? []) as DbActivityRow[]).map(mapActivity),
    vaccines,
  };
}

// --- Mutations ---

export async function upsertCaregiver(
  supabase: SupabaseClient,
  userId: string,
  caregiver: CaregiverProfile
): Promise<CaregiverProfile> {
  const { data, error } = await supabase
    .from("caregivers")
    .upsert(
      {
        user_id: userId,
        role: caregiver.role,
        name: caregiver.name,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    role: data.role,
    name: data.name,
  };
}

export async function createChild(
  supabase: SupabaseClient,
  userId: string,
  child: Omit<ChildProfile, "id"> & { id?: string }
): Promise<ChildProfile> {
  // Nonaktifkan is_active pada anak lain agar hanya 1 yang aktif
  await supabase
    .from("children")
    .update({ is_active: false })
    .eq("user_id", userId);

  const { data, error } = await supabase
    .from("children")
    .insert({
      user_id: userId,
      name: child.name,
      nickname: child.nickname,
      birth_date: child.birthDate,
      gender: child.gender,
      birth_weight: child.birthWeight,
      birth_height: child.birthHeight,
      birth_head_circumference: child.birthHeadCircumference,
      blood_type: child.bloodType ?? null,
      avatar_icon: child.avatarIcon ?? "👶",
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return mapChild(data as DbChildRow);
}

export async function updateChild(
  supabase: SupabaseClient,
  userId: string,
  child: ChildProfile
): Promise<ChildProfile> {
  const { data, error } = await supabase
    .from("children")
    .update({
      name: child.name,
      nickname: child.nickname,
      birth_date: child.birthDate,
      gender: child.gender,
      birth_weight: child.birthWeight,
      birth_height: child.birthHeight,
      birth_head_circumference: child.birthHeadCircumference,
      blood_type: child.bloodType ?? null,
      avatar_icon: child.avatarIcon ?? "👶",
      updated_at: new Date().toISOString(),
    })
    .eq("id", child.id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return mapChild(data as DbChildRow);
}

export async function setActiveChildInDb(
  supabase: SupabaseClient,
  userId: string,
  childId: string
): Promise<void> {
  await supabase
    .from("children")
    .update({ is_active: false })
    .eq("user_id", userId);

  const { error } = await supabase
    .from("children")
    .update({ is_active: true })
    .eq("id", childId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function upsertGrowthRecord(
  supabase: SupabaseClient,
  userId: string,
  record: GrowthRecord
): Promise<GrowthRecord> {
  const payload = {
    user_id: userId,
    child_id: record.childId,
    date: record.date,
    age_months: record.ageMonths,
    age_days: record.ageDays,
    weight: record.weight,
    height: record.height,
    head_circumference: record.headCircumference,
    measure_position: record.measurePosition,
    notes: record.notes ?? null,
  };

  if (isUuid(record.id)) {
    const { data, error } = await supabase
      .from("growth_records")
      .upsert({ id: record.id, ...payload })
      .select()
      .single();
    if (error) throw error;
    return mapGrowth(data as DbGrowthRow);
  }

  const { data, error } = await supabase
    .from("growth_records")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return mapGrowth(data as DbGrowthRow);
}

export async function deleteGrowthRecord(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("growth_records")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function upsertMilestoneProgress(
  supabase: SupabaseClient,
  userId: string,
  progress: MilestoneProgress
): Promise<void> {
  const { error } = await supabase.from("milestone_progress").upsert(
    {
      user_id: userId,
      child_id: progress.childId,
      milestone_id: progress.milestoneId,
      status: progress.status,
      achieved_date: progress.achievedDate ?? null,
      notes: progress.notes ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "child_id,milestone_id" }
  );
  if (error) throw error;
}

export async function createMealRecord(
  supabase: SupabaseClient,
  userId: string,
  meal: MealRecord
): Promise<MealRecord> {
  const { data, error } = await supabase
    .from("meal_records")
    .insert({
      user_id: userId,
      child_id: meal.childId,
      date: meal.date,
      time: meal.time,
      meal_time: meal.mealTime,
      menu_name: meal.menuName,
      amount_eaten: meal.amountEaten,
      carbs: meal.carbs ?? null,
      protein: meal.protein ?? null,
      vegetables: meal.vegetables ?? null,
      fat: meal.fat ?? null,
      notes: meal.notes ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapMeal(data as DbMealRow);
}

export async function deleteMealRecord(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("meal_records")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function createFoodAllergy(
  supabase: SupabaseClient,
  userId: string,
  allergy: FoodAllergyTest
): Promise<FoodAllergyTest> {
  const { data, error } = await supabase
    .from("food_allergy_tests")
    .insert({
      user_id: userId,
      child_id: allergy.childId,
      food_name: allergy.foodName,
      introduced_date: allergy.introducedDate,
      day_count: allergy.dayCount,
      status: allergy.status,
      reaction_description: allergy.reactionDescription ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapAllergy(data as DbAllergyRow);
}

export async function deleteFoodAllergy(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("food_allergy_tests")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function createActivityLog(
  supabase: SupabaseClient,
  userId: string,
  activity: ActivityLog
): Promise<ActivityLog> {
  const { data, error } = await supabase
    .from("activity_logs")
    .insert({
      user_id: userId,
      child_id: activity.childId,
      date: activity.date,
      time: activity.time,
      type: activity.type,
      title: activity.title,
      details: activity.details ?? {},
      notes: activity.notes ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapActivity(data as DbActivityRow);
}

export async function deleteActivityLog(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("activity_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function upsertVaccineRecord(
  supabase: SupabaseClient,
  userId: string,
  childId: string,
  vaccineId: string,
  completed: boolean,
  completedDate?: string
): Promise<void> {
  const { error } = await supabase.from("vaccine_records").upsert(
    {
      user_id: userId,
      child_id: childId,
      vaccine_id: vaccineId,
      completed,
      completed_date: completedDate ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "child_id,vaccine_id" }
  );
  if (error) throw error;
}

export async function seedDemoDataForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  // Caregiver
  await upsertCaregiver(supabase, userId, DEFAULT_CAREGIVER);

  // Child
  const createdChild = await createChild(supabase, userId, DEFAULT_CHILD);

  // Growth records
  if (INITIAL_GROWTH_RECORDS.length > 0) {
    await supabase.from("growth_records").insert(
      INITIAL_GROWTH_RECORDS.map((r) => ({
        user_id: userId,
        child_id: createdChild.id,
        date: r.date,
        age_months: r.ageMonths,
        age_days: r.ageDays,
        weight: r.weight,
        height: r.height,
        head_circumference: r.headCircumference,
        measure_position: r.measurePosition,
        notes: r.notes ?? null,
      }))
    );
  }

  // Milestone progress
  if (INITIAL_MILESTONE_PROGRESS.length > 0) {
    await supabase.from("milestone_progress").insert(
      INITIAL_MILESTONE_PROGRESS.map((m) => ({
        user_id: userId,
        child_id: createdChild.id,
        milestone_id: m.milestoneId,
        status: m.status,
        achieved_date: m.achievedDate ?? null,
        notes: m.notes ?? null,
      }))
    );
  }

  // Meals
  if (INITIAL_MEALS.length > 0) {
    await supabase.from("meal_records").insert(
      INITIAL_MEALS.map((m) => ({
        user_id: userId,
        child_id: createdChild.id,
        date: m.date,
        time: m.time,
        meal_time: m.mealTime,
        menu_name: m.menuName,
        amount_eaten: m.amountEaten,
        carbs: m.carbs ?? null,
        protein: m.protein ?? null,
        vegetables: m.vegetables ?? null,
        fat: m.fat ?? null,
        notes: m.notes ?? null,
      }))
    );
  }

  // Allergies
  if (INITIAL_ALLERGIES.length > 0) {
    await supabase.from("food_allergy_tests").insert(
      INITIAL_ALLERGIES.map((a) => ({
        user_id: userId,
        child_id: createdChild.id,
        food_name: a.foodName,
        introduced_date: a.introducedDate,
        day_count: a.dayCount,
        status: a.status,
        reaction_description: a.reactionDescription ?? null,
      }))
    );
  }

  // Activities
  if (INITIAL_ACTIVITIES.length > 0) {
    await supabase.from("activity_logs").insert(
      INITIAL_ACTIVITIES.map((a) => ({
        user_id: userId,
        child_id: createdChild.id,
        date: a.date,
        time: a.time,
        type: a.type,
        title: a.title,
        details: a.details ?? {},
        notes: a.notes ?? null,
      }))
    );
  }

  // Vaccines
  const completedVaccines = INITIAL_VACCINES.filter((v) => v.completed);
  if (completedVaccines.length > 0) {
    await supabase.from("vaccine_records").insert(
      completedVaccines.map((v) => ({
        user_id: userId,
        child_id: createdChild.id,
        vaccine_id: v.id,
        completed: true,
        completed_date: v.completedDate ?? null,
      }))
    );
  }
}

export async function clearUserData(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  // Menghapus children akan otomatis cascade menghapus growth_records, meals, dll.
  const { error } = await supabase
    .from("children")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}
