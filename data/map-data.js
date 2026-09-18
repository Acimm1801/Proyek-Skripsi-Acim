/* =========================================================
   FT UISU EXPLORER
   DATABASE + GRAPH NAVIGASI

   REVISI:
   - Memperbaiki entrance Perpustakaan
   - Memperbaiki entrance Gedung Perkuliahan
   - Memperbaiki jalur Laboratorium
   - Mengurangi garis diagonal yang tidak sesuai jalur
   - Serbaguna tetap pada posisi yang sudah benar
   - Biro tetap menggunakan akses sisi gedung
========================================================= */


/* =========================================================
   UKURAN DENAH
========================================================= */

export const MAP_WIDTH = 551;
export const MAP_HEIGHT = 544;



/* =========================================================
   DATABASE GEDUNG
========================================================= */

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
        ]
    },


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

        entranceNodes: [
            "LIBRARY_ENTRANCE"
        ]
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
        ]
    },


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

        entranceNodes: [
            "CLASS_ENTRANCE"
        ]
    },


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

        /*
            Laboratorium mempunyai dua akses.

            Dijkstra otomatis memilih akses
            yang memberikan rute terpendek.
        */

        entranceNodes: [
            "LAB_WEST_ENTRANCE",
            "LAB_SOUTH_ENTRANCE"
        ]
    }

];



/* =========================================================
   DATABASE RUANGAN
========================================================= */

export const rooms = [

    /* =====================================================
       BIRO FT
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
        name:
            "KaSubBag Umum Perlengkapan Kerumahtanggaan",
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
       GEDUNG PERKULIAHAN
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
       LABORATORIUM LANTAI 1
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
       LABORATORIUM LANTAI 2
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
       LABORATORIUM LANTAI 3
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
   NODE JALUR

   CATATAN:
   Koordinat 551 x 544.

   Jalur dibuat lebih sederhana.
   Node hanya ditempatkan pada perubahan arah penting.
========================================================= */

export const mapNodes = {


    /* =====================================================
       GERBANG / JALUR BARAT
    ===================================================== */

    MAIN_START: {
        x: 70,
        y: 242
    },

    WEST_1: {
        x: 110,
        y: 244
    },

    WEST_2: {
        x: 150,
        y: 248
    },

    WEST_3: {
        x: 215,
        y: 255
    },

    CENTRAL_JUNCTION: {
        x: 262,
        y: 255
    },


    /* =====================================================
       JALUR UTARA
    ===================================================== */

    NORTH_1: {
        x: 263,
        y: 225
    },

    NORTH_2: {
        x: 263,
        y: 180
    },

    NORTH_3: {
        x: 263,
        y: 135
    },


    /* =====================================================
       SERBAGUNA
    ===================================================== */

    SERBAGUNA_ROUTE_1: {
        x: 310,
        y: 135
    },

    SERBAGUNA_ENTRANCE: {
        x: 371,
        y: 128,
        buildingId: "serbaguna-ft"
    },

    SERBAGUNA_ROUTE_2: {
        x: 420,
        y: 132
    },

    SERBAGUNA_CORNER: {
        x: 446,
        y: 135
    },


    /* =====================================================
       PERPUSTAKAAN

       Entrance lama dihapus.

       Entrance sekarang berada pada area
       Perpustakaan sebenarnya, bukan area kelas.
    ===================================================== */

    LIBRARY_RIGHT_TOP: {
        x: 454,
        y: 155
    },

    LIBRARY_ROUTE: {
        x: 448,
        y: 182
    },

    LIBRARY_ENTRANCE: {
        x: 448,
        y: 207,
        buildingId: "perpustakaan-ft"
    },

    LIBRARY_INNER_LEFT: {
        x: 407,
        y: 182
    },

    LIBRARY_INNER_MIDDLE: {
        x: 360,
        y: 180
    },

    LIBRARY_INNER_CORNER: {
        x: 323,
        y: 180
    },

    LIBRARY_RETURN: {
        x: 312,
        y: 230
    },


    /* =====================================================
       JALUR TENGAH
    ===================================================== */

    CENTER_EAST_1: {
        x: 310,
        y: 255
    },

    CENTER_EAST_2: {
        x: 350,
        y: 255
    },


    /* =====================================================
       BIRO
    ===================================================== */

    BIRO_APPROACH: {
        x: 385,
        y: 255
    },

    BIRO_ENTRANCE: {
        x: 385,
        y: 264,
        buildingId: "biro-ft"
    },


    /* =====================================================
       JALUR MASJID / BARAT BAWAH
    ===================================================== */

    DIAGONAL_START: {
        x: 150,
        y: 248
    },

    DIAGONAL_1: {
        x: 170,
        y: 282
    },

    DIAGONAL_2: {
        x: 190,
        y: 320
    },

    DIAGONAL_3: {
        x: 214,
        y: 330
    },


    /* =====================================================
       GEDUNG PERKULIAHAN

       INI POSISI YANG SEBELUMNYA SALAH
       TERBACA SEBAGAI PERPUSTAKAAN.
    ===================================================== */

    CLASS_APPROACH: {
        x: 288,
        y: 255
    },

    CLASS_ENTRANCE: {
        x: 288,
        y: 285,
        buildingId: "perkuliahan-ft"
    },


    /* =====================================================
       LABORATORIUM AKSES BARAT

       Entrance kelas lama berada terlalu ke bawah.
       Area tersebut sekarang dipakai sebagai bagian
       jalur Laboratorium.
    ===================================================== */

    LAB_ROUTE_TOP: {
        x: 245,
        y: 320
    },

    LAB_WEST_ENTRANCE: {
        x: 221,
        y: 371,
        buildingId: "laboratorium-ft"
    },

    LAB_LEFT_1: {
        x: 214,
        y: 405
    },

    LAB_LEFT_BOTTOM: {
        x: 214,
        y: 438
    },


    /* =====================================================
       LABORATORIUM BAGIAN BAWAH

       Dibuat horizontal agar tidak lagi zig-zag
       seperti area yang Anda lingkari merah.
    ===================================================== */

    LAB_BOTTOM_LEFT: {
        x: 235,
        y: 438
    },

    LAB_BOTTOM_CENTER: {
        x: 278,
        y: 438
    },

    LAB_SOUTH_ENTRANCE: {
        x: 278,
        y: 430,
        buildingId: "laboratorium-ft"
    },

    LAB_BOTTOM_2: {
        x: 320,
        y: 438
    },

    LAB_BOTTOM_RIGHT: {
        x: 360,
        y: 438
    },


    /* =====================================================
       JALUR KANAN LAB
    ===================================================== */

    LAB_RIGHT_1: {
        x: 360,
        y: 400
    },

    LAB_RIGHT_2: {
        x: 360,
        y: 350
    },

    LAB_RIGHT_3: {
        x: 360,
        y: 310
    },

    LAB_RIGHT_TOP: {
        x: 350,
        y: 255
    }

};



/* =========================================================
   EDGE / JALUR MAHASISWA
========================================================= */

export const mapEdges = [

    /* =====================================================
       JALUR BARAT → TENGAH
    ===================================================== */

    [
        "MAIN_START",
        "WEST_1"
    ],

    [
        "WEST_1",
        "WEST_2"
    ],

    [
        "WEST_2",
        "WEST_3"
    ],

    [
        "WEST_3",
        "CENTRAL_JUNCTION"
    ],


    /* =====================================================
       UTARA
    ===================================================== */

    [
        "CENTRAL_JUNCTION",
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


    /* =====================================================
       SERBAGUNA
    ===================================================== */

    [
        "NORTH_3",
        "SERBAGUNA_ROUTE_1"
    ],

    [
        "SERBAGUNA_ROUTE_1",
        "SERBAGUNA_ENTRANCE"
    ],

    [
        "SERBAGUNA_ENTRANCE",
        "SERBAGUNA_ROUTE_2"
    ],

    [
        "SERBAGUNA_ROUTE_2",
        "SERBAGUNA_CORNER"
    ],


    /* =====================================================
       PERPUSTAKAAN

       Tidak ada shortcut dari tengah.

       Rute:
       Serbaguna
       → sisi kanan
       → sisi bawah Perpustakaan
       → pintu Perpustakaan.
    ===================================================== */

    [
        "SERBAGUNA_CORNER",
        "LIBRARY_RIGHT_TOP"
    ],

    [
        "LIBRARY_RIGHT_TOP",
        "LIBRARY_ROUTE"
    ],

    [
        "LIBRARY_ROUTE",
        "LIBRARY_ENTRANCE"
    ],

    [
        "LIBRARY_ROUTE",
        "LIBRARY_INNER_LEFT"
    ],

    [
        "LIBRARY_INNER_LEFT",
        "LIBRARY_INNER_MIDDLE"
    ],

    [
        "LIBRARY_INNER_MIDDLE",
        "LIBRARY_INNER_CORNER"
    ],

    [
        "LIBRARY_INNER_CORNER",
        "LIBRARY_RETURN"
    ],

    [
        "LIBRARY_RETURN",
        "CENTER_EAST_1"
    ],


    /* =====================================================
       TENGAH → BIRO
    ===================================================== */

    [
        "CENTRAL_JUNCTION",
        "CENTER_EAST_1"
    ],

    [
        "CENTER_EAST_1",
        "CENTER_EAST_2"
    ],

    [
        "CENTER_EAST_2",
        "BIRO_APPROACH"
    ],

    [
        "BIRO_APPROACH",
        "BIRO_ENTRANCE"
    ],


    /* =====================================================
       DIAGONAL AREA MASJID
    ===================================================== */

    [
        "DIAGONAL_START",
        "DIAGONAL_1"
    ],

    [
        "DIAGONAL_1",
        "DIAGONAL_2"
    ],

    [
        "DIAGONAL_2",
        "DIAGONAL_3"
    ],

    [
        "DIAGONAL_3",
        "LAB_ROUTE_TOP"
    ],


    /* =====================================================
       PERKULIAHAN

       Jalur sekarang dibuat lurus:
       main route → approach → entrance kelas.

       Tidak lagi diarahkan ke entrance Lab.
    ===================================================== */

    [
        "CENTRAL_JUNCTION",
        "CLASS_APPROACH"
    ],

    [
        "CLASS_APPROACH",
        "CLASS_ENTRANCE"
    ],


    /* =====================================================
       HUBUNGAN KELAS → AREA LAB
    ===================================================== */

    [
        "CLASS_ENTRANCE",
        "LAB_ROUTE_TOP"
    ],


    /* =====================================================
       LAB SISI KIRI
    ===================================================== */

    [
        "LAB_ROUTE_TOP",
        "LAB_WEST_ENTRANCE"
    ],

    [
        "LAB_WEST_ENTRANCE",
        "LAB_LEFT_1"
    ],

    [
        "LAB_LEFT_1",
        "LAB_LEFT_BOTTOM"
    ],


    /* =====================================================
       LAB BAGIAN BAWAH

       Semuanya dibuat HORIZONTAL.

       Sebelumnya ada beberapa diagonal yang
       menyebabkan jalur melintasi bangunan.
    ===================================================== */

    [
        "LAB_LEFT_BOTTOM",
        "LAB_BOTTOM_LEFT"
    ],

    [
        "LAB_BOTTOM_LEFT",
        "LAB_BOTTOM_CENTER"
    ],


    /*
       Entrance Selatan merupakan cabang pendek,
       bukan bagian yang memaksa jalur berbelok.
    */

    [
        "LAB_BOTTOM_CENTER",
        "LAB_SOUTH_ENTRANCE"
    ],


    [
        "LAB_BOTTOM_CENTER",
        "LAB_BOTTOM_2"
    ],

    [
        "LAB_BOTTOM_2",
        "LAB_BOTTOM_RIGHT"
    ],


    /* =====================================================
       LAB SISI KANAN
    ===================================================== */

    [
        "LAB_BOTTOM_RIGHT",
        "LAB_RIGHT_1"
    ],

    [
        "LAB_RIGHT_1",
        "LAB_RIGHT_2"
    ],

    [
        "LAB_RIGHT_2",
        "LAB_RIGHT_3"
    ],

    [
        "LAB_RIGHT_3",
        "LAB_RIGHT_TOP"
    ],

    [
        "LAB_RIGHT_TOP",
        "CENTER_EAST_2"
    ]

];



/* =========================================================
   HELPERS
========================================================= */

export function getBuildingById(id) {

    return buildings.find(
        building =>
            building.id === id
    );

}


export function getRoomById(id) {

    return rooms.find(
        room =>
            room.id === id
    );

}
