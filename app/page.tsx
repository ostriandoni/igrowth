"use client";

import React, { useState, useEffect } from "react";
import {
  ActiveTab,
  ActivityLog,
  ActivityType,
  CaregiverProfile,
  ChildProfile,
  FoodAllergyTest,
  GrowthRecord,
  MealRecord,
  MilestoneItem,
  MilestoneProgress,
  MilestoneStatus,
  MpasiRecipe,
  VaccineScheduleItem,
} from "@/types";
import {
  DEFAULT_CHILD,
  DEFAULT_CAREGIVER,
  INITIAL_GROWTH_RECORDS,
  INITIAL_MILESTONES,
  INITIAL_MILESTONE_PROGRESS,
  INITIAL_MEALS,
  INITIAL_ALLERGIES,
  INITIAL_ACTIVITIES,
  INITIAL_VACCINES,
  INITIAL_RECIPES,
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
} from "@/lib/storage";

// Components
import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";

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

  // State with safe client-side hydration
  const [activeChild, setActiveChild] = useState<ChildProfile>(DEFAULT_CHILD);
  const [allChildren, setAllChildren] = useState<ChildProfile[]>([DEFAULT_CHILD]);
  const [caregiver, setCaregiver] = useState<CaregiverProfile>(DEFAULT_CAREGIVER);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>(INITIAL_GROWTH_RECORDS);
  const [milestones] = useState<MilestoneItem[]>(INITIAL_MILESTONES);
  const [milestoneProgress, setMilestoneProgress] = useState<MilestoneProgress[]>(
    INITIAL_MILESTONE_PROGRESS
  );
  const [meals, setMeals] = useState<MealRecord[]>(INITIAL_MEALS);
  const [allergies, setAllergies] = useState<FoodAllergyTest[]>(INITIAL_ALLERGIES);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);
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

  // Load from localStorage on client mount
  useEffect(() => {
    setActiveChild(loadFromStorage(STORAGE_KEYS.CHILD_PROFILE, DEFAULT_CHILD));
    setAllChildren(loadFromStorage(STORAGE_KEYS.ALL_CHILDREN, [DEFAULT_CHILD]));
    setCaregiver(loadFromStorage(STORAGE_KEYS.CAREGIVER, DEFAULT_CAREGIVER));
    setGrowthRecords(loadFromStorage(STORAGE_KEYS.GROWTH_RECORDS, INITIAL_GROWTH_RECORDS));
    setMilestoneProgress(loadFromStorage(STORAGE_KEYS.MILESTONE_PROGRESS, INITIAL_MILESTONE_PROGRESS));
    setMeals(loadFromStorage(STORAGE_KEYS.MEALS, INITIAL_MEALS));
    setAllergies(loadFromStorage(STORAGE_KEYS.ALLERGIES, INITIAL_ALLERGIES));
    setActivities(loadFromStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES));
    setVaccines(loadFromStorage(STORAGE_KEYS.VACCINES, INITIAL_VACCINES));
  }, []);

  // Save changes to localStorage
  const handleUpdateChild = (updated: ChildProfile) => {
    setActiveChild(updated);
    saveToStorage(STORAGE_KEYS.CHILD_PROFILE, updated);

    const updatedList = allChildren.map((c) => (c.id === updated.id ? updated : c));
    setAllChildren(updatedList);
    saveToStorage(STORAGE_KEYS.ALL_CHILDREN, updatedList);
  };

  const handleSelectChild = (childId: string) => {
    const selected = allChildren.find((c) => c.id === childId);
    if (selected) {
      setActiveChild(selected);
      saveToStorage(STORAGE_KEYS.CHILD_PROFILE, selected);
    }
  };

  const handleAddChild = (newChild: ChildProfile) => {
    const updatedList = [...allChildren, newChild];
    setAllChildren(updatedList);
    saveToStorage(STORAGE_KEYS.ALL_CHILDREN, updatedList);
    setActiveChild(newChild);
    saveToStorage(STORAGE_KEYS.CHILD_PROFILE, newChild);
  };

  const handleSaveCaregiver = (newCg: CaregiverProfile) => {
    setCaregiver(newCg);
    saveToStorage(STORAGE_KEYS.CAREGIVER, newCg);
  };

  // Growth record operations
  const handleSaveGrowthRecord = (rec: GrowthRecord) => {
    let updated: GrowthRecord[];
    const exists = growthRecords.some((r) => r.id === rec.id);
    if (exists) {
      updated = growthRecords.map((r) => (r.id === rec.id ? rec : r));
    } else {
      updated = [...growthRecords, rec];
    }
    setGrowthRecords(updated);
    saveToStorage(STORAGE_KEYS.GROWTH_RECORDS, updated);
    setEditingGrowthRecord(null);
  };

  const handleDeleteGrowthRecord = (id: string) => {
    const updated = growthRecords.filter((r) => r.id !== id);
    setGrowthRecords(updated);
    saveToStorage(STORAGE_KEYS.GROWTH_RECORDS, updated);
  };

  // Milestone operations
  const handleUpdateMilestoneStatus = (milestoneId: string, status: MilestoneStatus) => {
    const existingIndex = milestoneProgress.findIndex(
      (p) => p.childId === activeChild.id && p.milestoneId === milestoneId
    );
    let updated: MilestoneProgress[];
    if (existingIndex >= 0) {
      updated = [...milestoneProgress];
      updated[existingIndex] = {
        ...updated[existingIndex],
        status,
        achievedDate: status === "achieved" ? new Date().toISOString().split("T")[0] : undefined,
      };
    } else {
      updated = [
        ...milestoneProgress,
        {
          childId: activeChild.id,
          milestoneId,
          status,
          achievedDate: status === "achieved" ? new Date().toISOString().split("T")[0] : undefined,
        },
      ];
    }
    setMilestoneProgress(updated);
    saveToStorage(STORAGE_KEYS.MILESTONE_PROGRESS, updated);
  };

  // Meal operations
  const handleSaveMeal = (meal: MealRecord) => {
    const updated = [meal, ...meals];
    setMeals(updated);
    saveToStorage(STORAGE_KEYS.MEALS, updated);
  };

  const handleDeleteMeal = (id: string) => {
    const updated = meals.filter((m) => m.id !== id);
    setMeals(updated);
    saveToStorage(STORAGE_KEYS.MEALS, updated);
  };

  // Allergy operations
  const handleSaveAllergy = (alg: FoodAllergyTest) => {
    const updated = [alg, ...allergies];
    setAllergies(updated);
    saveToStorage(STORAGE_KEYS.ALLERGIES, updated);
  };

  const handleDeleteAllergy = (id: string) => {
    const updated = allergies.filter((a) => a.id !== id);
    setAllergies(updated);
    saveToStorage(STORAGE_KEYS.ALLERGIES, updated);
  };

  // Activity operations
  const handleSaveActivity = (act: ActivityLog) => {
    const updated = [act, ...activities];
    setActivities(updated);
    saveToStorage(STORAGE_KEYS.ACTIVITIES, updated);
  };

  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter((a) => a.id !== id);
    setActivities(updated);
    saveToStorage(STORAGE_KEYS.ACTIVITIES, updated);
  };

  // Vaccine operations
  const handleToggleVaccine = (vacId: string) => {
    const updated = vaccines.map((v) => {
      if (v.id === vacId) {
        const nextCompleted = !v.completed;
        return {
          ...v,
          completed: nextCompleted,
          completedDate: nextCompleted ? new Date().toISOString().split("T")[0] : undefined,
        };
      }
      return v;
    });
    setVaccines(updated);
    saveToStorage(STORAGE_KEYS.VACCINES, updated);
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

  const handleImportData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.child) {
        setActiveChild(data.child);
        saveToStorage(STORAGE_KEYS.CHILD_PROFILE, data.child);
      }
      if (Array.isArray(data.allChildren)) {
        setAllChildren(data.allChildren);
        saveToStorage(STORAGE_KEYS.ALL_CHILDREN, data.allChildren);
      }
      if (data.caregiver) {
        setCaregiver(data.caregiver);
        saveToStorage(STORAGE_KEYS.CAREGIVER, data.caregiver);
      }
      if (Array.isArray(data.growthRecords)) {
        setGrowthRecords(data.growthRecords);
        saveToStorage(STORAGE_KEYS.GROWTH_RECORDS, data.growthRecords);
      }
      if (Array.isArray(data.milestoneProgress)) {
        setMilestoneProgress(data.milestoneProgress);
        saveToStorage(STORAGE_KEYS.MILESTONE_PROGRESS, data.milestoneProgress);
      }
      if (Array.isArray(data.meals)) {
        setMeals(data.meals);
        saveToStorage(STORAGE_KEYS.MEALS, data.meals);
      }
      if (Array.isArray(data.allergies)) {
        setAllergies(data.allergies);
        saveToStorage(STORAGE_KEYS.ALLERGIES, data.allergies);
      }
      if (Array.isArray(data.activities)) {
        setActivities(data.activities);
        saveToStorage(STORAGE_KEYS.ACTIVITIES, data.activities);
      }
      if (Array.isArray(data.vaccines)) {
        setVaccines(data.vaccines);
        saveToStorage(STORAGE_KEYS.VACCINES, data.vaccines);
      }
      return true;
    } catch (e) {
      console.error("Import error", e);
      return false;
    }
  };

  const handleResetData = () => {
    setActiveChild(DEFAULT_CHILD);
    setAllChildren([DEFAULT_CHILD]);
    setCaregiver(DEFAULT_CAREGIVER);
    setGrowthRecords(INITIAL_GROWTH_RECORDS);
    setMilestoneProgress(INITIAL_MILESTONE_PROGRESS);
    setMeals(INITIAL_MEALS);
    setAllergies(INITIAL_ALLERGIES);
    setActivities(INITIAL_ACTIVITIES);
    setVaccines(INITIAL_VACCINES);

    saveToStorage(STORAGE_KEYS.CHILD_PROFILE, DEFAULT_CHILD);
    saveToStorage(STORAGE_KEYS.ALL_CHILDREN, [DEFAULT_CHILD]);
    saveToStorage(STORAGE_KEYS.CAREGIVER, DEFAULT_CAREGIVER);
    saveToStorage(STORAGE_KEYS.GROWTH_RECORDS, INITIAL_GROWTH_RECORDS);
    saveToStorage(STORAGE_KEYS.MILESTONE_PROGRESS, INITIAL_MILESTONE_PROGRESS);
    saveToStorage(STORAGE_KEYS.MEALS, INITIAL_MEALS);
    saveToStorage(STORAGE_KEYS.ALLERGIES, INITIAL_ALLERGIES);
    saveToStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    saveToStorage(STORAGE_KEYS.VACCINES, INITIAL_VACCINES);
  };

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

      {/* Main Tab Views */}
      <div className="animate-in fade-in duration-150">
        {activeTab === "beranda" && (
          <HomeTab
            child={activeChild}
            growthRecords={growthRecords}
            milestones={milestones}
            milestoneProgress={milestoneProgress}
            activities={activities}
            meals={meals}
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
            records={growthRecords}
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
            meals={meals}
            allergies={allergies}
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
            activities={activities}
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
