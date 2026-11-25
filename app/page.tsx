"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ActiveTab,
  ActivityLog,
  ActivityType,
  CaregiverProfile,
  ChildProfile,
  FoodAllergyTest,
  Gender,
  GrowthRecord,
  MealRecord,
  MilestoneItem,
  MilestoneProgress,
  MilestoneStatus,
  MpasiRecipe,
  VaccineScheduleItem,
} from "@/types";
import {
  DEFAULT_CAREGIVER,
  DEFAULT_CHILD,
  INITIAL_MILESTONES,
  INITIAL_RECIPES,
  INITIAL_VACCINES,
} from "@/lib/storage";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  clearUserData,
  createActivityLog,
  createChild,
  createFoodAllergy,
  createMealRecord,
  deleteActivityLog,
  deleteFoodAllergy,
  deleteGrowthRecord,
  deleteMealRecord,
  fetchDashboardData,
  seedDemoDataForUser,
  setActiveChildInDb,
  updateChild,
  upsertCaregiver,
  upsertGrowthRecord,
  upsertMilestoneProgress,
  upsertVaccineRecord,
} from "@/lib/supabase/db";

// Components
import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";
import { AuthView } from "@/components/AuthView";

// Tabs
import { HomeTab } from "@/components/tabs/HomeTab";
import { GrowthMilestoneTab } from "@/components/tabs/GrowthMilestoneTab";
import { MeasurementTab } from "@/components/tabs/MeasurementTab";
import { MpasiTab } from "@/components/tabs/MpasiTab";
import { MemoTab } from "@/components/tabs/MemoTab";

// Modals
import { SettingsModal } from "@/components/modals/SettingsModal";
import { CaregiverModal } from "@/components/modals/CaregiverModal";
import { RecordGrowthModal } from "@/components/modals/RecordGrowthModal";
import { RecordActivityModal } from "@/components/modals/RecordActivityModal";
import { RecordMealModal } from "@/components/modals/RecordMealModal";
import { FoodAllergyModal } from "@/components/modals/FoodAllergyModal";
import { RecipeDetailModal } from "@/components/modals/RecipeDetailModal";
import { StimulationModal } from "@/components/modals/StimulationModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("beranda");
  const [milestoneAgeFilter, setMilestoneAgeFilter] = useState<string>("7-9 bln");

  // Auth & Loading state
  const [authChecked, setAuthChecked] = useState(() => !isSupabaseConfigured());
  const [user, setUser] = useState<User | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Onboarding state when user has 0 children
  const [onboardingName, setOnboardingName] = useState("");
  const [onboardingNickname, setOnboardingNickname] = useState("");
  const [onboardingBirthDate, setOnboardingBirthDate] = useState("2026-03-30");
  const [onboardingGender, setOnboardingGender] = useState<Gender>("male");
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);

  // App state from Supabase
  const [activeChild, setActiveChild] = useState<ChildProfile>(DEFAULT_CHILD);
  const [allChildren, setAllChildren] = useState<ChildProfile[]>([]);
  const [caregiver, setCaregiver] = useState<CaregiverProfile>(DEFAULT_CAREGIVER);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [milestones] = useState<MilestoneItem[]>(INITIAL_MILESTONES);
  const [milestoneProgress, setMilestoneProgress] = useState<MilestoneProgress[]>([]);
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [allergies, setAllergies] = useState<FoodAllergyTest[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [vaccines, setVaccines] = useState<VaccineScheduleItem[]>(INITIAL_VACCINES);
  const [recipes] = useState<MpasiRecipe[]>(INITIAL_RECIPES);

  // Modals Visibility
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCaregiverOpen, setIsCaregiverOpen] = useState(false);
  const [isRecordGrowthOpen, setIsRecordGrowthOpen] = useState(false);
  const [editingGrowthRecord, setEditingGrowthRecord] = useState<GrowthRecord | null>(null);

  const [isRecordActivityOpen, setIsRecordActivityOpen] = useState(false);
  const [activityTypeToRecord, setActivityTypeToRecord] = useState<ActivityType>("milk");

  const [isRecordMealOpen, setIsRecordMealOpen] = useState(false);
  const [isFoodAllergyOpen, setIsFoodAllergyOpen] = useState(false);

  const [activeRecipeDetail, setActiveRecipeDetail] = useState<MpasiRecipe | null>(null);
  const [activeStimulation, setActiveStimulation] = useState<{
    milestone: MilestoneItem;
    status: MilestoneStatus;
  } | null>(null);

  const loadUserDashboard = useCallback(async (currentUser: User) => {
    setDataLoading(true);
    setErrorBanner(null);
    try {
      const supabase = createClient();
      const data = await fetchDashboardData(supabase, currentUser.id);
      setCaregiver(data.caregiver);
      setAllChildren(data.children);
      if (data.children.length > 0) {
        const active =
          data.children.find((c) => c.id === data.activeChildId) ?? data.children[0];
        setActiveChild(active);
      }
      setGrowthRecords(data.growthRecords);
      setMilestoneProgress(data.milestoneProgress);
      setMeals(data.meals);
      setAllergies(data.allergies);
      setActivities(data.activities);
      setVaccines(data.vaccines);
    } catch (err) {
      setErrorBanner(
        err instanceof Error ? err.message : "Gagal memuat data dari Supabase."
      );
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = createClient();
    let mounted = true;

    async function initAuth() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(currentUser);
      setAuthChecked(true);
      if (currentUser) {
        await loadUserDashboard(currentUser);
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        loadUserDashboard(nextUser);
      } else {
        setAllChildren([]);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserDashboard]);

  // --- Onboarding handlers ---
  const handleCreateFirstChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !onboardingName.trim()) return;
    setOnboardingSubmitting(true);
    setErrorBanner(null);
    try {
      const supabase = createClient();
      await createChild(supabase, user.id, {
        name: onboardingName.trim(),
        nickname: onboardingNickname.trim() || onboardingName.trim().split(" ")[0],
        birthDate: onboardingBirthDate,
        gender: onboardingGender,
        birthWeight: 3.2,
        birthHeight: 49.5,
        birthHeadCircumference: 34.0,
        avatarIcon: onboardingGender === "female" ? "👧" : "👶",
      });
      await loadUserDashboard(user);
    } catch (err) {
      setErrorBanner(
        err instanceof Error ? err.message : "Gagal membuat profil anak."
      );
    } finally {
      setOnboardingSubmitting(false);
    }
  };

  const handleLoadDemoData = async () => {
    if (!user) return;
    setOnboardingSubmitting(true);
    setErrorBanner(null);
    try {
      const supabase = createClient();
      await seedDemoDataForUser(supabase, user.id);
      await loadUserDashboard(user);
    } catch (err) {
      setErrorBanner(
        err instanceof Error ? err.message : "Gagal memuat data contoh."
      );
    } finally {
      setOnboardingSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setAllChildren([]);
  };

  // --- CRUD Handlers backed by Supabase ---
  const handleUpdateChild = async (updated: ChildProfile) => {
    if (!user) return;
    setActiveChild(updated);
    setAllChildren((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    try {
      const supabase = createClient();
      const saved = await updateChild(supabase, user.id, updated);
      setActiveChild(saved);
      setAllChildren((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal memperbarui profil anak.");
    }
  };

  const handleSelectChild = async (childId: string) => {
    if (!user) return;
    const selected = allChildren.find((c) => c.id === childId);
    if (!selected) return;
    setActiveChild(selected);
    try {
      const supabase = createClient();
      await setActiveChildInDb(supabase, user.id, childId);
      await loadUserDashboard(user);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal mengganti anak aktif.");
    }
  };

  const handleAddChild = async (newChild: ChildProfile) => {
    if (!user) return;
    try {
      const supabase = createClient();
      const saved = await createChild(supabase, user.id, newChild);
      setAllChildren((prev) => [...prev, saved]);
      setActiveChild(saved);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal menambah profil anak.");
    }
  };

  const handleSaveCaregiver = async (newCg: CaregiverProfile) => {
    if (!user) return;
    setCaregiver(newCg);
    try {
      const supabase = createClient();
      const saved = await upsertCaregiver(supabase, user.id, newCg);
      setCaregiver(saved);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal menyimpan profil pengasuh.");
    }
  };

  // Growth record operations
  const handleSaveGrowthRecord = async (rec: GrowthRecord) => {
    if (!user) return;
    setEditingGrowthRecord(null);
    try {
      const supabase = createClient();
      const saved = await upsertGrowthRecord(supabase, user.id, {
        ...rec,
        childId: activeChild.id,
      });
      setGrowthRecords((prev) => {
        const exists = prev.some((r) => r.id === saved.id);
        return exists
          ? prev.map((r) => (r.id === saved.id ? saved : r))
          : [...prev, saved];
      });
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal menyimpan pengukuran.");
    }
  };

  const handleDeleteGrowthRecord = async (id: string) => {
    if (!user) return;
    setGrowthRecords((prev) => prev.filter((r) => r.id !== id));
    try {
      const supabase = createClient();
      await deleteGrowthRecord(supabase, user.id, id);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal menghapus pengukuran.");
    }
  };

  // Milestone operations
  const handleUpdateMilestoneStatus = async (
    milestoneId: string,
    status: MilestoneStatus
  ) => {
    if (!user) return;
    const achievedDate =
      status === "achieved" ? new Date().toISOString().split("T")[0] : undefined;
    const nextProgress: MilestoneProgress = {
      childId: activeChild.id,
      milestoneId,
      status,
      achievedDate,
    };

    setMilestoneProgress((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.childId === activeChild.id && p.milestoneId === milestoneId
      );
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], ...nextProgress };
        return copy;
      }
      return [...prev, nextProgress];
    });

    try {
      const supabase = createClient();
      await upsertMilestoneProgress(supabase, user.id, nextProgress);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal menyimpan milestone.");
    }
  };

  // Meal operations
  const handleSaveMeal = async (meal: MealRecord) => {
    if (!user) return;
    try {
      const supabase = createClient();
      const saved = await createMealRecord(supabase, user.id, {
        ...meal,
        childId: activeChild.id,
      });
      setMeals((prev) => [saved, ...prev]);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal menyimpan catatan makan.");
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!user) return;
    setMeals((prev) => prev.filter((m) => m.id !== id));
    try {
      const supabase = createClient();
      await deleteMealRecord(supabase, user.id, id);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal menghapus catatan makan.");
    }
  };

  // Allergy operations
  const handleSaveAllergy = async (alg: FoodAllergyTest) => {
    if (!user) return;
    try {
      const supabase = createClient();
      const saved = await createFoodAllergy(supabase, user.id, {
        ...alg,
        childId: activeChild.id,
      });
      setAllergies((prev) => [saved, ...prev]);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal menyimpan uji alergi.");
    }
  };

  const handleDeleteAllergy = async (id: string) => {
    if (!user) return;
    setAllergies((prev) => prev.filter((a) => a.id !== id));
    try {
      const supabase = createClient();
      await deleteFoodAllergy(supabase, user.id, id);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal menghapus uji alergi.");
    }
  };

  // Activity operations
  const handleSaveActivity = async (act: ActivityLog) => {
    if (!user) return;
    try {
      const supabase = createClient();
      const saved = await createActivityLog(supabase, user.id, {
        ...act,
        childId: activeChild.id,
      });
      setActivities((prev) => [saved, ...prev]);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal menyimpan aktivitas.");
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!user) return;
    setActivities((prev) => prev.filter((a) => a.id !== id));
    try {
      const supabase = createClient();
      await deleteActivityLog(supabase, user.id, id);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal menghapus aktivitas.");
    }
  };

  // Vaccine operations
  const handleToggleVaccine = async (vacId: string) => {
    if (!user) return;
    const target = vaccines.find((v) => v.id === vacId);
    if (!target) return;

    const nextCompleted = !target.completed;
    const completedDate = nextCompleted
      ? new Date().toISOString().split("T")[0]
      : undefined;

    setVaccines((prev) =>
      prev.map((v) =>
        v.id === vacId ? { ...v, completed: nextCompleted, completedDate } : v
      )
    );

    try {
      const supabase = createClient();
      await upsertVaccineRecord(
        supabase,
        user.id,
        activeChild.id,
        vacId,
        nextCompleted,
        completedDate
      );
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal memperbarui status vaksin.");
    }
  };

  // Export / Import / Reset
  const handleExportData = () => {
    const exportObject = {
      exportedAt: new Date().toISOString(),
      child: activeChild,
      allChildren,
      caregiver,
      growthRecords,
      milestoneProgress,
      meals,
      allergies,
      activities,
      vaccines,
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `igrowth-data-${activeChild.nickname || "anak"}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (): boolean => {
    // Impor JSON lokal dinonaktifkan saat menggunakan penyimpanan cloud Supabase per akun
    setErrorBanner(
      "Data kini dikelola secara aman melalui akun Supabase Anda."
    );
    return false;
  };

  const handleResetData = async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const supabase = createClient();
      await clearUserData(supabase, user.id);
      await seedDemoDataForUser(supabase, user.id);
      await loadUserDashboard(user);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : "Gagal mereset data.");
    } finally {
      setDataLoading(false);
    }
  };

  // --- Auth & Loading Gates ---
  if (!authChecked) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-[#F5F8FC] text-sm text-[#738397]">
        Memuat sesi iGrowth...
      </main>
    );
  }

  if (!user) {
    return (
      <AuthView
        onAuthSuccess={() => {
          const supabase = createClient();
          supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
              setUser(data.user);
              loadUserDashboard(data.user);
            }
          });
        }}
      />
    );
  }

  if (dataLoading && allChildren.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-[#F5F8FC] text-sm text-[#738397]">
        Mengambil data tumbuh kembang dari Supabase...
      </main>
    );
  }

  // First-time user onboarding (no children in database yet)
  if (!dataLoading && allChildren.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-[#F5F8FC] px-6 py-10 text-[#263746]">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#263746]">
            i<span className="text-[#476B8E]">growth</span>
          </h1>
          <button
            onClick={handleSignOut}
            className="rounded-xl border border-[#E5EBF1] bg-white px-3 py-1.5 text-xs font-semibold text-[#738397] hover:text-[#263746]"
          >
            Keluar
          </button>
        </div>

        <div className="rounded-3xl border border-[#E5EBF1] bg-white p-6 shadow-xs">
          <h2 className="text-lg font-bold text-[#263746]">
            Selamat Datang di iGrowth
          </h2>
          <p className="mt-1 text-xs text-[#738397]">
            Tambahkan profil anak pertama Anda untuk mulai memantau tumbuh
            kembang di cloud.
          </p>

          {errorBanner && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {errorBanner}
            </div>
          )}

          <form onSubmit={handleCreateFirstChild} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#263746]">
                Nama Lengkap Anak
              </label>
              <input
                type="text"
                required
                value={onboardingName}
                onChange={(e) => setOnboardingName(e.target.value)}
                placeholder="Contoh: Eren Maulana"
                className="w-full rounded-xl border border-[#E5EBF1] bg-[#F5F8FC] px-3.5 py-2.5 text-sm outline-none focus:border-[#476B8E] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#263746]">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  value={onboardingNickname}
                  onChange={(e) => setOnboardingNickname(e.target.value)}
                  placeholder="Eren"
                  className="w-full rounded-xl border border-[#E5EBF1] bg-[#F5F8FC] px-3.5 py-2.5 text-sm outline-none focus:border-[#476B8E] focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#263746]">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  required
                  value={onboardingBirthDate}
                  onChange={(e) => setOnboardingBirthDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E5EBF1] bg-[#F5F8FC] px-3 py-2.5 text-sm outline-none focus:border-[#476B8E] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#263746]">
                Jenis Kelamin
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setOnboardingGender("male")}
                  className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                    onboardingGender === "male"
                      ? "border-[#476B8E] bg-[#EAF0F6] text-[#476B8E]"
                      : "border-[#E5EBF1] bg-white text-[#738397]"
                  }`}
                >
                  Laki-laki
                </button>
                <button
                  type="button"
                  onClick={() => setOnboardingGender("female")}
                  className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                    onboardingGender === "female"
                      ? "border-[#476B8E] bg-[#EAF0F6] text-[#476B8E]"
                      : "border-[#E5EBF1] bg-white text-[#738397]"
                  }`}
                >
                  Perempuan
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={onboardingSubmitting}
              className="w-full rounded-2xl bg-[#476B8E] py-3 text-sm font-semibold text-white hover:bg-[#3A5977] disabled:opacity-60"
            >
              {onboardingSubmitting ? "Menyimpan..." : "Simpan & Mulai"}
            </button>
          </form>

          <div className="mt-4 border-t border-[#E5EBF1] pt-4 text-center">
            <button
              type="button"
              disabled={onboardingSubmitting}
              onClick={handleLoadDemoData}
              className="text-xs font-semibold text-[#476B8E] hover:underline disabled:opacity-50"
            >
              Atau muat data contoh (Profil Eren) untuk eksplorasi
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Filter records to activeChild
  const childGrowthRecords = growthRecords.filter((r) => r.childId === activeChild.id);
  const childMeals = meals.filter((m) => m.childId === activeChild.id);
  const childAllergies = allergies.filter((a) => a.childId === activeChild.id);
  const childActivities = activities.filter((a) => a.childId === activeChild.id);

  // Pending milestone count for badge
  const pendingMilestonesCount = milestones
    .filter((m) => m.ageGroupMonths === 9)
    .filter((m) => {
      const p = milestoneProgress.find(
        (prog) => prog.childId === activeChild.id && prog.milestoneId === m.id
      );
      return p?.status !== "achieved";
    }).length;

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#F5F8FC] pb-24 text-[#263746] shadow-sm">
      {/* Upper Header with Caregiver and Settings */}
      <Header
        caregiver={caregiver}
        onOpenCaregiverModal={() => setIsCaregiverOpen(true)}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
        onLogoClick={() => setActiveTab("beranda")}
      />

      {errorBanner && (
        <div className="mx-4 mt-3 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
          <span>{errorBanner}</span>
          <button
            onClick={() => setErrorBanner(null)}
            className="ml-2 font-bold text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Tab Views */}
      <div className="animate-in fade-in duration-150">
        {activeTab === "beranda" && (
          <HomeTab
            child={activeChild}
            growthRecords={childGrowthRecords}
            milestones={milestones}
            milestoneProgress={milestoneProgress}
            activities={childActivities}
            meals={childMeals}
            onNavigateToTab={(tab, filterAge) => {
              setActiveTab(tab);
              if (filterAge) setMilestoneAgeFilter(filterAge);
            }}
            onOpenRecordGrowth={() => {
              setEditingGrowthRecord(null);
              setIsRecordGrowthOpen(true);
            }}
            onOpenRecordActivity={(type) => {
              setActivityTypeToRecord(type);
              setIsRecordActivityOpen(true);
            }}
            onOpenRecordMeal={() => setIsRecordMealOpen(true)}
          />
        )}

        {activeTab === "tumbuh" && (
          <GrowthMilestoneTab
            child={activeChild}
            milestones={milestones}
            progress={milestoneProgress}
            initialAgeGroupFilter={milestoneAgeFilter}
            onUpdateStatus={handleUpdateMilestoneStatus}
            onOpenStimulationModal={(item, status) => {
              setActiveStimulation({ milestone: item, status });
            }}
          />
        )}

        {activeTab === "ukur" && (
          <MeasurementTab
            child={activeChild}
            records={childGrowthRecords}
            onOpenAddRecord={() => {
              setEditingGrowthRecord(null);
              setIsRecordGrowthOpen(true);
            }}
            onEditRecord={(rec) => {
              setEditingGrowthRecord(rec);
              setIsRecordGrowthOpen(true);
            }}
            onDeleteRecord={handleDeleteGrowthRecord}
          />
        )}

        {activeTab === "mpasi" && (
          <MpasiTab
            child={activeChild}
            meals={childMeals}
            allergies={childAllergies}
            recipes={recipes}
            onOpenRecordMeal={() => setIsRecordMealOpen(true)}
            onOpenFoodAllergyModal={() => setIsFoodAllergyOpen(true)}
            onOpenRecipeDetail={(recipe) => setActiveRecipeDetail(recipe)}
            onDeleteMeal={handleDeleteMeal}
            onDeleteAllergy={handleDeleteAllergy}
          />
        )}

        {activeTab === "memo" && (
          <MemoTab
            child={activeChild}
            activities={childActivities}
            vaccines={vaccines}
            onOpenRecordActivity={(type = "milk") => {
              setActivityTypeToRecord(type);
              setIsRecordActivityOpen(true);
            }}
            onToggleVaccine={handleToggleVaccine}
            onDeleteActivity={handleDeleteActivity}
          />
        )}
      </div>

      {/* Bottom Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        milestonePendingCount={pendingMilestonesCount}
      />

      {/* MODALS */}
      {/* 1. Settings & Child Profile Modal */}
      <SettingsModal
        key={activeChild.id}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeChild={activeChild}
        allChildren={allChildren}
        onUpdateChild={handleUpdateChild}
        onSelectChild={handleSelectChild}
        onAddChild={handleAddChild}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onImportData={handleImportData}
        userEmail={user.email ?? undefined}
        onSignOut={handleSignOut}
      />

      {/* 2. Caregiver Profile Modal */}
      <CaregiverModal
        isOpen={isCaregiverOpen}
        onClose={() => setIsCaregiverOpen(false)}
        currentCaregiver={caregiver}
        onSaveCaregiver={handleSaveCaregiver}
      />

      {/* 3. Record Growth Modal */}
      <RecordGrowthModal
        isOpen={isRecordGrowthOpen}
        onClose={() => {
          setIsRecordGrowthOpen(false);
          setEditingGrowthRecord(null);
        }}
        child={activeChild}
        initialRecord={editingGrowthRecord}
        onSaveRecord={handleSaveGrowthRecord}
      />

      {/* 4. Record Activity Modal */}
      <RecordActivityModal
        isOpen={isRecordActivityOpen}
        onClose={() => setIsRecordActivityOpen(false)}
        child={activeChild}
        initialType={activityTypeToRecord}
        onSaveActivity={handleSaveActivity}
      />

      {/* 5. Record Meal MPASI Modal */}
      <RecordMealModal
        isOpen={isRecordMealOpen}
        onClose={() => setIsRecordMealOpen(false)}
        child={activeChild}
        onSaveMeal={handleSaveMeal}
      />

      {/* 6. Food Allergy / 3-Day Rule Modal */}
      <FoodAllergyModal
        isOpen={isFoodAllergyOpen}
        onClose={() => setIsFoodAllergyOpen(false)}
        child={activeChild}
        onSaveAllergy={handleSaveAllergy}
      />

      {/* 7. Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={activeRecipeDetail}
        onClose={() => setActiveRecipeDetail(null)}
        onCookRecipe={(recipe) => {
          handleSaveMeal({
            id: `meal-${Date.now()}`,
            childId: activeChild.id,
            date: new Date().toISOString().split("T")[0],
            time: "12:00",
            mealTime: "makan_siang",
            menuName: recipe.title,
            amountEaten: "habis",
            protein: recipe.ingredients[1] || "Protein Hewani",
            notes: "Memasak dari buku resep iGrowth",
          });
          setActiveRecipeDetail(null);
        }}
      />

      {/* 8. Stimulation & Milestone Detail Modal */}
      <StimulationModal
        milestone={activeStimulation ? activeStimulation.milestone : null}
        currentStatus={activeStimulation ? activeStimulation.status : "not_yet"}
        onClose={() => setActiveStimulation(null)}
        onUpdateStatus={(newStatus) => {
          if (activeStimulation) {
            handleUpdateMilestoneStatus(activeStimulation.milestone.id, newStatus);
            setActiveStimulation({
              ...activeStimulation,
              status: newStatus,
            });
          }
        }}
      />
    </main>
  );
}
