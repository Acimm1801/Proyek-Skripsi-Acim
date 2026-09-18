/* =====================================================
   DATABASE GEDUNG
===================================================== */

export const buildings = [

    {

        id: "biro-ft",

        name:
            "Gedung Biro Fakultas Teknik",

        shortName:
            "Biro FT",

        description:

            "Gedung Biro Fakultas Teknik berada di lantai 2 pada gedung yang sama dengan Fakultas Agama Islam di lantai 1 dan Fakultas Sastra di lantai 3.",

        actualFloor: 2,

        floorCount: 1,

        entranceNodes: [

            "BIRO_ENTRANCE"

        ],

        hasIndoorMap: false

    },


    {

        id: "perpustakaan-ft",

        name:
            "Perpustakaan Fakultas Teknik",

        shortName:
            "Perpustakaan FT",

        description:

            "Perpustakaan Fakultas Teknik berada di lantai 1 pada gedung yang berbeda dan berada di sudut seberang lapangan.",

        actualFloor: 1,

        floorCount: 1,

        entranceNodes: [

            "LIBRARY_ENTRANCE"

        ],

        hasIndoorMap: false

    },


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

        entranceNodes: [

            "SERBAGUNA_ENTRANCE"

        ],

        hasIndoorMap: false

    },


    {

        id: "perkuliahan-ft",

        name:
            "Gedung Perkuliahan Fakultas Teknik",

        shortName:
            "Perkuliahan FT",

        description:

            "Gedung Perkuliahan Fakultas Teknik berada di lantai 3 pada gedung yang berada di seberang Gedung Biro Fakultas Teknik.",

        actualFloor: 3,

        floorCount: 1,

        entranceNodes: [

            "CLASS_ENTRANCE"

        ],

        hasIndoorMap: false

    },


    {

        id: "laboratorium-ft",

        name:
            "Gedung Laboratorium Fakultas Teknik",

        shortName:
            "Laboratorium FT",

        description:

            "Gedung Laboratorium Fakultas Teknik memiliki tiga lantai dan berada di dekat Gedung Perkuliahan Fakultas Teknik.",

        actualFloor: null,

        floorCount: 3,

        /*
            Laboratorium memiliki lebih dari satu
            titik akses sesuai denah.
        */

        entranceNodes: [

            "LAB_WEST_ENTRANCE",

            "LAB_SOUTH_ENTRANCE"

        ],

        hasIndoorMap: false

    }

];



/* =====================================================
   DATABASE RUANGAN
===================================================== */

export const rooms = [

    /* =================================================
       BIRO FT
    ================================================= */

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


    /* =================================================
       GEDUNG PERKULIAHAN
    ================================================= */

    ...Array.from(

        { length: 8 },

        (_, index) => ({

            id:
                `ruang-kuliah-${index + 1}`,

            name:
                `Ruang Kuliah ${index + 1}`,

            buildingId:
                "perkuliahan-ft",

            floor: 3

        })

    ),


    /* =================================================
       LAB LANTAI 1
    ================================================= */

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


    /* =================================================
       LAB LANTAI 2
    ================================================= */

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


    /* =================================================
       LAB LANTAI 3
    ================================================= */

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



/* =====================================================
   NODE DENAH

   x dan y = 0 - 1000

   Disesuaikan dengan denah terbaru.
===================================================== */

export const mapNodes = {


    /* GERBANG MASUK */

    MAIN_GATE: {

        x: 70,
        y: 505,

        label:
            "Gerbang Masuk Utama"

    },


    MAIN_WEST_1: {

        x: 180,
        y: 515

    },


    MAIN_WEST_2: {

        x: 295,
        y: 520

    },


    MAIN_WEST_3: {

        x: 410,
        y: 530

    },


    MAIN_CENTER: {

        x: 535,
        y: 535

    },



    /* VERTIKAL UTARA */

    NORTH_1: {

        x: 535,
        y: 430

    },


    NORTH_2: {

        x: 535,
        y: 325

    },


    NORTH_3: {

        x: 535,
        y: 220

    },


    NORTH_4: {

        x: 535,
        y: 120

    },


    NORTH_EXIT: {

        x: 535,
        y: 35,

        label:
            "Gerbang Keluar"

    },



    /* SERBAGUNA */

    SERBAGUNA_WEST: {

        x: 630,
        y: 185

    },


    SERBAGUNA_CENTER: {

        x: 720,
        y: 185

    },


    SERBAGUNA_ENTRANCE: {

        x: 755,
        y: 185,

        buildingId:
            "serbaguna-ft"

    },


    SERBAGUNA_EAST: {

        x: 875,
        y: 185

    },


    UPPER_RIGHT_CORNER: {

        x: 970,
        y: 185

    },



    /* PERPUSTAKAAN */

    LIBRARY_RIGHT_TOP: {

        x: 970,
        y: 250

    },


    LIBRARY_RIGHT_BOTTOM: {

        x: 970,
        y: 350

    },


    LIBRARY_ENTRANCE: {

        x: 905,
        y: 315,

        buildingId:
            "perpustakaan-ft"

    },


    LIBRARY_INNER_1: {

        x: 820,
        y: 350

    },


    LIBRARY_INNER_2: {

        x: 775,
        y: 365

    },


    COURTYARD_TOP: {

        x: 755,
        y: 420

    },


    COURTYARD_CENTER: {

        x: 735,
        y: 535

    },



    /* BIRO */

    BIRO_PATH_1: {

        x: 650,
        y: 535

    },


    BIRO_PATH_2: {

        x: 760,
        y: 535

    },


    BIRO_ENTRANCE: {

        x: 855,
        y: 535,

        buildingId:
            "biro-ft"

    },



    /* JALUR DIAGONAL AREA MASJID */

    MOSQUE_BRANCH_1: {

        x: 300,
        y: 525

    },


    MOSQUE_BRANCH_2: {

        x: 335,
        y: 585

    },


    MOSQUE_BRANCH_3: {

        x: 390,
        y: 670

    },


    MOSQUE_BRANCH_4: {

        x: 470,
        y: 675

    },



    /* AREA BAWAH */

    LOWER_CENTER_1: {

        x: 535,
        y: 625

    },


    LOWER_CENTER_2: {

        x: 535,
        y: 690

    },



    /* PERKULIAHAN */

    CLASS_WEST_PATH: {

        x: 475,
        y: 690

    },


    CLASS_ENTRANCE: {

        x: 520,
        y: 710,

        buildingId:
            "perkuliahan-ft"

    },



    /* LAB SISI KIRI */

    LAB_WEST_TOP: {

        x: 405,
        y: 690

    },


    LAB_WEST_ENTRANCE: {

        x: 405,
        y: 780,

        buildingId:
            "laboratorium-ft"

    },


    LAB_WEST_BOTTOM: {

        x: 405,
        y: 910

    },



    /* LAB BAWAH */

    LAB_BOTTOM_LEFT: {

        x: 405,
        y: 965

    },


    LAB_BOTTOM_CENTER: {

        x: 570,
        y: 965

    },


    LAB_SOUTH_ENTRANCE: {

        x: 690,
        y: 965,

        buildingId:
            "laboratorium-ft"

    },


    LAB_BOTTOM_RIGHT: {

        x: 800,
        y: 965

    },



    /* SISI KANAN */

    EAST_LOWER_1: {

        x: 805,
        y: 860

    },


    EAST_LOWER_2: {

        x: 815,
        y: 745

    },


    EAST_LOWER_3: {

        x: 830,
        y: 635

    },


    EAST_CENTER: {

        x: 855,
        y: 535

    }

};



/* =====================================================
   JALUR YANG BOLEH DILEWATI
===================================================== */

export const mapEdges = [

    /* GERBANG MASUK */

    [
        "MAIN_GATE",
        "MAIN_WEST_1"
    ],

    [
        "MAIN_WEST_1",
        "MAIN_WEST_2"
    ],

    [
        "MAIN_WEST_2",
        "MAIN_WEST_3"
    ],

    [
        "MAIN_WEST_3",
        "MAIN_CENTER"
    ],


    /* UTARA */

    [
        "MAIN_CENTER",
        "NORTH_1"
    ],

    [
        "NORTH_1",
        "NORTH_2"
    ],

    [
        "NORTH_2",
        "NORTH_3"
    ],

    [
        "NORTH_3",
        "NORTH_4"
    ],

    [
        "NORTH_4",
        "NORTH_EXIT"
    ],


    /* SERBAGUNA */

    [
        "NORTH_3",
        "SERBAGUNA_WEST"
    ],

    [
        "SERBAGUNA_WEST",
        "SERBAGUNA_CENTER"
    ],

    [
        "SERBAGUNA_CENTER",
        "SERBAGUNA_ENTRANCE"
    ],

    [
        "SERBAGUNA_ENTRANCE",
        "SERBAGUNA_EAST"
    ],

    [
        "SERBAGUNA_EAST",
        "UPPER_RIGHT_CORNER"
    ],


    /* PERPUSTAKAAN */

    [
        "UPPER_RIGHT_CORNER",
        "LIBRARY_RIGHT_TOP"
    ],

    [
        "LIBRARY_RIGHT_TOP",
        "LIBRARY_RIGHT_BOTTOM"
    ],

    [
        "LIBRARY_RIGHT_BOTTOM",
        "LIBRARY_ENTRANCE"
    ],

    [
        "LIBRARY_ENTRANCE",
        "LIBRARY_INNER_1"
    ],

    [
        "LIBRARY_INNER_1",
        "LIBRARY_INNER_2"
    ],

    [
        "LIBRARY_INNER_2",
        "COURTYARD_TOP"
    ],

    [
        "COURTYARD_TOP",
        "COURTYARD_CENTER"
    ],

    [
        "COURTYARD_CENTER",
        "MAIN_CENTER"
    ],


    /* BIRO */

    [
        "MAIN_CENTER",
        "BIRO_PATH_1"
    ],

    [
        "BIRO_PATH_1",
        "BIRO_PATH_2"
    ],

    [
        "BIRO_PATH_2",
        "BIRO_ENTRANCE"
    ],


    /* DIAGONAL MASJID */

    [
        "MAIN_WEST_2",
        "MOSQUE_BRANCH_1"
    ],

    [
        "MOSQUE_BRANCH_1",
        "MOSQUE_BRANCH_2"
    ],

    [
        "MOSQUE_BRANCH_2",
        "MOSQUE_BRANCH_3"
    ],

    [
        "MOSQUE_BRANCH_3",
        "MOSQUE_BRANCH_4"
    ],


    /* AREA BAWAH */

    [
        "MAIN_CENTER",
        "LOWER_CENTER_1"
    ],

    [
        "LOWER_CENTER_1",
        "LOWER_CENTER_2"
    ],


    /* PERKULIAHAN */

    [
        "LOWER_CENTER_2",
        "CLASS_WEST_PATH"
    ],

    [
        "CLASS_WEST_PATH",
        "CLASS_ENTRANCE"
    ],

    [
        "MOSQUE_BRANCH_4",
        "CLASS_WEST_PATH"
    ],


    /* LAB KIRI */

    [
        "CLASS_WEST_PATH",
        "LAB_WEST_TOP"
    ],

    [
        "LAB_WEST_TOP",
        "LAB_WEST_ENTRANCE"
    ],

    [
        "LAB_WEST_ENTRANCE",
        "LAB_WEST_BOTTOM"
    ],

    [
        "LAB_WEST_BOTTOM",
        "LAB_BOTTOM_LEFT"
    ],


    /* LAB BAWAH */

    [
        "LAB_BOTTOM_LEFT",
        "LAB_BOTTOM_CENTER"
    ],

    [
        "LAB_BOTTOM_CENTER",
        "LAB_SOUTH_ENTRANCE"
    ],

    [
        "LAB_SOUTH_ENTRANCE",
        "LAB_BOTTOM_RIGHT"
    ],


    /* LAB SISI KANAN */

    [
        "LAB_BOTTOM_RIGHT",
        "EAST_LOWER_1"
    ],

    [
        "EAST_LOWER_1",
        "EAST_LOWER_2"
    ],

    [
        "EAST_LOWER_2",
        "EAST_LOWER_3"
    ],

    [
        "EAST_LOWER_3",
        "EAST_CENTER"
    ],

    [
        "EAST_CENTER",
        "BIRO_ENTRANCE"
    ]

];



/* =====================================================
   HELPERS
===================================================== */

export function getBuildingById(id) {

    return buildings.find(

        building =>
            building.id === id

    );

}


export function getNode(id) {

    return mapNodes[id];

}