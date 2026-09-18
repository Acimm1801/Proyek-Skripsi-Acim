/* =========================================================
   UKURAN KOORDINAT DENAH
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
            "Gedung Serbaguna Fakultas Teknik berada di lantai 1 pada gedung yang berbeda, yaitu gedung Fakultas Hukum.",

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
            "Gedung Perkuliahan Fakultas Teknik berada pada lantai 3 gedung yang terletak di seberang Gedung Biro Fakultas Teknik.",

        actualFloor: 3,

        floorCount: 1,

        /*
           Pada denah terdapat lebih dari satu
           akses yang dapat digunakan menuju
           area Gedung Perkuliahan.
        */
        entranceNodes: [
            "CLASS_NORTH_ENTRANCE",
            "CLASS_WEST_ENTRANCE"
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
           Dua akses laboratorium.
           Sistem otomatis memilih akses
           dengan rute graph terpendek.
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
       BIRO FT - LANTAI 2
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
       GEDUNG PERKULIAHAN FT - LANTAI 3
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
   NODE JALUR DENAH

   Koordinat menggunakan ukuran referensi:
   551 x 544.

   Fokus:
   - Main Gate
   - Gerbang keluar
   - Serbaguna
   - Perpustakaan
   - Biro
   - Perkuliahan
   - Laboratorium
========================================================= */

export const mapNodes = {

    /* =====================================================
       GERBANG MASUK / JALUR BARAT
    ===================================================== */

    MAIN_GATE: {
        x: 36,
        y: 270,
        label: "Gerbang Masuk Utama"
    },

    WEST_1: {
        x: 90,
        y: 272
    },

    WEST_2: {
        x: 145,
        y: 274
    },


    /* =====================================================
       JALUR UTAMA TENGAH
    ===================================================== */

    MAIN_LEFT: {
        x: 215,
        y: 288
    },

    MAIN_CENTER: {
        x: 289,
        y: 289
    },

    MAIN_EAST_1: {
        x: 350,
        y: 289
    },

    MAIN_EAST_2: {
        x: 398,
        y: 289
    },


    /* =====================================================
       JALUR UTARA / GERBANG KELUAR
    ===================================================== */

    NORTH_1: {
        x: 283,
        y: 245
    },

    NORTH_2: {
        x: 285,
        y: 196
    },

    NORTH_3: {
        x: 288,
        y: 126
    },

    NORTH_4: {
        x: 290,
        y: 90
    },

    NORTH_EXIT: {
        x: 292,
        y: 55,
        label: "Gerbang Keluar"
    },


    /* =====================================================
       SERBAGUNA

       Dari jalur vertikal utama:
       belok kanan pada sisi bawah gedung.
    ===================================================== */

    SERBAGUNA_WEST: {
        x: 330,
        y: 126
    },

    SERBAGUNA_CENTER: {
        x: 390,
        y: 126
    },

    SERBAGUNA_ENTRANCE: {
        x: 451,
        y: 124,
        buildingId: "serbaguna-ft"
    },

    SERBAGUNA_EAST: {
        x: 500,
        y: 130
    },

    UPPER_RIGHT_CORNER: {
        x: 535,
        y: 133
    },


    /* =====================================================
       PERPUSTAKAAN

       Jalur harus menerus dari Serbaguna ke kanan,
       turun sisi kanan, lalu kembali ke kiri menuju
       akses perpustakaan.
    ===================================================== */

    LIBRARY_RIGHT_TOP: {
        x: 535,
        y: 160
    },

    LIBRARY_RIGHT_BOTTOM: {
        x: 535,
        y: 196
    },

    LIBRARY_ENTRANCE: {
        x: 487,
        y: 194,
        buildingId: "perpustakaan-ft"
    },

    LIBRARY_LEFT: {
        x: 442,
        y: 196
    },

    LIBRARY_INNER_1: {
        x: 416,
        y: 202
    },

    LIBRARY_INNER_2: {
        x: 409,
        y: 221
    },

    LIBRARY_INNER_3: {
        x: 404,
        y: 241
    },

    LIBRARY_INNER_4: {
        x: 399,
        y: 261
    },

    LIBRARY_COURTYARD: {
        x: 397,
        y: 289
    },


    /* =====================================================
       BIRO
    ===================================================== */

    BIRO_PATH: {
        x: 430,
        y: 290
    },

    BIRO_ENTRANCE: {
        x: 458,
        y: 293,
        buildingId: "biro-ft"
    },


    /* =====================================================
       JALUR DIAGONAL AREA MASJID
    ===================================================== */

    DIAGONAL_1: {
        x: 155,
        y: 282
    },

    DIAGONAL_2: {
        x: 175,
        y: 315
    },

    DIAGONAL_3: {
        x: 198,
        y: 355
    },

    DIAGONAL_4: {
        x: 212,
        y: 369
    },

    DIAGONAL_5: {
        x: 250,
        y: 370
    },


    /* =====================================================
       AREA PERKULIAHAN
    ===================================================== */

    LOWER_CENTER: {
        x: 298,
        y: 370
    },

    CLASS_TOP_PATH: {
        x: 334,
        y: 289
    },

    CLASS_NORTH_ENTRANCE: {
        x: 335,
        y: 308,
        buildingId: "perkuliahan-ft"
    },

    CLASS_WEST_PATH: {
        x: 278,
        y: 370
    },

    CLASS_WEST_ENTRANCE: {
        x: 278,
        y: 384,
        buildingId: "perkuliahan-ft"
    },


    /* =====================================================
       LABORATORIUM - SISI KIRI
    ===================================================== */

    LAB_LEFT_TOP: {
        x: 250,
        y: 370
    },

    LAB_LEFT_1: {
        x: 250,
        y: 420
    },

    LAB_WEST_ENTRANCE: {
        x: 253,
        y: 464,
        buildingId: "laboratorium-ft"
    },

    LAB_LEFT_BOTTOM: {
        x: 245,
        y: 510
    },


    /* =====================================================
       LABORATORIUM - SISI BAWAH
    ===================================================== */

    LAB_BOTTOM_LEFT: {
        x: 280,
        y: 520
    },

    LAB_BOTTOM_CENTER: {
        x: 330,
        y: 520
    },

    LAB_SOUTH_ENTRANCE: {
        x: 369,
        y: 516,
        buildingId: "laboratorium-ft"
    },

    LAB_BOTTOM_RIGHT: {
        x: 425,
        y: 520
    },


    /* =====================================================
       LAB / AREA TIMUR
    ===================================================== */

    EAST_BOTTOM: {
        x: 431,
        y: 480
    },

    EAST_MIDDLE_2: {
        x: 436,
        y: 420
    },

    EAST_MIDDLE_1: {
        x: 444,
        y: 360
    },

    EAST_TOP: {
        x: 451,
        y: 294
    }

};



/* =========================================================
   EDGE / JARINGAN JALAN MAHASISWA
========================================================= */

export const mapEdges = [

    /* =====================================================
       GERBANG MASUK → TENGAH
    ===================================================== */

    ["MAIN_GATE", "WEST_1"],
    ["WEST_1", "WEST_2"],
    ["WEST_2", "MAIN_LEFT"],
    ["MAIN_LEFT", "MAIN_CENTER"],


    /* =====================================================
       JALUR UTARA
    ===================================================== */

    ["MAIN_CENTER", "NORTH_1"],
    ["NORTH_1", "NORTH_2"],
    ["NORTH_2", "NORTH_3"],
    ["NORTH_3", "NORTH_4"],
    ["NORTH_4", "NORTH_EXIT"],


    /* =====================================================
       SERBAGUNA

       Jalur dari vertical utama → kanan
       di bawah gedung Serbaguna.
    ===================================================== */

    ["NORTH_3", "SERBAGUNA_WEST"],
    ["SERBAGUNA_WEST", "SERBAGUNA_CENTER"],
    ["SERBAGUNA_CENTER", "SERBAGUNA_ENTRANCE"],
    ["SERBAGUNA_ENTRANCE", "SERBAGUNA_EAST"],
    ["SERBAGUNA_EAST", "UPPER_RIGHT_CORNER"],


    /* =====================================================
       PERPUSTAKAAN

       TIDAK TERHUBUNG LANGSUNG DARI TENGAH.
       Harus melalui:
       Serbaguna → kanan → turun → Perpustakaan.
    ===================================================== */

    ["UPPER_RIGHT_CORNER", "LIBRARY_RIGHT_TOP"],
    ["LIBRARY_RIGHT_TOP", "LIBRARY_RIGHT_BOTTOM"],
    ["LIBRARY_RIGHT_BOTTOM", "LIBRARY_ENTRANCE"],
    ["LIBRARY_ENTRANCE", "LIBRARY_LEFT"],

    /*
       Jalur masuk halaman bagian dalam
       sesuai referensi.
    */
    ["LIBRARY_LEFT", "LIBRARY_INNER_1"],
    ["LIBRARY_INNER_1", "LIBRARY_INNER_2"],
    ["LIBRARY_INNER_2", "LIBRARY_INNER_3"],
    ["LIBRARY_INNER_3", "LIBRARY_INNER_4"],
    ["LIBRARY_INNER_4", "LIBRARY_COURTYARD"],


    /* =====================================================
       JALUR HORIZONTAL TENGAH → BIRO
    ===================================================== */

    ["MAIN_CENTER", "MAIN_EAST_1"],
    ["MAIN_EAST_1", "MAIN_EAST_2"],
    ["MAIN_EAST_2", "LIBRARY_COURTYARD"],
    ["LIBRARY_COURTYARD", "BIRO_PATH"],
    ["BIRO_PATH", "BIRO_ENTRANCE"],


    /* =====================================================
       AREA DIAGONAL MASJID
    ===================================================== */

    ["WEST_2", "DIAGONAL_1"],
    ["DIAGONAL_1", "DIAGONAL_2"],
    ["DIAGONAL_2", "DIAGONAL_3"],
    ["DIAGONAL_3", "DIAGONAL_4"],
    ["DIAGONAL_4", "DIAGONAL_5"],


    /* =====================================================
       JALUR TURUN TENGAH
    ===================================================== */

    ["MAIN_CENTER", "LOWER_CENTER"],


    /* =====================================================
       PERKULIAHAN - AKSES UTARA
    ===================================================== */

    ["MAIN_EAST_1", "CLASS_TOP_PATH"],
    ["CLASS_TOP_PATH", "CLASS_NORTH_ENTRANCE"],


    /* =====================================================
       PERKULIAHAN - AKSES BARAT
    ===================================================== */

    ["DIAGONAL_5", "CLASS_WEST_PATH"],
    ["CLASS_WEST_PATH", "CLASS_WEST_ENTRANCE"],
    ["CLASS_WEST_PATH", "LOWER_CENTER"],


    /* =====================================================
       LAB - SISI KIRI
    ===================================================== */

    ["DIAGONAL_5", "LAB_LEFT_TOP"],
    ["LAB_LEFT_TOP", "LAB_LEFT_1"],
    ["LAB_LEFT_1", "LAB_WEST_ENTRANCE"],
    ["LAB_WEST_ENTRANCE", "LAB_LEFT_BOTTOM"],


    /* =====================================================
       LAB - BAGIAN BAWAH
    ===================================================== */

    ["LAB_LEFT_BOTTOM", "LAB_BOTTOM_LEFT"],
    ["LAB_BOTTOM_LEFT", "LAB_BOTTOM_CENTER"],
    ["LAB_BOTTOM_CENTER", "LAB_SOUTH_ENTRANCE"],
    ["LAB_SOUTH_ENTRANCE", "LAB_BOTTOM_RIGHT"],


    /* =====================================================
       LAB / SISI KANAN
    ===================================================== */

    ["LAB_BOTTOM_RIGHT", "EAST_BOTTOM"],
    ["EAST_BOTTOM", "EAST_MIDDLE_2"],
    ["EAST_MIDDLE_2", "EAST_MIDDLE_1"],
    ["EAST_MIDDLE_1", "EAST_TOP"],
    ["EAST_TOP", "BIRO_ENTRANCE"]

];



/* =========================================================
   HELPERS
========================================================= */

export function getBuildingById(id) {

    return buildings.find(
        building => building.id === id
    );

}


export function getRoomById(id) {

    return rooms.find(
        room => room.id === id
    );

}
