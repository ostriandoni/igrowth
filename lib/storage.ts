import {
  ChildProfile,
  CaregiverProfile,
  GrowthRecord,
  MilestoneItem,
  MilestoneProgress,
  MealRecord,
  FoodAllergyTest,
  MpasiRecipe,
  ActivityLog,
  VaccineScheduleItem,
} from "@/types";

export const DEFAULT_CHILD: ChildProfile = {
  id: "child-eren",
  name: "Eren Maulana",
  nickname: "Eren",
  birthDate: "2026-03-30",
  gender: "male",
  birthWeight: 3.2,
  birthHeight: 49.5,
  birthHeadCircumference: 34.0,
  bloodType: "O+",
  avatarIcon: "👶",
};

export const DEFAULT_CAREGIVER: CaregiverProfile = {
  id: "cg-1",
  role: "Ayah",
  name: "Dimas",
};

export const INITIAL_GROWTH_RECORDS: GrowthRecord[] = [
  {
    id: "gr-0",
    childId: "child-eren",
    date: "2026-03-30",
    ageMonths: 0,
    ageDays: 0,
    weight: 3.2,
    height: 49.5,
    headCircumference: 34.0,
    measurePosition: "recumbent",
    notes: "Pengukuran saat baru lahir di RS",
  },
  {
    id: "gr-1",
    childId: "child-eren",
    date: "2026-05-01",
    ageMonths: 1,
    ageDays: 2,
    weight: 4.4,
    height: 54.0,
    headCircumference: 37.0,
    measurePosition: "recumbent",
    notes: "Kontrol 1 bulan di Posyandu Melati",
  },
  {
    id: "gr-2",
    childId: "child-eren",
    date: "2026-06-30",
    ageMonths: 3,
    ageDays: 0,
    weight: 6.3,
    height: 61.0,
    headCircumference: 40.2,
    measurePosition: "recumbent",
    notes: "Vaksin DPT combo 1, BB naik bagus",
  },
  {
    id: "gr-3",
    childId: "child-eren",
    date: "2026-09-30",
    ageMonths: 6,
    ageDays: 0,
    weight: 7.8,
    height: 67.2,
    headCircumference: 43.1,
    measurePosition: "recumbent",
    notes: "Mulai MPASI hari pertama! Lahap sekali",
  },
  {
    id: "gr-4",
    childId: "child-eren",
    date: "2026-11-10",
    ageMonths: 7,
    ageDays: 11,
    weight: 8.35,
    height: 69.5,
    headCircumference: 44.0,
    measurePosition: "recumbent",
    notes: "Mulai belajar merangkak dan duduk mandiri",
  },
];

export const INITIAL_MILESTONES: MilestoneItem[] = [
  // 0-3 Bulan
  {
    id: "ms-0-1",
    ageGroup: "0-3 bln",
    ageGroupMonths: 3,
    category: "motorik_kasar",
    title: "Mengangkat kepala saat tengkurap (Tummy Time)",
    description: "Bayi mampu mengangkat kepala hingga 45° saat ditengkurapkan selama beberapa saat.",
    stimulationTips: "Lakukan tummy time 2-3 kali sehari di atas matras datar, letakkan mainan berbunyi di depan pandangannya.",
  },
  {
    id: "ms-0-2",
    ageGroup: "0-3 bln",
    ageGroupMonths: 3,
    category: "komunikasi",
    title: "Tersenyum responsif (Social Smile)",
    description: "Mulai membalas senyuman dan tatapan orang tua saat diajak bicara.",
    stimulationTips: "Ajak bicara dengan nada ramah lembut (motherese) dari jarak 20-30 cm.",
  },
  {
    id: "ms-0-3",
    ageGroup: "0-3 bln",
    ageGroupMonths: 3,
    category: "motorik_halus",
    title: "Membuka genggaman tangan",
    description: "Tangan tidak selalu mengepal rapat, sesekali terbuka dan berusaha meraih kain.",
    stimulationTips: "Berikan sentuhan lembut di telapak tangan dengan berbagai tekstur kain yang aman.",
  },

  // 4-6 Bulan
  {
    id: "ms-4-1",
    ageGroup: "4-6 bln",
    ageGroupMonths: 6,
    category: "motorik_kasar",
    title: "Berguling dari telentang ke tengkurap",
    description: "Mampu membalikkan badannya sendiri dari posisi telentang ke posisi tengkurap.",
    stimulationTips: "Pancing dengan mainan menarik di sisi samping agar anak terdorong memiringkan pinggul dan berguling.",
  },
  {
    id: "ms-4-2",
    ageGroup: "4-6 bln",
    ageGroupMonths: 6,
    category: "motorik_halus",
    title: "Memindahkan mainan antar kedua tangan",
    description: "Memegang kerincingan di satu tangan lalu memindahkannya ke tangan yang lain.",
    stimulationTips: "Beri mainan rattle ringan dan tawarkan benda baru saat satu tangannya sedang memegang benda.",
  },
  {
    id: "ms-4-3",
    ageGroup: "4-6 bln",
    ageGroupMonths: 6,
    category: "komunikasi",
    title: "Mengoceh vokal dan konsonan (Babbling 'ba-ba')",
    description: "Menghasilkan suara suku kata tunggal seperti ma, ba, da, gaga.",
    stimulationTips: "Tirukan ocehannya kembali dengan antusias seolah sedang berbincang dua arah.",
  },
  {
    id: "ms-4-4",
    ageGroup: "4-6 bln",
    ageGroupMonths: 6,
    category: "sosial_emosional",
    title: "Mengenali wajah orang terdekat & tertawa lepas",
    description: "Tertawa saat diajak cilukba atau digelitik lembut, membedakan ayah/ibu.",
    stimulationTips: "Mainkan cilukba menggunakan selimut tipis atau telapak tangan.",
  },
  {
    id: "ms-4-5",
    ageGroup: "4-6 bln",
    ageGroupMonths: 6,
    category: "motorik_kasar",
    title: "Duduk dengan sedikit ditopang atau bersandar",
    description: "Mampu mempertahankan posisi duduk tegak saat dipangku atau disangga bantal.",
    stimulationTips: "Latihan duduk di pangkuan sambil membaca buku bergambar tebal (board book).",
  },
  {
    id: "ms-4-6",
    ageGroup: "4-6 bln",
    ageGroupMonths: 6,
    category: "kognitif",
    title: "Mencari sumber suara di sampingnya",
    description: "Menolehkan kepala ke arah suara bel, panggilan nama, atau suara mainan.",
    stimulationTips: "Panggil namanya dari sisi kiri dan kanan secara bergantian.",
  },
  {
    id: "ms-4-7",
    ageGroup: "4-6 bln",
    ageGroupMonths: 6,
    category: "motorik_halus",
    title: "Memasukkan benda ke mulut (Fase Oral)",
    description: "Mengeksplorasi tangan dan teether dengan memasukkannya ke dalam mulut dengan koordinasi baik.",
    stimulationTips: "Sediakan teether bertekstur yang bersih dan BPA-free.",
  },

  // 7-9 Bulan (Fase Eren Sekarang!)
  {
    id: "ms-7-1",
    ageGroup: "7-9 bln",
    ageGroupMonths: 9,
    category: "motorik_kasar",
    title: "Duduk mandiri tanpa ditopang tangan",
    description: "Mampu duduk tegak di lantai tanpa menyangga dengan tangannya selama minimal 30 detik.",
    stimulationTips: "Dudukkan di karpet empuk, letakkan mainan di sekitar kaki agar tangannya bebas meraih.",
  },
  {
    id: "ms-7-2",
    ageGroup: "7-9 bln",
    ageGroupMonths: 9,
    category: "motorik_kasar",
    title: "Merayap di perut atau mulai merangkak",
    description: "Menggerakkan badan ke depan menggunakan dorongan tangan dan lutut.",
    stimulationTips: "Beri rintangan bantal rendah agar anak belajar mengangkat perut dan bergerak maju.",
  },
  {
    id: "ms-7-3",
    ageGroup: "7-9 bln",
    ageGroupMonths: 9,
    category: "motorik_halus",
    title: "Menjepit benda dengan ibu jari & telunjuk (Pincer Grasp)",
    description: "Mulai mengambil potongan kecil makanan finger food menggunakan jemari.",
    stimulationTips: "Sediakan potongan kukusan wortel atau labu lembut di piring tinggi kursi makan.",
  },
  {
    id: "ms-7-4",
    ageGroup: "7-9 bln",
    ageGroupMonths: 9,
    category: "komunikasi",
    title: "Merespons saat namanya dipanggil",
    description: "Langsung menoleh dan tersenyum ketika mendengar namanya diucapkan.",
    stimulationTips: "Gunakan nama panggilannya secara konsisten saat berinteraksi sehari-hari.",
  },
  {
    id: "ms-7-5",
    ageGroup: "7-9 bln",
    ageGroupMonths: 9,
    category: "sosial_emosional",
    title: "Cemas saat berpisah dari ibu/ayah (Stranger Anxiety)",
    description: "Menangis atau ragu saat didekati orang yang belum akrab, tanda ikatan kasih sayang kuat.",
    stimulationTips: "Beri rasa aman dengan pelukan hangat dan perkenalkan orang baru perlahan.",
  },
  {
    id: "ms-7-6",
    ageGroup: "7-9 bln",
    ageGroupMonths: 9,
    category: "kognitif",
    title: "Mencari benda yang disembunyikan (Object Permanence)",
    description: "Tahu bahwa mainan masih ada meski ditutup kain tipis dan berusaha membukanya.",
    stimulationTips: "Tutup sebagian mainan favorit dengan handuk kecil dan biarkan anak menariknya.",
  },
  {
    id: "ms-7-7",
    ageGroup: "7-9 bln",
    ageGroupMonths: 9,
    category: "komunikasi",
    title: "Melambaikan tangan 'Dadah' atau tepuk tangan",
    description: "Meniru gerakan lambaian selamat tinggal atau menepukkan kedua telapak tangan.",
    stimulationTips: "Ajak bernyanyi lagu 'Pok Ame-Ame' sambil mencontohkan tepuk tangan gembira.",
  },
  {
    id: "ms-7-8",
    ageGroup: "7-9 bln",
    ageGroupMonths: 9,
    category: "motorik_kasar",
    title: "Menarik diri untuk posisi berdiri (Pull to Stand)",
    description: "Berpegangan pada meja sofa atau pagar ranjang bayi untuk bangkit berdiri.",
    stimulationTips: "Pastikan furnitur kokoh dan bebas sudut tajam, dampingi saat anak mencoba bertumpu.",
  },
  {
    id: "ms-7-9",
    ageGroup: "7-9 bln",
    ageGroupMonths: 9,
    category: "motorik_halus",
    title: "Membenturkan dua benda menjadi satu",
    description: "Memegang dua balok mainan di masing-masing tangan lalu mengetukkannya.",
    stimulationTips: "Beri mainan balok kayu ringan atau sendok plastik untuk bereksplorasi suara ketukan.",
  },
  {
    id: "ms-7-10",
    ageGroup: "7-9 bln",
    ageGroupMonths: 9,
    category: "kognitif",
    title: "Memahami kata 'Tidak' atau intonasi larangan lembut",
    description: "Berhenti sejenak dan menatap wajah orang tua saat dibilang 'jangan/tidak'.",
    stimulationTips: "Ucapkan dengan intonasi jelas dan tenang tanpa membentak, alihkan ke aktivitas aman.",
  },

  // 10-12 Bulan
  {
    id: "ms-10-1",
    ageGroup: "10-12 bln",
    ageGroupMonths: 12,
    category: "motorik_kasar",
    title: "Berdiri sendiri beberapa detik tanpa berpegangan",
    description: "Mampu menjaga keseimbangan berdiri bebas tanpa ditopang.",
    stimulationTips: "Pancing dengan memberikan benda kesukaan di kedua tangannya saat ia berdiri.",
  },
  {
    id: "ms-10-2",
    ageGroup: "10-12 bln",
    ageGroupMonths: 12,
    category: "komunikasi",
    title: "Mengucapkan 1-2 kata bermakna (Mama/Papa)",
    description: "Menyebutkan kata spesifik ditujukan langsung ke orang yang tepat.",
    stimulationTips: "Sering ulangi kata mama dan papa secara jelas saat sedang menggendong.",
  },
];

export const INITIAL_MILESTONE_PROGRESS: MilestoneProgress[] = [
  { childId: "child-eren", milestoneId: "ms-0-1", status: "achieved" },
  { childId: "child-eren", milestoneId: "ms-0-2", status: "achieved" },
  { childId: "child-eren", milestoneId: "ms-0-3", status: "achieved" },
  { childId: "child-eren", milestoneId: "ms-4-1", status: "achieved" },
  { childId: "child-eren", milestoneId: "ms-4-2", status: "achieved" },
  { childId: "child-eren", milestoneId: "ms-4-3", status: "achieved" },
  { childId: "child-eren", milestoneId: "ms-4-4", status: "achieved" },
  { childId: "child-eren", milestoneId: "ms-4-5", status: "achieved" },
  { childId: "child-eren", milestoneId: "ms-4-6", status: "achieved" },
  { childId: "child-eren", milestoneId: "ms-4-7", status: "achieved" },
  // 7-9 bulan: sedang belajar & ada yang tercapai
  { childId: "child-eren", milestoneId: "ms-7-1", status: "achieved" }, // Duduk mandiri
  { childId: "child-eren", milestoneId: "ms-7-2", status: "learning" }, // Merayap/merangkak
  { childId: "child-eren", milestoneId: "ms-7-3", status: "learning" }, // Pincer grasp
  { childId: "child-eren", milestoneId: "ms-7-4", status: "achieved" }, // Merespons nama
  { childId: "child-eren", milestoneId: "ms-7-5", status: "learning" },
  { childId: "child-eren", milestoneId: "ms-7-6", status: "learning" },
  { childId: "child-eren", milestoneId: "ms-7-7", status: "not_yet" },
  { childId: "child-eren", milestoneId: "ms-7-8", status: "not_yet" },
  { childId: "child-eren", milestoneId: "ms-7-9", status: "learning" },
  { childId: "child-eren", milestoneId: "ms-7-10", status: "not_yet" },
];

export const INITIAL_RECIPES: MpasiRecipe[] = [
  {
    id: "rcp-1",
    title: "Bubur Hati Ayam Santan Gurih",
    ageRange: "6 - 8 Bulan",
    prepTime: "25 Menit",
    ironRich: true,
    highlight: "Sangat tinggi zat besi hewani untuk cegah anemia & dukung kecerdasan otak.",
    nutritionTags: ["Zat Besi Tinggi", "Lemak Sehat", "Tekstur Mashed Saring"],
    ingredients: [
      "3 sdm nasi putih matang",
      "40 gram hati ayam kampung (cuci bersih, lumuri jeruk nipis)",
      "1/2 butir telur puyuh",
      "1 batang buncis iris tipis",
      "1 sdm santan kental segar",
      "1 siung bawang putih & merah (geprek harum)",
      "1 sdt unsalted butter / minyak kelapa",
    ],
    instructions: [
      "Tumis bawang putih & merah dengan sedikit minyak hingga harum.",
      "Masukkan hati ayam, masak sampai berubah warna.",
      "Tambahkan air matang / kaldu ayam 150ml, masukkan nasi dan buncis.",
      "Masak dengan api kecil hingga air menyusut dan nasi menjadi bubur lembut.",
      "Tambahkan santan dan telur puyuh kocok, aduk rata selama 2 menit.",
      "Saring kawat atau lumatkan sesuai kemampuan mengunyah bayi 7-8 bulan (mashed/saring kasar).",
    ],
  },
  {
    id: "rcp-2",
    title: "Nasi Tim Daging Sapi Labu Kuning",
    ageRange: "7 - 9 Bulan",
    prepTime: "30 Menit",
    ironRich: true,
    highlight: "Kombinasi protein hewani daging sapi giling dengan manis alami labu kuning.",
    nutritionTags: ["Protein Hewani", "Vitamin A", "Zat Besi"],
    ingredients: [
      "4 sdm nasi putih",
      "40 gram daging sapi giling (cincang halus)",
      "30 gram labu kuning (potong dadu kecil)",
      "1 iris tempe (potong kecil)",
      "1 sdt minyak kelapa / evoo saat penyajian",
      "200 ml kaldu sapi homemade",
    ],
    instructions: [
      "Rebus kaldu sapi bersama daging giling hingga empuk.",
      "Masukkan nasi putih, labu kuning, dan potongan tempe.",
      "Aduk terus hingga teksturnya menjadi bubur tim kental lembut.",
      "Beri 1 sdt minyak kelapa / EVOO sebagai lemak tambahan sebelum disajikan hangat.",
    ],
  },
  {
    id: "rcp-3",
    title: "Puree Salmon Kentang Buttery",
    ageRange: "6 - 8 Bulan",
    prepTime: "20 Menit",
    ironRich: false,
    highlight: "Kaya Omega-3 DHA untuk perkembangan sel syaraf dan mata anak.",
    nutritionTags: ["Omega-3 DHA", "Karbo Kentang", "Halus Lumat"],
    ingredients: [
      "1 buah kentang ukuran sedang (kukus empuk)",
      "35 gram fillet ikan salmon segar (bebas duri)",
      "1 kuntum brokoli kukus",
      "1 sdt unsalted butter (UB)",
      "50 ml susu ASI / kaldu",
    ],
    instructions: [
      "Kukus kentang, salmon, dan brokoli hingga matang sempurna (sekitar 12 menit).",
      "Lumatkan kentang dan brokoli dengan garpu / saringan.",
      "Cincang halus salmon lalu campurkan ke dalam kentang.",
      "Aduk bersama unsalted butter dan sedikit ASI/kaldu hingga tekstur lumer creamy.",
    ],
  },
  {
    id: "rcp-4",
    title: "Finger Food: Stik Alpukat & Telur Kukus",
    ageRange: "8 - 11 Bulan",
    prepTime: "10 Menit",
    ironRich: false,
    highlight: "Melatih koordinasi jepitan jari (pincer grasp) dan kemampuan mengunyah.",
    nutritionTags: ["Finger Food", "Lemak Baik", "Snack Sehat"],
    ingredients: [
      "1/2 buah alpukat mentega matang (potong memanjang seukuran jari)",
      "1 butir telur ayam rebus matang (potong 4 memanjang)",
      "Taburan biskuit bayi yang dihancurkan agar tidak licin dipegang",
    ],
    instructions: [
      "Gulingkan stik alpukat pada remahan biskuit bayi agar si kecil mudah mencengkeramnya.",
      "Sajikan bersama irisan telur rebus di atas piring makan si kecil.",
      "Dampingi anak saat belajar memasukkan makanan mandiri ke mulut.",
    ],
  },
];

export const INITIAL_MEALS: MealRecord[] = [
  {
    id: "meal-1",
    childId: "child-eren",
    date: "2026-11-18",
    time: "07:30",
    mealTime: "sarapan",
    menuName: "Bubur Hati Ayam Santan Gurih",
    amountEaten: "habis",
    carbs: "Nasi",
    protein: "Hati Ayam & Telur Puyuh",
    vegetables: "Buncis",
    fat: "Santan & Butter",
    notes: "Makan sangat lahap, habis 1 mangkuk porsi 3 sdm!",
  },
  {
    id: "meal-2",
    childId: "child-eren",
    date: "2026-11-18",
    time: "10:00",
    mealTime: "snack_pagi",
    menuName: "Puree Pepaya Jeruk Manis",
    amountEaten: "tiga_perempat",
    carbs: "Buah Segar",
    notes: "Suka rasa manis segarnya.",
  },
  {
    id: "meal-3",
    childId: "child-eren",
    date: "2026-11-17",
    time: "12:30",
    mealTime: "makan_siang",
    menuName: "Nasi Tim Daging Sapi Labu Kuning",
    amountEaten: "habis",
    carbs: "Nasi Tim",
    protein: "Daging Sapi & Tempe",
    notes: "Duduk tenang di high chair.",
  },
  {
    id: "meal-4",
    childId: "child-eren",
    date: "2026-11-17",
    time: "18:00",
    mealTime: "makan_malam",
    menuName: "Bubur Salmon Brokoli",
    amountEaten: "setengah",
    notes: "Agak mengantuk menjelang waktu tidur malam.",
  },
];

export const INITIAL_ALLERGIES: FoodAllergyTest[] = [
  {
    id: "alg-1",
    childId: "child-eren",
    foodName: "Kuning Telur Ayam",
    introducedDate: "2026-10-02",
    dayCount: 3,
    status: "safe",
    reactionDescription: "Aman, tidak ada ruam kemerahan maupun diare.",
  },
  {
    id: "alg-2",
    childId: "child-eren",
    foodName: "Ikan Salmon",
    introducedDate: "2026-10-18",
    dayCount: 3,
    status: "safe",
    reactionDescription: "Toleransi baik, feses normal.",
  },
  {
    id: "alg-3",
    childId: "child-eren",
    foodName: "Udang Laut",
    introducedDate: "2026-11-12",
    dayCount: 2,
    status: "monitoring",
    reactionDescription: "Sedang dipantau hari ke-2 pengenalan bertahap.",
  },
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: "act-1",
    childId: "child-eren",
    date: "2026-11-18",
    time: "06:15",
    type: "milk",
    title: "Minum Susu ASI",
    details: {
      milkType: "breast_direct",
      durationMinutes: 20,
    },
    notes: "Bangun tidur langsung menyusu dengan tenang.",
  },
  {
    id: "act-2",
    childId: "child-eren",
    date: "2026-11-18",
    time: "07:00",
    type: "diaper",
    title: "Ganti Popok Bersih",
    details: {
      diaperType: "both",
      stoolColor: "Kuning kecoklatan",
      stoolConsistency: "normal",
    },
    notes: "BAB normal tekstur lembut setelah sarapan.",
  },
  {
    id: "act-3",
    childId: "child-eren",
    date: "2026-11-18",
    time: "09:00",
    type: "sleep",
    title: "Tidur Pagi (Morning Nap)",
    details: {
      sleepType: "day_nap",
      wakeTime: "10:15",
      durationFormatted: "1 jam 15 menit",
    },
    notes: "Tidur nyenyak di kamar ber-AC redup.",
  },
  {
    id: "act-4",
    childId: "child-eren",
    date: "2026-11-16",
    type: "moment",
    time: "16:45",
    title: "Tumbuh Gigi Pertama!",
    details: {
      momentTitle: "Gigi Seri Bawah Kanan Muncul",
      story: "Saat tersenyum terlihat ada bintik putih kecil menggemaskan di gusi bawahnya. Sudah mulai suka menggigit teether dingin.",
    },
  },
];

export const INITIAL_VACCINES: VaccineScheduleItem[] = [
  {
    id: "vac-0",
    name: "Hepatitis B (0 Bulan)",
    recommendedAgeMonths: 0,
    description: "Diberikan < 24 jam setelah lahir untuk cegah hepatitis B.",
    isMandatory: true,
    completed: true,
    completedDate: "2026-03-30",
  },
  {
    id: "vac-1",
    name: "BCG & Polio 1 (1 Bulan)",
    recommendedAgeMonths: 1,
    description: "Mencegah tuberkulosis (TBC) berat dan polio kelumpuhan.",
    isMandatory: true,
    completed: true,
    completedDate: "2026-05-02",
  },
  {
    id: "vac-2",
    name: "DPT-HB-Hib 1, Polio 2, PCV 1, Rotavirus 1 (2 Bulan)",
    recommendedAgeMonths: 2,
    description: "Mencegah difteri, tetanus, pertusis, radang paru pneumonia, & diare rotavirus.",
    isMandatory: true,
    completed: true,
    completedDate: "2026-06-03",
  },
  {
    id: "vac-3",
    name: "DPT-HB-Hib 2, Polio 3, PCV 2, Rotavirus 2 (3 Bulan)",
    recommendedAgeMonths: 3,
    description: "Imunisasi lanjutan dosis kedua.",
    isMandatory: true,
    completed: true,
    completedDate: "2026-07-05",
  },
  {
    id: "vac-4",
    name: "DPT-HB-Hib 3, Polio 4 / IPV, Rotavirus 3 (4 Bulan)",
    recommendedAgeMonths: 4,
    description: "Imunisasi lanjutan dosis ketiga pelindung lengkap.",
    isMandatory: true,
    completed: true,
    completedDate: "2026-08-08",
  },
  {
    id: "vac-5",
    name: "Influenza 1 (6 Bulan)",
    recommendedAgeMonths: 6,
    description: "Dosis pertama vaksin flu tahunan anak.",
    isMandatory: false,
    completed: true,
    completedDate: "2026-10-05",
  },
  {
    id: "vac-6",
    name: "Campak Rubella (MR 1) / PCV 3 (9 Bulan)",
    recommendedAgeMonths: 9,
    description: "Perlindungan primer terhadap campak dan gondongan rubella.",
    isMandatory: true,
    completed: false,
  },
  {
    id: "vac-7",
    name: "Japanese Encephalitis (JE) (10 Bulan)",
    recommendedAgeMonths: 10,
    description: "Mencegah radang otak virus JE untuk daerah endemis.",
    isMandatory: false,
    completed: false,
  },
  {
    id: "vac-8",
    name: "Varisela & Hepatitis A (12 Bulan)",
    recommendedAgeMonths: 12,
    description: "Mencegah cacar air dan infeksi hati hepatitis A.",
    isMandatory: false,
    completed: false,
  },
];

// LocalStorage Keys
const STORAGE_KEYS = {
  CHILD_PROFILE: "igrowth_child_profile",
  ALL_CHILDREN: "igrowth_all_children",
  CAREGIVER: "igrowth_caregiver",
  GROWTH_RECORDS: "igrowth_growth_records",
  MILESTONE_PROGRESS: "igrowth_milestone_progress",
  MEALS: "igrowth_meals",
  ALLERGIES: "igrowth_allergies",
  ACTIVITIES: "igrowth_activities",
  VACCINES: "igrowth_vaccines",
};

// Safe LocalStorage helpers
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (e) {
    console.error("Failed to load from localStorage", key, e);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save to localStorage", key, e);
  }
}

// Age calculator
export const DEFAULT_CURRENT_DATE = "2026-11-18";

export function getTodayDateString(): string {
  if (typeof window === "undefined") {
    return DEFAULT_CURRENT_DATE;
  }
  return new Date().toISOString().split("T")[0];
}

export interface AgeDetails {
  totalMonths: number;
  totalDays: number;
  years: number;
  months: number;
  days: number;
  ageString: string;
  nextTargetAgeMonths: number;
  daysUntilNextTarget: number;
}

export function calculateAge(birthDateString: string, targetDate?: Date | string): AgeDetails {
  const birth = new Date(birthDateString);
  const now = targetDate
    ? typeof targetDate === "string"
      ? new Date(targetDate)
      : targetDate
    : typeof window === "undefined"
    ? new Date(DEFAULT_CURRENT_DATE)
    : new Date();

  // Pastikan tanggal valid
  if (isNaN(birth.getTime())) {
    return {
      totalMonths: 7,
      totalDays: 231,
      years: 0,
      months: 7,
      days: 18,
      ageString: "7 bulan 18 hari",
      nextTargetAgeMonths: 9,
      daysUntilNextTarget: 43,
    };
  }

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    // Hitung hari di bulan sebelumnya
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMonths = years * 12 + months;
  const diffTime = Math.max(0, now.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let ageString = "";
  if (years > 0) {
    ageString += `${years} tahun `;
  }
  ageString += `${months} bulan ${days} hari`;

  // Target usia berikutnya (misal: jika < 3 -> 3, < 6 -> 6, < 9 -> 9, < 12 -> 12, dst)
  const targets = [3, 6, 9, 12, 18, 24, 36];
  const nextTargetAgeMonths = targets.find((t) => t > totalMonths) || totalMonths + 6;

  // Tanggal tercapainya target
  const nextTargetDate = new Date(birth);
  nextTargetDate.setMonth(birth.getMonth() + nextTargetAgeMonths);
  const msDiff = nextTargetDate.getTime() - now.getTime();
  const daysUntilNextTarget = Math.max(1, Math.ceil(msDiff / (1000 * 60 * 60 * 24)));

  return {
    totalMonths,
    totalDays,
    years,
    months,
    days,
    ageString: ageString.trim(),
    nextTargetAgeMonths,
    daysUntilNextTarget,
  };
}

export function formatIndonesianDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export { STORAGE_KEYS };
