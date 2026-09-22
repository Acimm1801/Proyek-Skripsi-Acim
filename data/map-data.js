/* =========================================================
   FT UISU EXPLORER
   DATABASE + MODEL DATABASE + NAVIGATION GRAPH
   REVISION 26
========================================================= */

export const MAP_WIDTH = 551;
export const MAP_HEIGHT = 544;


/* =========================================================
   DATABASE GEDUNG + MODEL 3D
========================================================= */

export const buildings = [

    /* =====================================================
       GEDUNG BIRO FAKULTAS TEKNIK
       FT berada di lantai 2.
       Model 3D: Outdoor + Indoor
    ===================================================== */

    {
        id: "biro-ft",

        name: "Gedung Biro Fakultas Teknik",

        shortName: "Biro FT",

        description:
            "Gedung Biro Fakultas Teknik berada di lantai 2 pada gedung yang sama dengan Fakultas Agama Islam di lantai 1 dan Fakultas Sastra di lantai 3.",

        actualFloor: 2,

        floorCount: 1,

        mapMarker: {
            x: 468,
            y: 323
        },

        entrances: [
            {
                id: "biro-main",
                x: 449,
                y: 290
            }
        ],

        defaultModel: "outdoor",

        models: [

            {
                id: "outdoor",

                name: "Outdoor",

                label:
                    "Gedung Biro Fakultas Teknik - Outdoor",

                src:
                    "./assets/models/gedung_biro_outdoor.glb"
            },

            {
                id: "indoor",

                name: "Indoor",

                label:
                    "Gedung Biro Fakultas Teknik - Indoor",

                src:
                    "./assets/models/gedung_biro_indoor.glb"
            }

        ]
    },


    /* =====================================================
       PERPUSTAKAAN FAKULTAS TEKNIK
       Lantai 1
       Model 3D: Indoor
    ===================================================== */

    {
        id: "perpustakaan-ft",

        name:
            "Perpustakaan Fakultas Teknik",

        shortName:
            "Perpustakaan FT",

        description:
            "Perpustakaan Fakultas Teknik berada di lantai 1 pada gedung yang berbeda dan terletak di sudut seberang lapangan.",

        actualFloor: 1,

        floorCount: 1,

        mapMarker: {
            x: 488,
            y: 152
        },

        entrances: [
            {
                id: "library-main",
                x: 490,
                y: 185
            }
        ],

        defaultModel: "indoor",

        models: [

            {
                id: "indoor",

                name: "Indoor",

                label:
                    "Perpustakaan Fakultas Teknik - Indoor",

                src:
                    "./assets/models/perpustakaan_indoor.glb"
            }

        ]
    },


    /* =====================================================
       GEDUNG SERBAGUNA FAKULTAS TEKNIK
       Lantai 1
       Model 3D: Indoor
    ===================================================== */

    {
        id: "serbaguna-ft",

        name:
            "Gedung Serbaguna Fakultas Teknik",

        shortName:
            "Serbaguna FT",

        description:
            "Gedung Serbaguna Fakultas Teknik berada di lantai 1 pada gedung yang berbeda yaitu gedung Fakultas Hukum.",

        actualFloor: 1,

        floorCount: 1,

        mapMarker: {
            x: 390,
            y: 87
        },

        entrances: [
            {
                id: "serbaguna-main",
                x: 390,
                y: 120
            }
        ],

        defaultModel: "indoor",

        models: [

            {
                id: "indoor",

                name: "Indoor",

                label:
                    "Gedung Serbaguna Fakultas Teknik - Indoor",

                src:
                    "./assets/models/serbaguna_indoor.glb"
            }

        ]
    },


    /* =====================================================
       GEDUNG PERKULIAHAN FAKULTAS TEKNIK
       Fakultas Teknik berada di lantai 3.
       Model 3D: Outdoor + Indoor
    ===================================================== */

    {
        id: "perkuliahan-ft",

        name:
            "Gedung Perkuliahan Fakultas Teknik",

        shortName:
            "Perkuliahan FT",

        description:
            "Gedung Perkuliahan Fakultas Teknik berada di lantai 3 pada gedung yang terletak di seberang Gedung Biro Fakultas Teknik.",

        actualFloor: 3,

        floorCount: 1,

        mapMarker: {
            x: 316,
            y: 357
        },

        entrances: [
            {
                id: "class-main",
                x: 303,
                y: 307
            }
        ],

        defaultModel: "outdoor",

        models: [

            {
                id: "outdoor",

                name: "Outdoor",

                label:
                    "Gedung Perkuliahan Fakultas Teknik - Outdoor",

                src:
                    "./assets/models/gedung_perkuliahan_outdoor.glb"
            },

            {
                id: "indoor",

                name: "Indoor",

                label:
                    "Gedung Perkuliahan Fakultas Teknik - Indoor",

                src:
                    "./assets/models/gedung_perkuliahan_indoor.glb"
            }

        ]
    },


    /* =====================================================
       GEDUNG LABORATORIUM FAKULTAS TEKNIK
       3 lantai
       Model 3D: Outdoor
    ===================================================== */

    {
        id: "laboratorium-ft",

        name:
            "Gedung Laboratorium Fakultas Teknik",

        shortName:
            "Laboratorium FT",

        description:
            "Gedung Laboratorium Fakultas Teknik terdiri dari tiga lantai dan berada di dekat Gedung Perkuliahan Fakultas Teknik.",

        actualFloor: null,

        floorCount: 3,

        mapMarker: {
            x: 329,
            y: 466
        },

        entrances: [

            {
                id: "lab-north",
                x: 243,
                y: 370
            },

            {
                id: "lab-west",
                x: 243,
                y: 454
            },

            {
                id: "lab-south",
                x: 360,
                y: 507
            }

        ],

        defaultModel: "outdoor",

        models: [

            {
                id: "outdoor",

                name: "Outdoor",

                label:
                    "Gedung Laboratorium Fakultas Teknik - Outdoor",

                src:
                    "./assets/models/gedung_laboratorium.glb"
            }

        ]
    }

];


/* =========================================================
   DATABASE RUANGAN
========================================================= */

export const rooms = [

    /* =====================================================
       GEDUNG BIRO FT — LANTAI 2
    ===================================================== */

    {
        id: "gudang-mini",
        name: "Gudang Mini",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "prodi-industri",
        name: "Program Studi Teknik Industri",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "prodi-mesin",
        name: "Program Studi Teknik Mesin",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "prodi-sipil",
        name: "Program Studi Teknik Sipil",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "prodi-informatika",
        name: "Program Studi Teknik Informatika",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "prodi-elektro",
        name: "Program Studi Teknik Elektro",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "lpmf",
        name: "LPMF",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "wd3-kak",
        name: "WD3-KAK",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "wd2-stk",
        name: "WD2-STK",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "wd1-adi",
        name: "WD1-ADI",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "ruang-dekan",
        name: "Ruang Dekan",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "loket-pembayaran",
        name: "Loket Pembayaran Mahasiswa",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "kasubbag-akademik",
        name: "KaSubBag Akademik IT dan Kerjasama",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "kasubbag-keuangan",
        name: "KaSubBag Keuangan",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "kasubbag-kemahasiswaan",
        name: "KaSubBag Kemahasiswaan",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "kasubbag-siakad",
        name: "KaSubBag SIAKAD",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "ktu",
        name: "KTU",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "kasubbag-umum",
        name: "KaSubBag Umum Perlengkapan Kerumahtanggaan",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "mushola",
        name: "Mushola",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "dapur",
        name: "Dapur",
        buildingId: "biro-ft",
        floor: 2
    },

    {
        id: "toilet-biro",
        name: "Toilet",
        buildingId: "biro-ft",
        floor: 2
    },


    /* =====================================================
       GEDUNG PERKULIAHAN — LANTAI 3
    ===================================================== */

    {
        id: "ruang-kuliah-1",
        name: "Ruang Kuliah 1",
        buildingId: "perkuliahan-ft",
        floor: 3
    },

    {
        id: "ruang-kuliah-2",
        name: "Ruang Kuliah 2",
        buildingId: "perkuliahan-ft",
        floor: 3
    },

    {
        id: "ruang-kuliah-3",
        name: "Ruang Kuliah 3",
        buildingId: "perkuliahan-ft",
        floor: 3
    },

    {
        id: "ruang-kuliah-4",
        name: "Ruang Kuliah 4",
        buildingId: "perkuliahan-ft",
        floor: 3
    },

    {
        id: "ruang-kuliah-5",
        name: "Ruang Kuliah 5",
        buildingId: "perkuliahan-ft",
        floor: 3
    },

    {
        id: "ruang-kuliah-6",
        name: "Ruang Kuliah 6",
        buildingId: "perkuliahan-ft",
        floor: 3
    },

    {
        id: "ruang-kuliah-7",
        name: "Ruang Kuliah 7",
        buildingId: "perkuliahan-ft",
        floor: 3
    },

    {
        id: "ruang-kuliah-8",
        name: "Ruang Kuliah 8",
        buildingId: "perkuliahan-ft",
        floor: 3
    },


    /* =====================================================
       LABORATORIUM — LANTAI 1
    ===================================================== */

    {
        id: "lab-foundry",
        name: "Lab. Foundry",
        buildingId: "laboratorium-ft",
        floor: 1
    },

    {
        id: "lab-teknologi-mekanik",
        name: "Lab. Teknologi Mekanik",
        buildingId: "laboratorium-ft",
        floor: 1
    },

    {
        id: "lab-beton",
        name: "Lab. Beton",
        buildingId: "laboratorium-ft",
        floor: 1
    },

    {
        id: "lab-mekanika-tanah",
        name: "Lab. Mekanika Tanah",
        buildingId: "laboratorium-ft",
        floor: 1
    },

    {
        id: "lab-jalan-raya",
        name: "Lab. Jalan Raya",
        buildingId: "laboratorium-ft",
        floor: 1
    },

    {
        id: "lab-hidrolika",
        name: "Lab. Hidrolika",
        buildingId: "laboratorium-ft",
        floor: 1
    },


    /* =====================================================
       LABORATORIUM — LANTAI 2
    ===================================================== */

    {
        id: "lab-rangkaian-listrik",
        name: "Lab. Rangkaian Listrik",
        buildingId: "laboratorium-ft",
        floor: 2
    },

    {
        id: "lab-dasar-elektronika",
        name: "Lab. Dasar Elektronika",
        buildingId: "laboratorium-ft",
        floor: 2
    },

    {
        id: "lab-sistem-pengukuran",
        name: "Lab. Sistem Pengukuran",
        buildingId: "laboratorium-ft",
        floor: 2
    },

    {
        id: "lab-pengukuran-listrik",
        name: "Lab. Pengukuran Listrik",
        buildingId: "laboratorium-ft",
        floor: 2
    },

    {
        id: "lab-dasar-telekomunikasi",
        name: "Lab. Dasar Sistem Telekomunikasi",
        buildingId: "laboratorium-ft",
        floor: 2
    },

    {
        id: "lab-ilmu-ukur-tanah",
        name: "Lab. Ilmu Ukur Tanah",
        buildingId: "laboratorium-ft",
        floor: 2
    },

    {
        id: "lab-komputasi",
        name: "Lab. Komputasi",
        buildingId: "laboratorium-ft",
        floor: 2
    },

    {
        id: "lab-pengukuran-statistik",
        name: "Lab. Pengukuran & Statistik",
        buildingId: "laboratorium-ft",
        floor: 2
    },

    {
        id: "lab-faktor-manusia",
        name: "Lab. Teknik Faktor Manusia",
        buildingId: "laboratorium-ft",
        floor: 2
    },

    {
        id: "lab-jaringan-komputer-mikro",
        name: "Lab. Jaringan Komputer Mikro",
        buildingId: "laboratorium-ft",
        floor: 2
    },

    {
        id: "ruang-kuliah-9",
        name: "Ruang Kuliah 9",
        buildingId: "laboratorium-ft",
        floor: 2
    },

    {
        id: "ruang-kuliah-10",
        name: "Ruang Kuliah 10",
        buildingId: "laboratorium-ft",
        floor: 2
    },


    /* =====================================================
       LABORATORIUM — LANTAI 3
    ===================================================== */

    {
        id: "ruang-kuliah-11",
        name: "Ruang Kuliah 11",
        buildingId: "laboratorium-ft",
        floor: 3
    },

    {
        id: "ruang-kuliah-12",
        name: "Ruang Kuliah 12",
        buildingId: "laboratorium-ft",
        floor: 3
    },

    {
        id: "ruang-kuliah-13",
        name: "Ruang Kuliah 13",
        buildingId: "laboratorium-ft",
        floor: 3
    },

    {
        id: "lab-sistem-digital",
        name: "Lab. Sistem Digital",
        buildingId: "laboratorium-ft",
        floor: 3
    },

    {
        id: "lab-teknik-produksi",
        name: "Lab. Teknik Produksi",
        buildingId: "laboratorium-ft",
        floor: 3
    },

    {
        id: "lab-menggambar",
        name: "Lab. Menggambar",
        buildingId: "laboratorium-ft",
        floor: 3
    }

];


/* =========================================================
   GRAPH NAVIGASI SEMENTARA
   TETAP DIPERTAHANKAN SAMPAI DENAH FINAL DIBERIKAN
========================================================= */

export const routeNodes = {

    GATE_IN: {
        x: 34,
        y: 286
    },

    GATE_MID: {
        x: 143,
        y: 286
    },

    CENTER: {
        x: 278,
        y: 286
    },

    TOP_MAIN: {
        x: 282,
        y: 120
    },

    GATE_EXIT: {
        x: 282,
        y: 36
    },

    SERBAGUNA: {
        x: 390,
        y: 120
    },

    TOP_RIGHT: {
        x: 535,
        y: 120
    },

    LIB_CORNER: {
        x: 535,
        y: 185
    },

    LIBRARY: {
        x: 490,
        y: 185
    },

    COURT_TOP: {
        x: 355,
        y: 286
    },

    BIRO: {
        x: 449,
        y: 290
    },

    COURT_BOTTOM: {
        x: 355,
        y: 397
    },

    LAB_RIGHT: {
        x: 418,
        y: 397
    },

    LAB_RIGHT_BOTTOM: {
        x: 418,
        y: 507
    },

    LAB_SOUTH: {
        x: 360,
        y: 507
    },

    LAB_LEFT_BOTTOM: {
        x: 243,
        y: 507
    },

    LAB_WEST: {
        x: 243,
        y: 454
    },

    LAB_NORTH: {
        x: 243,
        y: 370
    },

    MOSQUE_BRANCH: {
        x: 204,
        y: 370
    },

    CLASS_JUNCTION: {
        x: 303,
        y: 286
    },

    CLASS_ENTRANCE: {
        x: 303,
        y: 307
    }

};


export const routeEdges = [

    {
        id: "E01",
        from: "GATE_IN",
        to: "GATE_MID",
        points: [
            [34,286],
            [143,286]
        ]
    },

    {
        id: "E02",
        from: "GATE_MID",
        to: "CENTER",
        points: [
            [143,286],
            [210,286],
            [278,286]
        ]
    },

    {
        id: "E03",
        from: "GATE_MID",
        to: "MOSQUE_BRANCH",
        points: [
            [143,286],
            [169,318],
            [204,370]
        ]
    },

    {
        id: "E04",
        from: "MOSQUE_BRANCH",
        to: "LAB_NORTH",
        points: [
            [204,370],
            [243,370]
        ]
    },

    {
        id: "E05",
        from: "CENTER",
        to: "LAB_NORTH",
        points: [
            [278,286],
            [278,329],
            [278,370],
            [243,370]
        ]
    },

    {
        id: "E06",
        from: "CENTER",
        to: "TOP_MAIN",
        points: [
            [278,286],
            [280,230],
            [281,175],
            [282,120]
        ]
    },

    {
        id: "E07",
        from: "TOP_MAIN",
        to: "GATE_EXIT",
        points: [
            [282,120],
            [282,36]
        ]
    },

    {
        id: "E08",
        from: "TOP_MAIN",
        to: "SERBAGUNA",
        points: [
            [282,120],
            [335,120],
            [390,120]
        ]
    },

    {
        id: "E09",
        from: "SERBAGUNA",
        to: "TOP_RIGHT",
        points: [
            [390,120],
            [455,120],
            [535,120]
        ]
    },

    {
        id: "E10",
        from: "TOP_RIGHT",
        to: "LIB_CORNER",
        points: [
            [535,120],
            [535,150],
            [535,185]
        ]
    },

    {
        id: "E11",
        from: "LIB_CORNER",
        to: "LIBRARY",
        points: [
            [535,185],
            [515,185],
            [490,185]
        ]
    },

    {
        id: "E12",
        from: "CENTER",
        to: "COURT_TOP",
        points: [
            [278,286],
            [316,286],
            [355,286]
        ]
    },

    {
        id: "E13",
        from: "COURT_TOP",
        to: "BIRO",
        points: [
            [355,286],
            [405,288],
            [449,290]
        ]
    },

    {
        id: "E14",
        from: "COURT_TOP",
        to: "COURT_BOTTOM",
        points: [
            [355,286],
            [355,340],
            [355,397]
        ]
    },

    {
        id: "E15",
        from: "COURT_BOTTOM",
        to: "LAB_RIGHT",
        points: [
            [355,397],
            [418,397]
        ]
    },

    {
        id: "E16",
        from: "LAB_RIGHT",
        to: "LAB_RIGHT_BOTTOM",
        points: [
            [418,397],
            [418,450],
            [418,507]
        ]
    },

    {
        id: "E17",
        from: "LAB_RIGHT_BOTTOM",
        to: "LAB_SOUTH",
        points: [
            [418,507],
            [390,507],
            [360,507]
        ]
    },

    {
        id: "E18",
        from: "LAB_SOUTH",
        to: "LAB_LEFT_BOTTOM",
        points: [
            [360,507],
            [300,507],
            [243,507]
        ]
    },

    {
        id: "E19",
        from: "LAB_LEFT_BOTTOM",
        to: "LAB_WEST",
        points: [
            [243,507],
            [243,454]
        ]
    },

    {
        id: "E20",
        from: "LAB_WEST",
        to: "LAB_NORTH",
        points: [
            [243,454],
            [243,410],
            [243,370]
        ]
    },

    {
        id: "E21",
        from: "CENTER",
        to: "CLASS_JUNCTION",
        points: [
            [278,286],
            [303,286]
        ]
    },

    {
        id: "E22",
        from: "CLASS_JUNCTION",
        to: "CLASS_ENTRANCE",
        points: [
            [303,286],
            [303,307]
        ]
    }

];


/* =========================================================
   HELPERS
========================================================= */

export function getBuildingById(id) {

    return buildings.find(
        building =>
            building.id === id
    ) || null;

}


export function getRoomById(id) {

    return rooms.find(
        room =>
            room.id === id
    ) || null;

}


export function getBuildingModels(buildingId) {

    const building =
        getBuildingById(buildingId);

    return building?.models || [];

}


export function getModelVariant(
    buildingId,
    modelId
) {

    const building =
        getBuildingById(buildingId);

    if (!building) {
        return null;
    }

    return building.models.find(
        model =>
            model.id === modelId
    ) || null;

}


export function getDefaultModelVariant(
    buildingId
) {

    const building =
        getBuildingById(buildingId);

    if (!building) {
        return null;
    }

    return (

        building.models.find(
            model =>
                model.id ===
                building.defaultModel
        )

        ||

        building.models[0]

        ||

        null

    );

}
