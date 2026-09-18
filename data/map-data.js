/* =========================================================
   FT UISU EXPLORER
   DATABASE + GRAPH NAVIGASI

   REFERENSI TERBARU:
   - Jalur mahasiswa = GARIS BIRU pada gambar terbaru
   - Titik masuk gedung = TANDA KUNING BARU
   - Jalur hijau lama TIDAK DIGUNAKAN

   Sistem koordinat mengikuti denah:
   551 x 544
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
            LAB memiliki 2 akses.

            Dijkstra akan memilih salah satu
            berdasarkan jarak rute terpendek.
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
       GEDUNG BIRO FT - LANTAI 2
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
       GEDUNG PERKULIAHAN
       RUANG KULIAH 1 - 8
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
       LABORATORIUM - LANTAI 1
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
       LABORATORIUM - LANTAI 2
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
       LABORATORIUM - LANTAI 3
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
   GRAPH DENAH TERBARU
========================================================= */

export const mapNodes = {

    /* =====================================================
       JALUR UTAMA DARI SISI KIRI
    ===================================================== */

    MAIN_START: {
        x: 71,
        y: 242
    },

    MAIN_WEST_1: {
        x: 109,
        y: 244
    },

    MAIN_WEST_2: {
        x: 147,
        y: 249
    },

    MAIN_WEST_3: {
        x: 214,
        y: 255
    },

    UP_JUNCTION: {
        x: 243,
        y: 247
    },

    MAIN_CENTER: {
        x: 263,
        y: 255
    },

    MAIN_EAST: {
        x: 310,
        y: 253
    },



    /* =====================================================
       JALUR ATAS
       Mengikuti loop biru mengelilingi area
       Serbaguna / Perpustakaan
    ===================================================== */

    UPPER_LEFT_1: {
        x: 249,
        y: 228
    },

    UPPER_LEFT_2: {
        x: 254,
        y: 200
    },

    UPPER_LEFT_3: {
        x: 256,
        y: 176
    },

    UPPER_TOP_LEFT: {
        x: 254,
        y: 133
    },

    UPPER_TOP_1: {
        x: 304,
        y: 133
    },


    /* =====================================================
       TITIK KUNING BARU 1
       SERBAGUNA
    ===================================================== */

    SERBAGUNA_ENTRANCE: {
        x: 371,
        y: 128,
        buildingId: "serbaguna-ft"
    },


    UPPER_TOP_2: {
        x: 407,
        y: 130
    },

    UPPER_TOP_RIGHT: {
        x: 447,
        y: 129
    },

    UPPER_RIGHT_1: {
        x: 454,
        y: 154
    },

    UPPER_RIGHT_2: {
        x: 443,
        y: 185
    },

    UPPER_RETURN_1: {
        x: 408,
        y: 182
    },

    UPPER_RETURN_2: {
        x: 359,
        y: 178
    },

    UPPER_RETURN_3: {
        x: 325,
        y: 177
    },

    UPPER_RETURN_4: {
        x: 318,
        y: 211
    },

    UPPER_RETURN_5: {
        x: 308,
        y: 242
    },



    /* =====================================================
       TITIK KUNING BARU 2
       PERPUSTAKAAN
    ===================================================== */

    LIBRARY_ENTRANCE: {
        x: 288,
        y: 285,
        buildingId: "perpustakaan-ft"
    },



    /* =====================================================
       AREA TENGAH / KANAN
    ===================================================== */

    RIGHT_LOOP_TOP: {
        x: 335,
        y: 256
    },

    RIGHT_LOOP_CENTER: {
        x: 368,
        y: 269
    },


    /* =====================================================
       TITIK KUNING BARU 3
       BIRO
    ===================================================== */

    BIRO_ENTRANCE: {
        x: 385,
        y: 261,
        buildingId: "biro-ft"
    },


    RIGHT_LOOP_DOWN_1: {
        x: 366,
        y: 311
    },

    RIGHT_LOOP_DOWN_2: {
        x: 364,
        y: 346
    },

    RIGHT_LOOP_BOTTOM: {
        x: 306,
        y: 341
    },

    RIGHT_LOOP_LEFT: {
        x: 297,
        y: 307
    },



    /* =====================================================
       LOOP KIRI-TENGAH
    ===================================================== */

    LEFT_LOOP_1: {
        x: 159,
        y: 282
    },

    LEFT_LOOP_2: {
        x: 181,
        y: 327
    },

    LEFT_LOOP_3: {
        x: 211,
        y: 333
    },

    LEFT_LOOP_4: {
        x: 219,
        y: 329
    },

    LEFT_LOOP_5: {
        x: 224,
        y: 264
    },


    /* =====================================================
       TITIK KUNING BARU 4
       PERKULIAHAN
    ===================================================== */

    CLASS_ENTRANCE: {
        x: 245,
        y: 321,
        buildingId: "perkuliahan-ft"
    },


    CENTER_DOWN_1: {
        x: 262,
        y: 283
    },

    CENTER_DOWN_2: {
        x: 260,
        y: 313
    },



    /* =====================================================
       AREA LABORATORIUM
    ===================================================== */

    LOWER_LEFT_START: {
        x: 213,
        y: 334
    },


    /* =====================================================
       TITIK KUNING BARU 5
       LAB AKSES BARAT
    ===================================================== */

    LAB_WEST_ENTRANCE: {
        x: 221,
        y: 371,
        buildingId: "laboratorium-ft"
    },


    LOWER_LEFT_1: {
        x: 212,
        y: 427
    },

    LOWER_BOTTOM_LEFT: {
        x: 216,
        y: 449
    },


    /* =====================================================
       TITIK KUNING BARU 6
       LAB AKSES SELATAN
    ===================================================== */

    LAB_SOUTH_ENTRANCE: {
        x: 278,
        y: 430,
        buildingId: "laboratorium-ft"
    },


    LOWER_BOTTOM_1: {
        x: 292,
        y: 440
    },

    LOWER_BOTTOM_2: {
        x: 332,
        y: 440
    },

    LOWER_BOTTOM_RIGHT: {
        x: 364,
        y: 425
    }

};



/* =========================================================
   EDGE JALUR

   SEMUA EDGE DI BAWAH MENGIKUTI GARIS BIRU BARU.
   JALUR HIJAU LAMA TIDAK DIPAKAI.
========================================================= */

export const mapEdges = [

    /* =====================================================
       JALUR UTAMA KIRI → TENGAH
    ===================================================== */

    [
        "MAIN_START",
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
        "UP_JUNCTION"
    ],

    [
        "UP_JUNCTION",
        "MAIN_CENTER"
    ],

    [
        "MAIN_CENTER",
        "MAIN_EAST"
    ],


    /* =====================================================
       LOOP ATAS
    ===================================================== */

    [
        "UP_JUNCTION",
        "UPPER_LEFT_1"
    ],

    [
        "UPPER_LEFT_1",
        "UPPER_LEFT_2"
    ],

    [
        "UPPER_LEFT_2",
        "UPPER_LEFT_3"
    ],

    [
        "UPPER_LEFT_3",
        "UPPER_TOP_LEFT"
    ],

    [
        "UPPER_TOP_LEFT",
        "UPPER_TOP_1"
    ],


    /* SERBAGUNA */

    [
        "UPPER_TOP_1",
        "SERBAGUNA_ENTRANCE"
    ],

    [
        "SERBAGUNA_ENTRANCE",
        "UPPER_TOP_2"
    ],


    [
        "UPPER_TOP_2",
        "UPPER_TOP_RIGHT"
    ],

    [
        "UPPER_TOP_RIGHT",
        "UPPER_RIGHT_1"
    ],

    [
        "UPPER_RIGHT_1",
        "UPPER_RIGHT_2"
    ],

    [
        "UPPER_RIGHT_2",
        "UPPER_RETURN_1"
    ],

    [
        "UPPER_RETURN_1",
        "UPPER_RETURN_2"
    ],

    [
        "UPPER_RETURN_2",
        "UPPER_RETURN_3"
    ],

    [
        "UPPER_RETURN_3",
        "UPPER_RETURN_4"
    ],

    [
        "UPPER_RETURN_4",
        "UPPER_RETURN_5"
    ],

    [
        "UPPER_RETURN_5",
        "MAIN_EAST"
    ],


    /* =====================================================
       PERPUSTAKAAN
       AKSES KUNING BARU
    ===================================================== */

    [
        "MAIN_CENTER",
        "LIBRARY_ENTRANCE"
    ],

    [
        "LIBRARY_ENTRANCE",
        "RIGHT_LOOP_LEFT"
    ],


    /* =====================================================
       LOOP KANAN / BIRO
    ===================================================== */

    [
        "MAIN_EAST",
        "RIGHT_LOOP_TOP"
    ],

    [
        "RIGHT_LOOP_TOP",
        "RIGHT_LOOP_CENTER"
    ],


    /* BIRO - SPUR KE PINTU */

    [
        "RIGHT_LOOP_CENTER",
        "BIRO_ENTRANCE"
    ],


    [
        "RIGHT_LOOP_CENTER",
        "RIGHT_LOOP_DOWN_1"
    ],

    [
        "RIGHT_LOOP_DOWN_1",
        "RIGHT_LOOP_DOWN_2"
    ],

    [
        "RIGHT_LOOP_DOWN_2",
        "RIGHT_LOOP_BOTTOM"
    ],

    [
        "RIGHT_LOOP_BOTTOM",
        "RIGHT_LOOP_LEFT"
    ],

    [
        "RIGHT_LOOP_LEFT",
        "MAIN_EAST"
    ],


    /* =====================================================
       LOOP KIRI
    ===================================================== */

    [
        "MAIN_WEST_2",
        "LEFT_LOOP_1"
    ],

    [
        "LEFT_LOOP_1",
        "LEFT_LOOP_2"
    ],

    [
        "LEFT_LOOP_2",
        "LEFT_LOOP_3"
    ],

    [
        "LEFT_LOOP_3",
        "LEFT_LOOP_4"
    ],

    [
        "LEFT_LOOP_4",
        "LEFT_LOOP_5"
    ],

    [
        "LEFT_LOOP_5",
        "MAIN_WEST_3"
    ],


    /* =====================================================
       PERKULIAHAN
    ===================================================== */

    [
        "LEFT_LOOP_3",
        "CLASS_ENTRANCE"
    ],

    [
        "CLASS_ENTRANCE",
        "CENTER_DOWN_2"
    ],

    [
        "CENTER_DOWN_2",
        "CENTER_DOWN_1"
    ],

    [
        "CENTER_DOWN_1",
        "MAIN_CENTER"
    ],


    /* =====================================================
       LAB - SISI KIRI
    ===================================================== */

    [
        "LEFT_LOOP_3",
        "LOWER_LEFT_START"
    ],

    [
        "LOWER_LEFT_START",
        "LAB_WEST_ENTRANCE"
    ],

    [
        "LAB_WEST_ENTRANCE",
        "LOWER_LEFT_1"
    ],

    [
        "LOWER_LEFT_1",
        "LOWER_BOTTOM_LEFT"
    ],


    /* =====================================================
       LAB - BAGIAN BAWAH
    ===================================================== */

    [
        "LOWER_BOTTOM_LEFT",
        "LAB_SOUTH_ENTRANCE"
    ],

    [
        "LAB_SOUTH_ENTRANCE",
        "LOWER_BOTTOM_1"
    ],

    [
        "LOWER_BOTTOM_1",
        "LOWER_BOTTOM_2"
    ],

    [
        "LOWER_BOTTOM_2",
        "LOWER_BOTTOM_RIGHT"
    ],


    /* =====================================================
       LAB - KEMBALI KE LOOP KANAN
    ===================================================== */

    [
        "LOWER_BOTTOM_RIGHT",
        "RIGHT_LOOP_DOWN_2"
    ]

];



/* =========================================================
   HELPER
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
