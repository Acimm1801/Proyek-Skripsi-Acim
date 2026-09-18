/* =====================================================
   FT UISU EXPLORER
   MAP DATA V9

   KONSEP BARU:
   - Network jalan TIDAK ditampilkan.
   - Hanya route aktif yang ditampilkan.
   - Hanya entrance tujuan yang ditampilkan.
   - Lokasi tujuan di-highlight berdasarkan marker gedung.
===================================================== */


export const MAP_WIDTH = 551;

export const MAP_HEIGHT = 544;



/* =====================================================
   BUILDINGS
===================================================== */

export const buildings = [

    {

        id:
            "biro-ft",

        name:
            "Gedung Biro Fakultas Teknik",

        shortName:
            "Biro FT",

        description:

            "Gedung Biro Fakultas Teknik berada di lantai 2 pada gedung yang sama dengan Fakultas Agama Islam di lantai 1 dan Fakultas Sastra di lantai 3.",

        actualFloor:
            2,

        floorCount:
            1,


        /*
            Posisi logo lokasi/nama gedung
            pada denah bersih.
        */

        mapMarker: {

            x: 414,
            y: 256

        },


        /*
            Entrance sebenarnya.
        */

        entrances: [

            "BIRO_ENTRANCE"

        ]

    },


    {

        id:
            "perpustakaan-ft",

        name:
            "Perpustakaan Fakultas Teknik",

        shortName:
            "Perpustakaan FT",

        description:

            "Perpustakaan Fakultas Teknik berada di lantai 1 pada gedung yang berbeda dan terletak di sudut seberang lapangan.",

        actualFloor:
            1,

        floorCount:
            1,


        mapMarker: {

            x: 428,
            y: 121

        },


        entrances: [

            "LIBRARY_ENTRANCE"

        ]

    },


    {

        id:
            "serbaguna-ft",

        name:
            "Gedung Serbaguna Fakultas Teknik",

        shortName:
            "Serbaguna FT",

        description:

            "Gedung Serbaguna Fakultas Teknik berada di lantai 1 pada gedung Fakultas Hukum.",

        actualFloor:
            1,

        floorCount:
            1,


        mapMarker: {

            x: 390,
            y: 57

        },


        entrances: [

            "SERBAGUNA_ENTRANCE"

        ]

    },


    {

        id:
            "perkuliahan-ft",

        name:
            "Gedung Perkuliahan Fakultas Teknik",

        shortName:
            "Perkuliahan FT",

        description:

            "Gedung Perkuliahan Fakultas Teknik berada pada lantai 3 gedung yang terletak di seberang Gedung Biro Fakultas Teknik.",

        actualFloor:
            3,

        floorCount:
            1,


        mapMarker: {

            x: 289,
            y: 328

        },


        entrances: [

            "CLASS_ENTRANCE"

        ]

    },


    {

        id:
            "laboratorium-ft",

        name:
            "Gedung Laboratorium Fakultas Teknik",

        shortName:
            "Laboratorium FT",

        description:

            "Gedung Laboratorium Fakultas Teknik terdiri dari tiga lantai dan berada di dekat Gedung Perkuliahan Fakultas Teknik.",

        actualFloor:
            null,

        floorCount:
            3,


        mapMarker: {

            x: 246,
            y: 376

        },


        /*
            Lab mempunyai dua entrance.

            Sistem otomatis memilih entrance
            yang menghasilkan rute terpendek.

            Hanya entrance terpilih yang
            akan muncul pada map.
        */

        entrances: [

            "LAB_WEST_ENTRANCE",

            "LAB_SOUTH_ENTRANCE"

        ]

    }

];



/* =====================================================
   ROOMS
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

            floor:
                3

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
   INTERNAL NAVIGATION NODES

   PENTING:
   Node ini TIDAK DIGAMBAR ke website.

   User hanya akan melihat route final.
===================================================== */

export const mapNodes = {


    /* MAIN ROAD */

    GATE_MAIN: {

        x: 36,
        y: 282

    },


    WEST_MAIN: {

        x: 145,
        y: 282

    },


    CENTER_WEST: {

        x: 243,
        y: 282

    },


    CENTER_MIDDLE: {

        x: 292,
        y: 282

    },


    CENTER_EAST: {

        x: 355,
        y: 282

    },


    /* BIRO */

    BIRO_ENTRANCE: {

        x: 449,
        y: 287

    },


    /* NORTH */

    NORTH_MIDDLE: {

        x: 281,
        y: 220

    },


    NORTH_TOP: {

        x: 281,
        y: 120

    },


    EXIT_GATE: {

        x: 281,
        y: 25

    },


    /* SERBAGUNA */

    SERBAGUNA_ENTRANCE: {

        x: 386,
        y: 120

    },


    NORTH_RIGHT: {

        x: 525,
        y: 132

    },


    /* LIBRARY */

    LIBRARY_RIGHT: {

        x: 525,
        y: 185

    },


    LIBRARY_BOTTOM: {

        x: 430,
        y: 185

    },


    LIBRARY_ENTRANCE: {

        x: 430,
        y: 144

    },


    LIBRARY_LEFT: {

        x: 355,
        y: 185

    },


    /* MASJID / LOWER WEST */

    MASJID_BRANCH: {

        x: 201,
        y: 371

    },


    /* CLASS */

    CLASS_BRANCH: {

        x: 292,
        y: 371

    },


    CLASS_ENTRANCE: {

        x: 269,
        y: 375

    },


    /* LAB LEFT */

    LAB_WEST_ENTRANCE: {

        x: 243,
        y: 459

    },


    LAB_BOTTOM_LEFT: {

        x: 243,
        y: 510

    },


    /* LAB SOUTH */

    LAB_SOUTH_ENTRANCE: {

        x: 361,
        y: 509

    },


    LAB_BOTTOM_RIGHT: {

        x: 420,
        y: 512

    },


    LAB_RIGHT_TOP: {

        x: 420,
        y: 282

    }

};



/* =====================================================
   INTERNAL NAVIGATION EDGES

   Tidak dirender ke layar.
===================================================== */

export const mapEdges = [


    /* MAIN HORIZONTAL */

    [
        "GATE_MAIN",
        "WEST_MAIN"
    ],

    [
        "WEST_MAIN",
        "CENTER_WEST"
    ],

    [
        "CENTER_WEST",
        "CENTER_MIDDLE"
    ],

    [
        "CENTER_MIDDLE",
        "CENTER_EAST"
    ],

    [
        "CENTER_EAST",
        "BIRO_ENTRANCE"
    ],


    /* NORTH */

    [
        "CENTER_MIDDLE",
        "NORTH_MIDDLE"
    ],

    [
        "NORTH_MIDDLE",
        "NORTH_TOP"
    ],

    [
        "NORTH_TOP",
        "EXIT_GATE"
    ],


    /* SERBAGUNA */

    [
        "NORTH_TOP",
        "SERBAGUNA_ENTRANCE"
    ],

    [
        "SERBAGUNA_ENTRANCE",
        "NORTH_RIGHT"
    ],


    /* LIBRARY LOOP */

    [
        "NORTH_RIGHT",
        "LIBRARY_RIGHT"
    ],

    [
        "LIBRARY_RIGHT",
        "LIBRARY_BOTTOM"
    ],

    [
        "LIBRARY_BOTTOM",
        "LIBRARY_ENTRANCE"
    ],

    [
        "LIBRARY_BOTTOM",
        "LIBRARY_LEFT"
    ],

    [
        "LIBRARY_LEFT",
        "CENTER_EAST"
    ],


    /* LOWER / MASJID */

    [
        "WEST_MAIN",
        "MASJID_BRANCH"
    ],

    [
        "MASJID_BRANCH",
        "CLASS_BRANCH"
    ],


    /* CLASS */

    [
        "CENTER_MIDDLE",
        "CLASS_BRANCH"
    ],

    [
        "CLASS_BRANCH",
        "CLASS_ENTRANCE"
    ],


    /* LAB LEFT */

    [
        "CENTER_WEST",
        "LAB_WEST_ENTRANCE"
    ],

    [
        "LAB_WEST_ENTRANCE",
        "LAB_BOTTOM_LEFT"
    ],


    /* LAB BOTTOM */

    [
        "LAB_BOTTOM_LEFT",
        "LAB_SOUTH_ENTRANCE"
    ],

    [
        "LAB_SOUTH_ENTRANCE",
        "LAB_BOTTOM_RIGHT"
    ],


    /* LAB RIGHT */

    [
        "LAB_BOTTOM_RIGHT",
        "LAB_RIGHT_TOP"
    ],

    [
        "LAB_RIGHT_TOP",
        "CENTER_EAST"
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


export function getRoomById(id) {

    return rooms.find(

        room =>
            room.id === id

    );

}
