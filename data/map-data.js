/* =========================================================
   FT UISU EXPLORER
   DATABASE + NAVIGATION GRAPH
   REVISION 30 - FIX
   ========================================================= */

(function () {
    "use strict";

    const MAP_WIDTH = 768;
    const MAP_HEIGHT = 1024;

    const NAVIGATION_MAP =
        "./assets/maps/denah-full-detail.png";


    /* =====================================================
       ENTRANCES
       ===================================================== */

    const entrances = [

        {
            id: "serbaguna-e1",
            buildingId: "serbaguna-ft",
            name: "Entrance Gedung Serbaguna Fakultas Teknik",
            floor: 1,
            x: 645,
            y: 211,
            nodeId: "E_SERBAGUNA",
            deadEnd: true
        },

        {
            id: "perpustakaan-e1",
            buildingId: "perpustakaan-ft",
            name: "Entrance Perpustakaan Fakultas Teknik",
            floor: 1,
            x: 690,
            y: 356,
            nodeId: "E_LIBRARY",
            deadEnd: true
        },

        {
            id: "biro-main-e1",
            buildingId: "biro-ft",
            name: "Entrance Gedung Biro Fakultas Teknik",
            floor: 2,
            x: 670,
            y: 527,
            nodeId: "E_BIRO",
            deadEnd: false
        },

        {
            id: "perkuliahan-main-e1",
            buildingId: "perkuliahan-ft",
            name: "Entrance Gedung Perkuliahan Fakultas Teknik",
            floor: 3,
            x: 463,
            y: 678,
            nodeId: "E_CLASS",
            deadEnd: false
        },

        {
            id: "lab-main-e1",
            buildingId: "laboratorium-ft",
            name: "Entrance Utama Gedung Laboratorium",
            floor: 1,
            x: 385,
            y: 690,
            nodeId: "E_LAB_MAIN",
            deadEnd: false
        },

        /*
         * ENTRANCE BUNTU BARAT
         *
         * HANYA:
         * - Lab. Foundry
         * - Lab. Hidrolika
         */
        {
            id: "lab-west-e1",
            buildingId: "laboratorium-ft",
            name: "Entrance Barat Gedung Laboratorium",
            floor: 1,
            x: 342,
            y: 790,
            nodeId: "E_LAB_WEST",
            deadEnd: true,

            accessOnly: [
                "lab-foundry",
                "lab-hidrolika"
            ]
        },

        /*
         * ENTRANCE BUNTU SELATAN
         *
         * HANYA:
         * - Lab. Jalan Raya
         * - Lab. Beton
         * - Lab. Mekanika Tanah
         */
        {
            id: "lab-south-e1",
            buildingId: "laboratorium-ft",
            name: "Entrance Selatan Gedung Laboratorium",
            floor: 1,
            x: 460,
            y: 953,
            nodeId: "E_LAB_SOUTH",
            deadEnd: true,

            accessOnly: [
                "lab-jalan-raya",
                "lab-beton",
                "lab-mekanika-tanah"
            ]
        }

    ];


    /* =====================================================
       BUILDINGS
       ===================================================== */

    const buildings = [

        {
            id: "biro-ft",

            name: "Gedung Biro Fakultas Teknik",
            shortName: "Biro FT",

            description:
                "Gedung Biro Fakultas Teknik berada di lantai 2 pada gedung yang sama dengan Fakultas Agama Islam di lantai 1 dan Fakultas Sastra di lantai 3.",

            actualFloor: 2,
            floorCount: 1,

            defaultEntranceId:
                "biro-main-e1",

            defaultModel:
                "outdoor",

            models: [

                {
                    id: "outdoor",
                    name: "Outdoor",

                    src:
                        "./assets/models/gedung_biro_outdoor.glb",

                    viewerDescription:
                        "Gedung Biro Fakultas Teknik berada dilantai 2 pada model 3D diatas."
                },

                {
                    id: "indoor",
                    name: "Indoor",

                    src:
                        "./assets/models/gedung_biro_indoor.glb",

                    viewerDescription:
                        "Model diatas menampilkan Interior tampilan ruangan didalam Biro Fakultas Teknik."
                }

            ]
        },


        {
            id: "perpustakaan-ft",

            name: "Perpustakaan Fakultas Teknik",
            shortName: "Perpustakaan FT",

            description:
                "Perpustakaan Fakultas Teknik berada di lantai 1 pada gedung yang berbeda dan terletak di sudut seberang lapangan.",

            actualFloor: 1,
            floorCount: 1,

            defaultEntranceId:
                "perpustakaan-e1",

            defaultModel:
                "indoor",

            models: [

                {
                    id: "indoor",
                    name: "Indoor",

                    src:
                        "./assets/models/perpustakaan_indoor.glb",

                    viewerDescription:
                        "Model diatas menampilkan Interior ruangan Perpustakaan Fakultas Teknik."
                }

            ]
        },


        {
            id: "serbaguna-ft",

            name: "Gedung Serbaguna Fakultas Teknik",
            shortName: "Serbaguna FT",

            description:
                "Gedung Serbaguna Fakultas Teknik berada di lantai 1 pada gedung yang berbeda yaitu gedung Fakultas Hukum.",

            actualFloor: 1,
            floorCount: 1,

            defaultEntranceId:
                "serbaguna-e1",

            defaultModel:
                "indoor",

            models: [

                {
                    id: "indoor",
                    name: "Indoor",

                    src:
                        "./assets/models/serbaguna_indoor.glb",

                    viewerDescription:
                        "Model diatas menampilkan Interior ruangan Serbaguna Fakultas Teknik."
                }

            ]
        },


        {
            id: "perkuliahan-ft",

            name: "Gedung Perkuliahan Fakultas Teknik",
            shortName: "Perkuliahan FT",

            description:
                "Gedung Perkuliahan Fakultas Teknik berada pada lantai 3 gedung di seberang Gedung Biro Fakultas Teknik.",

            actualFloor: 3,
            floorCount: 1,

            defaultEntranceId:
                "perkuliahan-main-e1",

            defaultModel:
                "outdoor",

            models: [

                {
                    id: "outdoor",
                    name: "Outdoor",

                    src:
                        "./assets/models/gedung_perkuliahan_outdoor.glb",

                    viewerDescription:
                        "Ruang Kuliah Fakultas Teknik terletak dilantai 3 pada model 3D diatas."
                },

                {
                    id: "indoor",
                    name: "Indoor",

                    src:
                        "./assets/models/gedung_perkuliahan_indoor.glb",

                    viewerDescription:
                        "Model diatas menampilkan tampilan Interior Ruang Perkuliahan Teknik dari Ruang 1 s/d Ruang 8."
                }

            ]
        },


        {
            id: "laboratorium-ft",

            name: "Gedung Laboratorium Fakultas Teknik",
            shortName: "Laboratorium FT",

            description:
                "Gedung Laboratorium Fakultas Teknik terdiri dari tiga lantai dan berada di dekat Gedung Perkuliahan Fakultas Teknik.",

            actualFloor: null,
            floorCount: 3,

            defaultEntranceId:
                "lab-main-e1",

            defaultModel:
                "outdoor",

            models: [

                {
                    id: "outdoor",
                    name: "Outdoor",

                    src:
                        "./assets/models/gedung_laboratorium.glb",

                    viewerDescription:
                        "Model diatas menampilkan Gedung Laboratorium yang berisi seluruh Laboratorium yang ada diFakultas Teknik, juga Ruang Perkuliahan dari Ruang 9 s/d Ruang 13."
                }

            ]
        }

    ];


    /* =====================================================
       ROOMS
       GEDUNG BIRO FT - LANTAI 2
       ===================================================== */

    const rooms = [

        {
            id: "gudang-mini",
            name: "Gudang Mini",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "prodi-industri",
            name: "Program Studi Teknik Industri",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "prodi-mesin",
            name: "Program Studi Teknik Mesin",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "prodi-sipil",
            name: "Program Studi Teknik Sipil",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "prodi-informatika",
            name: "Program Studi Teknik Informatika",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "prodi-elektro",
            name: "Program Studi Teknik Elektro",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "lpmf",
            name: "LPMF",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "wd3-kak",
            name: "WD3-KAK",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "wd2-stk",
            name: "WD2-STK",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "wd1-adi",
            name: "WD1-ADI",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "ruang-dekan",
            name: "Ruang Dekan",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "loket-pembayaran",
            name: "Loket Pembayaran Mahasiswa",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "kasubbag-akademik",
            name: "KaSubBag Akademik IT dan Kerjasama",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "kasubbag-keuangan",
            name: "KaSubBag Keuangan",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "kasubbag-kemahasiswaan",
            name: "KaSubBag Kemahasiswaan",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "kasubbag-siakad",
            name: "KaSubBag SIAKAD",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "ktu",
            name: "KTU",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "kasubbag-umum",
            name: "KaSubBag Umum Perlengkapan Kerumahtanggaan",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "mushola",
            name: "Mushola",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "dapur",
            name: "Dapur",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },

        {
            id: "toilet-biro",
            name: "Toilet",
            buildingId: "biro-ft",
            floor: 2,
            navigationEntranceId: "biro-main-e1",
            modelMarker: null
        },


        /* =================================================
           GEDUNG PERKULIAHAN - LANTAI 3
           ================================================= */

        {
            id: "ruang-kuliah-1",
            name: "Ruang Kuliah 1",
            buildingId: "perkuliahan-ft",
            floor: 3,
            navigationEntranceId: "perkuliahan-main-e1",
            modelMarker: null
        },

        {
            id: "ruang-kuliah-2",
            name: "Ruang Kuliah 2",
            buildingId: "perkuliahan-ft",
            floor: 3,
            navigationEntranceId: "perkuliahan-main-e1",
            modelMarker: null
        },

        {
            id: "ruang-kuliah-3",
            name: "Ruang Kuliah 3",
            buildingId: "perkuliahan-ft",
            floor: 3,
            navigationEntranceId: "perkuliahan-main-e1",
            modelMarker: null
        },

        {
            id: "ruang-kuliah-4",
            name: "Ruang Kuliah 4",
            buildingId: "perkuliahan-ft",
            floor: 3,
            navigationEntranceId: "perkuliahan-main-e1",
            modelMarker: null
        },

        {
            id: "ruang-kuliah-5",
            name: "Ruang Kuliah 5",
            buildingId: "perkuliahan-ft",
            floor: 3,
            navigationEntranceId: "perkuliahan-main-e1",
            modelMarker: null
        },

        {
            id: "ruang-kuliah-6",
            name: "Ruang Kuliah 6",
            buildingId: "perkuliahan-ft",
            floor: 3,
            navigationEntranceId: "perkuliahan-main-e1",
            modelMarker: null
        },

        {
            id: "ruang-kuliah-7",
            name: "Ruang Kuliah 7",
            buildingId: "perkuliahan-ft",
            floor: 3,
            navigationEntranceId: "perkuliahan-main-e1",
            modelMarker: null
        },

        {
            id: "ruang-kuliah-8",
            name: "Ruang Kuliah 8",
            buildingId: "perkuliahan-ft",
            floor: 3,
            navigationEntranceId: "perkuliahan-main-e1",
            modelMarker: null
        },


        /* =================================================
           LABORATORIUM - LANTAI 1
           ================================================= */

        /*
         * ENTRANCE BUNTU BARAT
         */
        {
            id: "lab-foundry",
            name: "Lab. Foundry",
            buildingId: "laboratorium-ft",
            floor: 1,
            navigationEntranceId: "lab-west-e1",
            modelMarker: null
        },

        {
            id: "lab-hidrolika",
            name: "Lab. Hidrolika",
            buildingId: "laboratorium-ft",
            floor: 1,
            navigationEntranceId: "lab-west-e1",
            modelMarker: null
        },


        /*
         * ENTRANCE BUNTU SELATAN
         */
        {
            id: "lab-jalan-raya",
            name: "Lab. Jalan Raya",
            buildingId: "laboratorium-ft",
            floor: 1,
            navigationEntranceId: "lab-south-e1",
            modelMarker: null
        },

        {
            id: "lab-beton",
            name: "Lab. Beton",
            buildingId: "laboratorium-ft",
            floor: 1,
            navigationEntranceId: "lab-south-e1",
            modelMarker: null
        },

        {
            id: "lab-mekanika-tanah",
            name: "Lab. Mekanika Tanah",
            buildingId: "laboratorium-ft",
            floor: 1,
            navigationEntranceId: "lab-south-e1",
            modelMarker: null
        },


        /*
         * ENTRANCE UTAMA LAB
         */
        {
            id: "lab-teknologi-mekanik",
            name: "Lab. Teknologi Mekanik",
            buildingId: "laboratorium-ft",
            floor: 1,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },


        /* =================================================
           LABORATORIUM - LANTAI 2
           ================================================= */

        {
            id: "lab-rangkaian-listrik",
            name: "Lab. Rangkaian Listrik",
            buildingId: "laboratorium-ft",
            floor: 2,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "lab-dasar-elektronika",
            name: "Lab. Dasar Elektronika",
            buildingId: "laboratorium-ft",
            floor: 2,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "lab-sistem-pengukuran",
            name: "Lab. Sistem Pengukuran",
            buildingId: "laboratorium-ft",
            floor: 2,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "lab-pengukuran-listrik",
            name: "Lab. Pengukuran Listrik",
            buildingId: "laboratorium-ft",
            floor: 2,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "lab-dasar-telekomunikasi",
            name: "Lab. Dasar Sistem Telekomunikasi",
            buildingId: "laboratorium-ft",
            floor: 2,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "lab-ilmu-ukur-tanah",
            name: "Lab. Ilmu Ukur Tanah",
            buildingId: "laboratorium-ft",
            floor: 2,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "lab-komputasi",
            name: "Lab. Komputasi",
            buildingId: "laboratorium-ft",
            floor: 2,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "lab-pengukuran-statistik",
            name: "Lab. Pengukuran & Statistik",
            buildingId: "laboratorium-ft",
            floor: 2,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "lab-faktor-manusia",
            name: "Lab. Teknik Faktor Manusia",
            buildingId: "laboratorium-ft",
            floor: 2,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "lab-jaringan-komputer-mikro",
            name: "Lab. Jaringan Komputer Mikro",
            buildingId: "laboratorium-ft",
            floor: 2,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "ruang-kuliah-9",
            name: "Ruang Kuliah 9",
            buildingId: "laboratorium-ft",
            floor: 2,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "ruang-kuliah-10",
            name: "Ruang Kuliah 10",
            buildingId: "laboratorium-ft",
            floor: 2,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },


        /* =================================================
           LABORATORIUM - LANTAI 3
           ================================================= */

        {
            id: "ruang-kuliah-11",
            name: "Ruang Kuliah 11",
            buildingId: "laboratorium-ft",
            floor: 3,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "ruang-kuliah-12",
            name: "Ruang Kuliah 12",
            buildingId: "laboratorium-ft",
            floor: 3,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "ruang-kuliah-13",
            name: "Ruang Kuliah 13",
            buildingId: "laboratorium-ft",
            floor: 3,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "lab-sistem-digital",
            name: "Lab. Sistem Digital",
            buildingId: "laboratorium-ft",
            floor: 3,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "lab-teknik-produksi",
            name: "Lab. Teknik Produksi",
            buildingId: "laboratorium-ft",
            floor: 3,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        },

        {
            id: "lab-menggambar",
            name: "Lab. Menggambar",
            buildingId: "laboratorium-ft",
            floor: 3,
            navigationEntranceId: "lab-main-e1",
            modelMarker: null
        }

    ];


    /* =====================================================
       GRAPH NAVIGASI OUTDOOR
       ===================================================== */

    const mapNodes = {

        GATE_MAIN:
            { x: 58, y: 488 },

        WEST_JUNCTION:
            { x: 164, y: 490 },

        CENTER_WEST:
            { x: 284, y: 555 },

        CENTER_MAIN:
            { x: 325, y: 504 },

        CENTER_EAST:
            { x: 400, y: 526 },


        TOP_WEST:
            { x: 96, y: 199 },

        TOP_JUNCTION_1:
            { x: 334, y: 223 },

        TOP_JUNCTION_2:
            { x: 396, y: 216 },

        GATE_EXIT:
            { x: 390, y: 32 },

        TOP_RIGHT:
            { x: 744, y: 230 },


        COURT_TOP_LEFT:
            { x: 495, y: 356 },

        COURT_TOP_RIGHT:
            { x: 630, y: 356 },

        COURT_MID_LEFT:
            { x: 495, y: 526 },

        COURT_MID_RIGHT:
            { x: 632, y: 527 },

        COURT_BOTTOM_LEFT:
            { x: 494, y: 730 },

        COURT_BOTTOM_RIGHT:
            { x: 600, y: 730 },


        MOSQUE_CORNER:
            { x: 283, y: 683 },

        CLASS_WEST:
            { x: 421, y: 686 },

        LAB_WEST_JUNCTION:
            { x: 341, y: 684 },

        LAB_WEST_LOWER:
            { x: 341, y: 944 },

        LAB_SOUTH_JUNCTION:
            { x: 460, y: 944 },


        E_SERBAGUNA:
            { x: 645, y: 211 },

        E_LIBRARY:
            { x: 690, y: 356 },

        E_BIRO:
            { x: 670, y: 527 },

        E_CLASS:
            { x: 463, y: 678 },

        E_LAB_MAIN:
            { x: 385, y: 690 },

        E_LAB_WEST:
            { x: 342, y: 790 },

        E_LAB_SOUTH:
            { x: 460, y: 953 }

    };


    const mapEdges = [

        {
            id: "R01",
            from: "GATE_MAIN",
            to: "WEST_JUNCTION",
            points: [
                [58, 488],
                [164, 490]
            ]
        },

        {
            id: "R02",
            from: "WEST_JUNCTION",
            to: "CENTER_MAIN",
            points: [
                [164, 490],
                [245, 498],
                [325, 504]
            ]
        },

        {
            id: "R03",
            from: "WEST_JUNCTION",
            to: "CENTER_WEST",
            points: [
                [164, 490],
                [218, 521],
                [284, 555]
            ]
        },

        {
            id: "R04",
            from: "CENTER_WEST",
            to: "CENTER_MAIN",
            points: [
                [284, 555],
                [325, 504]
            ]
        },

        {
            id: "R05",
            from: "CENTER_MAIN",
            to: "CENTER_EAST",
            points: [
                [325, 504],
                [400, 526]
            ]
        },

        {
            id: "R06",
            from: "TOP_WEST",
            to: "TOP_JUNCTION_1",
            points: [
                [96, 199],
                [210, 211],
                [334, 223]
            ]
        },

        {
            id: "R07",
            from: "TOP_JUNCTION_1",
            to: "TOP_JUNCTION_2",
            points: [
                [334, 223],
                [396, 216]
            ]
        },

        {
            id: "R08",
            from: "TOP_JUNCTION_1",
            to: "CENTER_MAIN",
            points: [
                [334, 223],
                [334, 350],
                [325, 504]
            ]
        },

        {
            id: "R09",
            from: "TOP_JUNCTION_2",
            to: "CENTER_EAST",
            points: [
                [396, 216],
                [399, 370],
                [400, 526]
            ]
        },

        {
            id: "R10",
            from: "TOP_JUNCTION_2",
            to: "GATE_EXIT",
            points: [
                [396, 216],
                [392, 116],
                [390, 32]
            ]
        },

        {
            id: "R11",
            from: "TOP_JUNCTION_2",
            to: "E_SERBAGUNA",
            points: [
                [396, 216],
                [520, 215],
                [645, 211]
            ]
        },

        {
            id: "R12",
            from: "E_SERBAGUNA",
            to: "TOP_RIGHT",
            points: [
                [645, 211],
                [700, 220],
                [744, 230]
            ]
        },

        {
            id: "R13",
            from: "TOP_RIGHT",
            to: "E_LIBRARY",
            points: [
                [744, 230],
                [744, 356],
                [690, 356]
            ]
        },

        {
            id: "R14",
            from: "CENTER_EAST",
            to: "COURT_MID_LEFT",
            points: [
                [400, 526],
                [495, 526]
            ]
        },

        {
            id: "R15",
            from: "COURT_MID_LEFT",
            to: "COURT_MID_RIGHT",
            points: [
                [495, 526],
                [632, 527]
            ]
        },

        {
            id: "R16",
            from: "COURT_MID_RIGHT",
            to: "E_BIRO",
            points: [
                [632, 527],
                [670, 527]
            ]
        },

        {
            id: "R17",
            from: "CENTER_EAST",
            to: "COURT_TOP_RIGHT",
            points: [
                [400, 526],
                [515, 448],
                [630, 356]
            ]
        },

        {
            id: "R18",
            from: "COURT_TOP_LEFT",
            to: "COURT_TOP_RIGHT",
            points: [
                [495, 356],
                [630, 356]
            ]
        },

        {
            id: "R19",
            from: "COURT_TOP_LEFT",
            to: "COURT_MID_LEFT",
            points: [
                [495, 356],
                [495, 526]
            ]
        },

        {
            id: "R20",
            from: "COURT_TOP_RIGHT",
            to: "COURT_MID_RIGHT",
            points: [
                [630, 356],
                [632, 527]
            ]
        },

        {
            id: "R21",
            from: "COURT_MID_LEFT",
            to: "COURT_BOTTOM_LEFT",
            points: [
                [495, 526],
                [495, 630],
                [494, 730]
            ]
        },

        {
            id: "R22",
            from: "COURT_MID_RIGHT",
            to: "COURT_BOTTOM_RIGHT",
            points: [
                [632, 527],
                [620, 630],
                [600, 730]
            ]
        },

        {
            id: "R23",
            from: "COURT_BOTTOM_LEFT",
            to: "COURT_BOTTOM_RIGHT",
            points: [
                [494, 730],
                [550, 730],
                [600, 730]
            ]
        },

        {
            id: "R24",
            from: "CENTER_WEST",
            to: "MOSQUE_CORNER",
            points: [
                [284, 555],
                [284, 620],
                [283, 683]
            ]
        },

        {
            id: "R25",
            from: "MOSQUE_CORNER",
            to: "LAB_WEST_JUNCTION",
            points: [
                [283, 683],
                [341, 684]
            ]
        },

        {
            id: "R26",
            from: "LAB_WEST_JUNCTION",
            to: "CLASS_WEST",
            points: [
                [341, 684],
                [421, 686]
            ]
        },

        {
            id: "R27",
            from: "CLASS_WEST",
            to: "E_CLASS",
            points: [
                [421, 686],
                [463, 678]
            ]
        },

        {
            id: "R28",
            from: "CLASS_WEST",
            to: "E_LAB_MAIN",
            points: [
                [421, 686],
                [385, 690]
            ]
        },

        /*
         * ENTRANCE BUNTU BARAT LAB
         */
        {
            id: "R29",
            from: "LAB_WEST_JUNCTION",
            to: "E_LAB_WEST",
            points: [
                [341, 684],
                [342, 735],
                [342, 790]
            ]
        },

        /*
         * JALUR LUAR BARAT LAB
         */
        {
            id: "R30",
            from: "LAB_WEST_JUNCTION",
            to: "LAB_WEST_LOWER",
            points: [
                [341, 684],
                [341, 820],
                [341, 944]
            ]
        },

        {
            id: "R31",
            from: "LAB_WEST_LOWER",
            to: "LAB_SOUTH_JUNCTION",
            points: [
                [341, 944],
                [400, 944],
                [460, 944]
            ]
        },

        /*
         * ENTRANCE BUNTU SELATAN LAB
         */
        {
            id: "R32",
            from: "LAB_SOUTH_JUNCTION",
            to: "E_LAB_SOUTH",
            points: [
                [460, 944],
                [460, 953]
            ]
        }

    ];


    /* =====================================================
       FUTURE GPS CALIBRATION
       ===================================================== */

    const mapCalibration = [];


    /* =====================================================
       HELPERS
       ===================================================== */

    function getBuildingById(id) {

        return buildings.find(function (item) {
            return item.id === id;
        }) || null;

    }


    function getRoomById(id) {

        return rooms.find(function (item) {
            return item.id === id;
        }) || null;

    }


    function getEntranceById(id) {

        return entrances.find(function (item) {
            return item.id === id;
        }) || null;

    }


    function getBuildingModels(buildingId) {

        const building =
            getBuildingById(buildingId);

        if (!building) {
            return [];
        }

        return building.models || [];

    }


    function getModelVariant(
        buildingId,
        modelId
    ) {

        return getBuildingModels(buildingId)
            .find(function (model) {
                return model.id === modelId;
            }) || null;

    }


    function getDefaultModelVariant(
        buildingId
    ) {

        const building =
            getBuildingById(buildingId);

        if (!building) {
            return null;
        }

        return (
            getModelVariant(
                buildingId,
                building.defaultModel
            )
            ||
            building.models[0]
            ||
            null
        );

    }


    /*
     * ENTRANCE RESOLVER
     *
     * Jika tujuan berupa ruangan,
     * navigationEntranceId milik ruangan
     * SELALU diprioritaskan.
     *
     * Ini mencegah Lab Foundry, Hidrolika,
     * Beton, Mekanika Tanah dan Jalan Raya
     * diarahkan ke entrance yang salah.
     */
    function getNavigationEntranceForLocation(
        location
    ) {

        if (!location) {
            return null;
        }


        if (
            location.type === "room"
            &&
            location.navigationEntranceId
        ) {

            return getEntranceById(
                location.navigationEntranceId
            );

        }


        const building =
            getBuildingById(
                location.buildingId
                ||
                location.id
            );


        if (!building) {
            return null;
        }


        return getEntranceById(
            building.defaultEntranceId
        );

    }


    /* =====================================================
       GLOBAL DATA
       ===================================================== */

    window.FT_DATA = {

        MAP_WIDTH,
        MAP_HEIGHT,

        NAVIGATION_MAP,

        buildings,
        rooms,
        entrances,

        mapNodes,
        mapEdges,

        mapCalibration,

        getBuildingById,
        getRoomById,
        getEntranceById,

        getBuildingModels,
        getModelVariant,
        getDefaultModelVariant,

        getNavigationEntranceForLocation

    };

})();
