import {
    MAP_WIDTH,
    MAP_HEIGHT,
    buildings,
    rooms,
    mapNodes,
    mapEdges,
    getBuildingById
} from "./data/map-data.js?v=4";


/* =========================================================
   SHORTCUT DOM
========================================================= */

const $ = selector =>
    document.querySelector(selector);

const $$ = selector =>
    [...document.querySelectorAll(selector)];



/* =========================================================
   STATE
========================================================= */

const state = {

    currentSlide: 0,

    selectedGlobalSearch: null,

    destination: null,

    navigationMode: null,

    clickedPosition: null,

    snappedPosition: null,

    snappedEdge: null,

    destinationEntrance: null,

    routePoints: [],

    routeDistance: 0

};



/* =========================================================
   DATABASE PENCARIAN
========================================================= */

const locations = [];


buildings.forEach(building => {

    locations.push({

        id: building.id,

        type: "building",

        name: building.name,

        buildingId: building.id,

        parent:
            "Fakultas Teknik UISU",

        floor:
            building.actualFloor,

        description:
            building.description

    });

});


rooms.forEach(room => {

    const building =
        getBuildingById(
            room.buildingId
        );


    locations.push({

        ...room,

        type: "room",

        parent:
            building
                ? building.name
                : "Fakultas Teknik UISU",

        description:
            `${room.name} berada di ${
                building
                    ? building.name
                    : "Fakultas Teknik UISU"
            }${
                room.floor
                    ? `, lantai ${room.floor}`
                    : ""
            }.`

    });

});



/* =========================================================
   DRAWER
========================================================= */

const drawer =
    $("#drawer");

const drawerOverlay =
    $("#drawerOverlay");


function openDrawer() {

    drawer.classList.add(
        "open"
    );

    drawerOverlay.classList.add(
        "show"
    );

    document.body.style.overflow =
        "hidden";

}


function closeDrawer() {

    drawer.classList.remove(
        "open"
    );

    drawerOverlay.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

}


$("#hamburgerButton")
.addEventListener(
    "click",
    openDrawer
);


$("#closeDrawer")
.addEventListener(
    "click",
    closeDrawer
);


drawerOverlay
.addEventListener(
    "click",
    closeDrawer
);



/* =========================================================
   PAGE
========================================================= */

function showPage(pageName) {

    $$(".page").forEach(page => {

        page.classList.remove(
            "active"
        );

    });


    const target =
        $("#" + pageName + "Page");


    if(target) {

        target.classList.add(
            "active"
        );

    }


    $$(".header-link").forEach(button => {

        button.classList.toggle(

            "active",

            button.dataset.page ===
            pageName

        );

    });


    closeDrawer();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


$$("[data-page]")
.forEach(button => {

    button.addEventListener(
        "click",
        () => showPage(
            button.dataset.page
        )
    );

});


$("#logoHome")
.addEventListener(
    "click",
    () => showPage(
        "home"
    )
);



/* =========================================================
   SLIDER 20 DETIK
========================================================= */

const slides =
    $$(".hero-slide");


let sliderTimer;


function showSlide(index) {

    index =
        (
            index +
            slides.length
        )
        %
        slides.length;


    state.currentSlide =
        index;


    slides.forEach(
        (slide, slideIndex) => {

            slide.classList.toggle(

                "active",

                slideIndex === index

            );

        }
    );


    $$(".hero-dot")
    .forEach(
        (dot, dotIndex) => {

            dot.classList.toggle(

                "active",

                dotIndex === index

            );

        }
    );

}


function restartSlider() {

    clearInterval(
        sliderTimer
    );


    sliderTimer =
        setInterval(
            () => {

                showSlide(
                    state.currentSlide + 1
                );

            },
            20000
        );

}


$("#nextSlide")
.addEventListener(
    "click",
    () => {

        showSlide(
            state.currentSlide + 1
        );

        restartSlider();

    }
);


$("#prevSlide")
.addEventListener(
    "click",
    () => {

        showSlide(
            state.currentSlide - 1
        );

        restartSlider();

    }
);


$$(".hero-dot")
.forEach(dot => {

    dot.addEventListener(
        "click",
        () => {

            showSlide(
                Number(
                    dot.dataset.slide
                )
            );

            restartSlider();

        }
    );

});


restartSlider();



/* =========================================================
   SEARCH
========================================================= */

function normalizeText(text) {

    return String(text)
        .toLowerCase()
        .trim();

}


function searchLocations(value) {

    const query =
        normalizeText(
            value
        );


    if(!query) {

        return [];

    }


    return locations

        .filter(location => {

            const text =
                normalizeText(
                    `${location.name} ${location.parent}`
                );


            return text.includes(
                query
            );

        })

        .slice(
            0,
            25
        );

}


function renderSearchResults(
    results,
    container,
    callback
) {

    container.innerHTML =
        "";


    if(
        results.length === 0
    ) {

        container.innerHTML =
            `
            <div class="search-empty">
                Lokasi tidak ditemukan.
            </div>
            `;

        container.classList.remove(
            "hidden"
        );

        return;

    }


    results.forEach(location => {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "search-result";


        button.innerHTML =
            `
            <span>

                <strong>
                    ${location.name}
                </strong>

                <small>

                    ${location.parent}

                    ${
                        location.floor
                            ?
                        ` • Lantai ${location.floor}`
                            :
                        ""
                    }

                </small>

            </span>

            <span class="search-type">

                ${
                    location.type ===
                    "building"
                        ?
                    "Gedung"
                        :
                    "Ruangan"
                }

            </span>
            `;


        button.addEventListener(
            "click",
            () => callback(
                location
            )
        );


        container.appendChild(
            button
        );

    });


    container.classList.remove(
        "hidden"
    );

}



/* =========================================================
   GLOBAL SEARCH
========================================================= */

$("#globalSearch")
.addEventListener(
    "input",
    event => {

        state.selectedGlobalSearch =
            null;


        $("#globalSearchActions")
        .classList
        .add(
            "hidden"
        );


        const value =
            event.target.value;


        if(!value) {

            $("#globalSearchResults")
            .classList
            .add(
                "hidden"
            );

            return;

        }


        renderSearchResults(

            searchLocations(
                value
            ),

            $("#globalSearchResults"),

            location => {

                state.selectedGlobalSearch =
                    location;


                $("#globalSearch").value =
                    location.name;


                $("#globalSearchResults")
                .classList
                .add(
                    "hidden"
                );


                $("#globalSelectedName")
                .textContent =
                    location.name;


                $("#globalSearchActions")
                .classList
                .remove(
                    "hidden"
                );

            }

        );

    }
);


$("#clearSearch")
.addEventListener(
    "click",
    () => {

        $("#globalSearch").value =
            "";


        state.selectedGlobalSearch =
            null;


        $("#globalSearchResults")
        .classList
        .add(
            "hidden"
        );


        $("#globalSearchActions")
        .classList
        .add(
            "hidden"
        );

    }
);



/* =========================================================
   INFO MODAL
========================================================= */

function openInfo(location) {

    state.selectedGlobalSearch =
        location;


    $("#infoTitle")
    .textContent =
        location.name;


    $("#infoParent")
    .textContent =
        location.parent;


    $("#infoDescription")
    .textContent =
        location.description
        ||
        "Detail informasi akan dilengkapi kemudian.";


    $("#infoModal")
    .classList
    .remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";

}


function closeInfo() {

    $("#infoModal")
    .classList
    .add(
        "hidden"
    );


    document.body.style.overflow =
        "";

}


$("#closeInfoModal")
.addEventListener(
    "click",
    closeInfo
);


$("#globalInfoButton")
.addEventListener(
    "click",
    () => {

        if(
            state.selectedGlobalSearch
        ) {

            openInfo(
                state.selectedGlobalSearch
            );

        }

    }
);


$("#globalNavigationButton")
.addEventListener(
    "click",
    () => {

        if(
            !state.selectedGlobalSearch
        ) {

            return;

        }


        selectDestination(
            state.selectedGlobalSearch
        );


        showPage(
            "navigation"
        );

    }
);


$("#infoNavigationButton")
.addEventListener(
    "click",
    () => {

        if(
            !state.selectedGlobalSearch
        ) {

            return;

        }


        const location =
            state.selectedGlobalSearch;


        closeInfo();


        selectDestination(
            location
        );


        showPage(
            "navigation"
        );

    }
);



/* =========================================================
   NAVIGATION SEARCH
========================================================= */

$("#navigationSearch")
.addEventListener(
    "input",
    event => {

        const value =
            event.target.value;


        if(!value) {

            $("#navigationResults")
            .innerHTML =
                `
                <div class="search-empty">
                    Ketik lokasi tujuan.
                </div>
                `;

            return;

        }


        renderSearchResults(

            searchLocations(
                value
            ),

            $("#navigationResults"),

            selectDestination

        );

    }
);


function selectDestination(
    location
) {

    state.destination =
        location;


    $("#navigationSearch").value =
        location.name;


    $("#navigationResults").innerHTML =
        "";


    $("#destinationName")
    .textContent =
        location.name;


    $("#destinationParent")
    .textContent =
        location.parent;


    $("#destinationFloor")
    .textContent =
        location.floor
            ?
        `Lantai ${location.floor}`
            :
        "";


    $("#selectedDestinationBox")
    .classList
    .remove(
        "hidden"
    );


    $("#navigate3D").disabled =
        false;


    $("#navigateAR").disabled =
        false;

}



/* =========================================================
   GET GEDUNG TUJUAN
========================================================= */

function getDestinationBuilding() {

    if(
        !state.destination
    ) {

        return null;

    }


    return getBuildingById(
        state.destination.buildingId
    );

}



/* =========================================================
   MODE NAVIGASI
========================================================= */

$("#navigate3D")
.addEventListener(
    "click",
    () => {

        state.navigationMode =
            "3d";


        openMapModal();

    }
);


$("#navigateAR")
.addEventListener(
    "click",
    () => {

        state.navigationMode =
            "ar";


        openMapModal();

    }
);



/* =========================================================
   GRAPH
========================================================= */

function pointDistance(
    a,
    b
) {

    return Math.hypot(

        b.x - a.x,

        b.y - a.y

    );

}


function createGraph() {

    const graph = {};


    Object.keys(
        mapNodes
    )
    .forEach(nodeId => {

        graph[nodeId] = [];

    });


    mapEdges.forEach(
        ([aId, bId]) => {

            const a =
                mapNodes[aId];

            const b =
                mapNodes[bId];


            if(
                !a ||
                !b
            ) {

                console.warn(
                    "Node edge tidak ditemukan:",
                    aId,
                    bId
                );

                return;

            }


            const distance =
                pointDistance(
                    a,
                    b
                );


            graph[aId].push({

                node: bId,

                distance

            });


            graph[bId].push({

                node: aId,

                distance

            });

        }
    );


    return graph;

}


const navigationGraph =
    createGraph();



/* =========================================================
   DIJKSTRA
========================================================= */

function shortestPath(
    start,
    target
) {

    const distances = {};
    const previous = {};


    const unvisited =
        new Set(
            Object.keys(
                mapNodes
            )
        );


    Object.keys(
        mapNodes
    )
    .forEach(nodeId => {

        distances[nodeId] =
            Infinity;

        previous[nodeId] =
            null;

    });


    distances[start] =
        0;


    while(
        unvisited.size > 0
    ) {

        let current =
            null;

        let currentDistance =
            Infinity;


        unvisited.forEach(nodeId => {

            if(
                distances[nodeId] <
                currentDistance
            ) {

                currentDistance =
                    distances[nodeId];

                current =
                    nodeId;

            }

        });


        if(
            current === null
        ) {

            break;

        }


        if(
            current === target
        ) {

            break;

        }


        unvisited.delete(
            current
        );


        navigationGraph[current]
        .forEach(edge => {

            if(
                !unvisited.has(
                    edge.node
                )
            ) {

                return;

            }


            const candidate =
                distances[current]
                +
                edge.distance;


            if(
                candidate <
                distances[edge.node]
            ) {

                distances[edge.node] =
                    candidate;

                previous[edge.node] =
                    current;

            }

        });

    }


    const path = [];

    let current =
        target;


    while(current) {

        path.unshift(
            current
        );


        if(
            current === start
        ) {

            break;

        }


        current =
            previous[current];

    }


    if(
        path[0] !== start
    ) {

        return {

            path: [],

            distance: Infinity

        };

    }


    return {

        path,

        distance:
            distances[target]

    };

}



/* =========================================================
   PROYEKSI TITIK KE EDGE

   Membuat posisi user benar-benar snap
   ke JALUR, bukan hanya node.
========================================================= */

function projectPointToSegment(
    point,
    a,
    b
) {

    const abX =
        b.x - a.x;

    const abY =
        b.y - a.y;


    const apX =
        point.x - a.x;

    const apY =
        point.y - a.y;


    const lengthSquared =
        abX * abX
        +
        abY * abY;


    let t =
        lengthSquared === 0
            ?
        0
            :
        (
            apX * abX
            +
            apY * abY
        )
        /
        lengthSquared;


    t =
        Math.max(
            0,
            Math.min(
                1,
                t
            )
        );


    const projected = {

        x:
            a.x + abX * t,

        y:
            a.y + abY * t

    };


    return {

        point:
            projected,

        t,

        distance:
            pointDistance(
                point,
                projected
            )

    };

}



/* =========================================================
   CARI EDGE TERDEKAT
========================================================= */

function snapToNearestEdge(
    position
) {

    let best = null;


    mapEdges.forEach(
        ([aId, bId]) => {

            const a =
                mapNodes[aId];

            const b =
                mapNodes[bId];


            const projection =
                projectPointToSegment(
                    position,
                    a,
                    b
                );


            if(
                !best
                ||
                projection.distance <
                best.distance
            ) {

                best = {

                    aId,

                    bId,

                    a,

                    b,

                    point:
                        projection.point,

                    t:
                        projection.t,

                    distance:
                        projection.distance

                };

            }

        }
    );


    return best;

}



/* =========================================================
   RUTE DARI SNAP POINT KE ENTRANCE

   Karena snap berada di tengah edge,
   sistem membandingkan:
   snap → endpoint A → tujuan
   snap → endpoint B → tujuan.
========================================================= */

function routeFromSnapToEntrance(
    snap,
    entranceId
) {

    const routeViaA =
        shortestPath(
            snap.aId,
            entranceId
        );


    const routeViaB =
        shortestPath(
            snap.bId,
            entranceId
        );


    const distanceToA =
        pointDistance(
            snap.point,
            snap.a
        );


    const distanceToB =
        pointDistance(
            snap.point,
            snap.b
        );


    const totalA =
        routeViaA.path.length
            ?
        distanceToA
        +
        routeViaA.distance
            :
        Infinity;


    const totalB =
        routeViaB.path.length
            ?
        distanceToB
        +
        routeViaB.distance
            :
        Infinity;


    if(
        !Number.isFinite(
            totalA
        )
        &&
        !Number.isFinite(
            totalB
        )
    ) {

        return null;

    }


    if(
        totalA <= totalB
    ) {

        return {

            entranceId,

            distance:
                totalA,

            nodePath:
                routeViaA.path,

            routePoints: [

                snap.point,

                ...routeViaA.path.map(
                    nodeId =>
                        mapNodes[nodeId]
                )

            ]

        };

    }


    return {

        entranceId,

        distance:
            totalB,

        nodePath:
            routeViaB.path,

        routePoints: [

            snap.point,

            ...routeViaB.path.map(
                nodeId =>
                    mapNodes[nodeId]
            )

        ]

    };

}



/* =========================================================
   CARI ENTRANCE TERBAIK

   Penting untuk:
   - Perkuliahan (lebih dari 1 akses)
   - Laboratorium (lebih dari 1 akses)
========================================================= */

function findBestEntranceRoute(
    snap,
    building
) {

    let best =
        null;


    building
    .entranceNodes
    .forEach(
        entranceId => {

            const result =
                routeFromSnapToEntrance(
                    snap,
                    entranceId
                );


            if(!result) {

                return;

            }


            if(
                !best
                ||
                result.distance <
                best.distance
            ) {

                best =
                    result;

            }

        }
    );


    return best;

}



/* =========================================================
   RENDER NETWORK
========================================================= */

function renderNetwork() {

    const svg =
        $("#networkSVG");


    svg.innerHTML =
        "";


    mapEdges.forEach(
        ([aId, bId]) => {

            const a =
                mapNodes[aId];

            const b =
                mapNodes[bId];


            const line =
                document.createElementNS(

                    "http://www.w3.org/2000/svg",

                    "line"

                );


            line.setAttribute(
                "x1",
                a.x
            );

            line.setAttribute(
                "y1",
                a.y
            );

            line.setAttribute(
                "x2",
                b.x
            );

            line.setAttribute(
                "y2",
                b.y
            );

            line.setAttribute(
                "class",
                "network-line"
            );


            svg.appendChild(
                line
            );

        }
    );

}



/* =========================================================
   RENDER ACCESS POINT KUNING
========================================================= */

function renderAccessPoints() {

    const layer =
        $("#accessPointLayer");


    layer.innerHTML =
        "";


    buildings.forEach(building => {

        building
        .entranceNodes
        .forEach(entranceId => {

            const node =
                mapNodes[entranceId];


            if(!node) {

                return;

            }


            const point =
                document.createElement(
                    "span"
                );


            point.className =
                "access-point";


            point.style.left =
                `${
                    (
                        node.x /
                        MAP_WIDTH
                    )
                    *
                    100
                }%`;


            point.style.top =
                `${
                    (
                        node.y /
                        MAP_HEIGHT
                    )
                    *
                    100
                }%`;


            point.title =
                building.name;


            layer.appendChild(
                point
            );

        });

    });

}



/* =========================================================
   MARKER POSITION
========================================================= */

function setMarkerPosition(
    element,
    point
) {

    element.style.left =
        `${
            (
                point.x /
                MAP_WIDTH
            )
            *
            100
        }%`;


    element.style.top =
        `${
            (
                point.y /
                MAP_HEIGHT
            )
            *
            100
        }%`;

}



/* =========================================================
   MODAL DENAH
========================================================= */

function openMapModal() {

    const building =
        getDestinationBuilding();


    if(!building) {

        toast(
            "Gedung tujuan tidak ditemukan."
        );

        return;

    }


    state.clickedPosition =
        null;

    state.snappedPosition =
        null;

    state.snappedEdge =
        null;

    state.destinationEntrance =
        null;

    state.routePoints =
        [];

    state.routeDistance =
        0;


    $("#startMarker")
    .classList
    .add(
        "hidden"
    );


    $("#activeRouteLine")
    .setAttribute(
        "points",
        ""
    );


    const defaultEntrance =
        building.entranceNodes[0];


    const defaultPoint =
        mapNodes[
            defaultEntrance
        ];


    setMarkerPosition(

        $("#destinationMarker"),

        defaultPoint

    );


    $("#destinationMarkerLabel")
    .textContent =
        building.shortName;


    $("#destinationMarker")
    .classList
    .remove(
        "hidden"
    );


    $("#mapStartStatus")
    .textContent =
        "Belum dipilih";


    $("#mapTargetStatus")
    .textContent =
        building.name;


    $("#mapDistanceStatus")
    .textContent =
        "-";


    $("#confirmNavigationRoute")
    .disabled =
        true;


    renderNetwork();

    renderAccessPoints();


    $("#mapModal")
    .classList
    .remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";

}


function closeMapModal() {

    $("#mapModal")
    .classList
    .add(
        "hidden"
    );


    document.body.style.overflow =
        "";

}


$("#closeMapModal")
.addEventListener(
    "click",
    closeMapModal
);



/* =========================================================
   USER TAP MAP
========================================================= */

$("#mapCanvas")
.addEventListener(
    "pointerdown",
    event => {

        const rect =
            $("#mapCanvas")
            .getBoundingClientRect();


        const position = {

            x:
                (
                    (
                        event.clientX -
                        rect.left
                    )
                    /
                    rect.width
                )
                *
                MAP_WIDTH,

            y:
                (
                    (
                        event.clientY -
                        rect.top
                    )
                    /
                    rect.height
                )
                *
                MAP_HEIGHT

        };


        state.clickedPosition =
            position;


        const snap =
            snapToNearestEdge(
                position
            );


        if(!snap) {

            return;

        }


        state.snappedEdge =
            snap;


        state.snappedPosition =
            snap.point;


        setMarkerPosition(

            $("#startMarker"),

            snap.point

        );


        $("#startMarker")
        .classList
        .remove(
            "hidden"
        );


        $("#mapStartStatus")
        .textContent =
            "Posisi disesuaikan ke jalur";


        calculateRoute();

    }
);



/* =========================================================
   CALCULATE ROUTE
========================================================= */

function calculateRoute() {

    const building =
        getDestinationBuilding();


    if(
        !building
        ||
        !state.snappedEdge
    ) {

        return;

    }


    const result =
        findBestEntranceRoute(

            state.snappedEdge,

            building

        );


    if(!result) {

        state.routePoints =
            [];


        $("#activeRouteLine")
        .setAttribute(
            "points",
            ""
        );


        $("#mapDistanceStatus")
        .textContent =
            "Rute tidak ditemukan";


        $("#confirmNavigationRoute")
        .disabled =
            true;


        return;

    }


    state.destinationEntrance =
        result.entranceId;


    state.routePoints =
        result.routePoints;


    state.routeDistance =
        result.distance;


    setMarkerPosition(

        $("#destinationMarker"),

        mapNodes[
            result.entranceId
        ]

    );


    drawRoute();


    $("#mapDistanceStatus")
    .textContent =
        `${
            Math.max(
                1,
                result.nodePath.length - 1
            )
        } segmen jalur`;


    $("#confirmNavigationRoute")
    .disabled =
        false;

}



/* =========================================================
   DRAW ACTIVE ROUTE
========================================================= */

function drawRoute() {

    if(
        state.routePoints.length === 0
    ) {

        $("#activeRouteLine")
        .setAttribute(
            "points",
            ""
        );

        return;

    }


    const points =
        state.routePoints

        .map(
            point =>
                `${point.x},${point.y}`
        )

        .join(
            " "
        );


    $("#activeRouteLine")
    .setAttribute(
        "points",
        points
    );

}



/* =========================================================
   RESET MAP
========================================================= */

$("#resetMapPosition")
.addEventListener(
    "click",
    () => {

        state.clickedPosition =
            null;

        state.snappedPosition =
            null;

        state.snappedEdge =
            null;

        state.destinationEntrance =
            null;

        state.routePoints =
            [];

        state.routeDistance =
            0;


        $("#startMarker")
        .classList
        .add(
            "hidden"
        );


        $("#activeRouteLine")
        .setAttribute(
            "points",
            ""
        );


        $("#mapStartStatus")
        .textContent =
            "Belum dipilih";


        $("#mapDistanceStatus")
        .textContent =
            "-";


        $("#confirmNavigationRoute")
        .disabled =
            true;

    }
);



/* =========================================================
   CONFIRM NAVIGATION
========================================================= */

$("#confirmNavigationRoute")
.addEventListener(
    "click",
    () => {

        if(
            state.routePoints.length ===
            0
        ) {

            return;

        }


        closeMapModal();


        if(
            state.navigationMode ===
            "3d"
        ) {

            start3DNavigation();

        }
        else {

            startARNavigation();

        }

    }
);



/* =========================================================
   3D NAVIGATION
========================================================= */

function start3DNavigation() {

    showPage(
        "viewer"
    );


    $("#viewerDestinationText")
    .textContent =
        state.destination.name;


    $("#viewerHUDDestination")
    .textContent =
        state.destination.name;


    $("#viewerDestinationMarker")
    .classList
    .remove(
        "hidden"
    );


    $("#viewerNavigationHUD")
    .classList
    .remove(
        "hidden"
    );


    toast(
        `Navigasi menuju ${state.destination.name} dimulai.`
    );

}


$("#stop3DNavigation")
.addEventListener(
    "click",
    () => {

        $("#viewerDestinationMarker")
        .classList
        .add(
            "hidden"
        );


        $("#viewerNavigationHUD")
        .classList
        .add(
            "hidden"
        );


        toast(
            "Navigasi 3D selesai."
        );

    }
);



/* =========================================================
   AR NAVIGATION
========================================================= */

function startARNavigation() {

    showPage(
        "ar"
    );


    $("#arNavigationDestination")
    .textContent =
        state.destination.name;


    $("#arNavigationInfo")
    .classList
    .remove(
        "hidden"
    );


    $("#trackingStatus")
    .textContent =
        "Siap memulai navigasi AR";


    $("#trackingHint")
    .textContent =
        `Tujuan: ${state.destination.name}. Arahkan kamera ke bidang datar.`;


    setTimeout(
        launchAR,
        500
    );

}



/* =========================================================
   MODEL VIEWER
========================================================= */

const mainModelViewer =
    $("#mainModelViewer");


const arModelViewer =
    $("#arModelViewer");


mainModelViewer
.addEventListener(
    "load",
    () => {

        $("#modelStatus")
        .textContent =
            "Model berhasil dimuat";

    }
);


mainModelViewer
.addEventListener(
    "error",
    () => {

        $("#modelStatus")
        .textContent =
            "Model gagal dimuat";


        toast(
            "Periksa file assets/models/biro-fakultas-teknik.glb"
        );

    }
);


$("#resetCamera")
.addEventListener(
    "click",
    () => {

        mainModelViewer.cameraOrbit =
            "0deg 75deg 105%";


        mainModelViewer.cameraTarget =
            "auto auto auto";


        toast(
            "Kamera 3D direset."
        );

    }
);



/* =========================================================
   AR
========================================================= */

async function launchAR() {

    $("#trackingStatus")
    .textContent =
        "Membuka kamera...";


    $("#trackingHint")
    .textContent =
        "Berikan izin kamera jika browser meminta.";


    try {

        await arModelViewer.activateAR();

    }
    catch(error) {

        console.error(
            error
        );


        $("#trackingStatus")
        .textContent =
            "AR tidak dapat dibuka";


        $("#trackingHint")
        .textContent =
            "Pastikan perangkat mendukung AR dan website dibuka melalui HTTPS.";


        toast(
            "AR tidak tersedia pada perangkat ini."
        );

    }

}


$("#launchAR")
.addEventListener(
    "click",
    launchAR
);


arModelViewer
.addEventListener(
    "ar-status",
    event => {

        const status =
            event.detail.status;


        if(
            status ===
            "session-started"
        ) {

            $("#trackingStatus")
            .textContent =
                "Kamera AR aktif";


            $("#trackingHint")
            .textContent =
                "Gerakkan kamera perlahan untuk mendeteksi bidang.";

        }


        if(
            status ===
            "object-placed"
        ) {

            $("#trackingStatus")
            .textContent =
                "Tracking aktif";


            $("#trackingHint")
            .textContent =
                "Objek telah ditempatkan pada bidang.";

        }


        if(
            status ===
            "not-presenting"
        ) {

            $("#trackingStatus")
            .textContent =
                "Sesi AR selesai";

        }

    }
);


$("#resetAR")
.addEventListener(
    "click",
    () => {

        $("#trackingStatus")
        .textContent =
            "AR direset";


        $("#trackingHint")
        .textContent =
            "Buka kamera kembali untuk melakukan tracking ulang.";


        $("#arNavigationInfo")
        .classList
        .add(
            "hidden"
        );


        toast(
            "AR telah direset."
        );

    }
);



/* =========================================================
   DIRECTORY
========================================================= */

function renderDirectory() {

    const container =
        $("#directoryContainer");


    container.innerHTML =
        "";


    buildings.forEach(
        (building, index) => {

            const buildingRooms =
                rooms.filter(
                    room =>
                        room.buildingId ===
                        building.id
                );


            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "building-card";


            article.innerHTML =
                `
                <button
                    class="building-button"
                    type="button">

                    <span class="building-index">

                        ${String(
                            index + 1
                        ).padStart(
                            2,
                            "0"
                        )}

                    </span>

                    <span>

                        <strong>
                            ${building.name}
                        </strong>

                        <p>
                            ${building.description}
                        </p>

                    </span>

                    <span class="building-chevron">
                        ›
                    </span>

                </button>

                <div class="building-content">
                </div>
                `;


            const header =
                article.querySelector(
                    ".building-button"
                );


            const content =
                article.querySelector(
                    ".building-content"
                );


            header.addEventListener(
                "click",
                () => {

                    article.classList.toggle(
                        "open"
                    );

                }
            );


            if(
                building.id ===
                "laboratorium-ft"
            ) {

                renderLaboratoryDirectory(

                    building,

                    buildingRooms,

                    content

                );

            }
            else {

                renderRoomList(

                    building,

                    buildingRooms,

                    content

                );

            }


            container.appendChild(
                article
            );

        }
    );

}



/* =========================================================
   LAB DIRECTORY
========================================================= */

function renderLaboratoryDirectory(
    building,
    buildingRooms,
    container
) {

    const floorButtons =
        document.createElement(
            "div"
        );


    floorButtons.className =
        "floor-buttons";


    const roomArea =
        document.createElement(
            "div"
        );


    [1, 2, 3]
    .forEach(floor => {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "floor-button"
            +
            (
                floor === 1
                    ?
                " active"
                    :
                ""
            );


        button.textContent =
            `Lantai ${floor}`;


        button.addEventListener(
            "click",
            () => {

                floorButtons
                .querySelectorAll(
                    ".floor-button"
                )
                .forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                renderRoomList(

                    building,

                    buildingRooms.filter(
                        room =>
                            room.floor ===
                            floor
                    ),

                    roomArea

                );

            }
        );


        floorButtons.appendChild(
            button
        );

    });


    container.appendChild(
        floorButtons
    );


    container.appendChild(
        roomArea
    );


    renderRoomList(

        building,

        buildingRooms.filter(
            room =>
                room.floor === 1
        ),

        roomArea

    );

}



/* =========================================================
   ROOM LIST
========================================================= */

function renderRoomList(
    building,
    roomList,
    container
) {

    container.innerHTML =
        "";


    if(
        roomList.length === 0
    ) {

        container.innerHTML =
            `
            <div class="search-empty">
                Data ruangan akan dilengkapi kemudian.
            </div>
            `;

        return;

    }


    const grid =
        document.createElement(
            "div"
        );


    grid.className =
        "room-grid";


    roomList.forEach(room => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "room-item";


        item.innerHTML =
            `
            <span>
                ${room.name}
            </span>

            <button type="button">
                Informasi
            </button>
            `;


        item
        .querySelector(
            "button"
        )
        .addEventListener(
            "click",
            () => {

                const location =
                    locations.find(
                        item =>
                            item.id ===
                            room.id
                    );


                if(location) {

                    openInfo(
                        location
                    );

                }

            }
        );


        grid.appendChild(
            item
        );

    });


    container.appendChild(
        grid
    );

}


renderDirectory();



/* =========================================================
   MAIN BUTTONS
========================================================= */

function openViewer() {

    showPage(
        "viewer"
    );

}


function openNavigation() {

    showPage(
        "navigation"
    );


    setTimeout(
        () => {

            $("#navigationSearch")
            .focus();

        },
        250
    );

}


/* 3D */

$("#home3DButton")
.addEventListener(
    "click",
    openViewer
);

$("#feature3DButton")
.addEventListener(
    "click",
    openViewer
);

$("#menu3D")
.addEventListener(
    "click",
    openViewer
);


/* AR */

$("#homeARButton")
.addEventListener(
    "click",
    () => showPage(
        "ar"
    )
);

$("#featureARButton")
.addEventListener(
    "click",
    () => showPage(
        "ar"
    )
);

$("#menuAR")
.addEventListener(
    "click",
    () => {

        showPage(
            "ar"
        );


        setTimeout(
            launchAR,
            400
        );

    }
);


/* NAVIGATION */

$("#homeNavigationButton")
.addEventListener(
    "click",
    openNavigation
);

$("#featureNavigationButton")
.addEventListener(
    "click",
    openNavigation
);

$("#menuNavigation")
.addEventListener(
    "click",
    openNavigation
);


/* DIRECTORY */

$("#homeDirectoryButton")
.addEventListener(
    "click",
    () => showPage(
        "directory"
    )
);

$("#menuDirectory")
.addEventListener(
    "click",
    () => showPage(
        "directory"
    )
);



/* =========================================================
   MODAL BACKDROP
========================================================= */

$$("[data-close-modal]")
.forEach(backdrop => {

    backdrop.addEventListener(
        "click",
        () => {

            if(
                backdrop.dataset.closeModal ===
                "info"
            ) {

                closeInfo();

            }


            if(
                backdrop.dataset.closeModal ===
                "map"
            ) {

                closeMapModal();

            }

        }
    );

});



/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function toast(message) {

    const element =
        $("#toast");


    element.textContent =
        message;


    element.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                element.classList.remove(
                    "show"
                );

            },
            3300
        );

}



/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key !==
            "Escape"
        ) {

            return;

        }


        closeDrawer();


        if(
            !$("#infoModal")
            .classList
            .contains(
                "hidden"
            )
        ) {

            closeInfo();

        }


        if(
            !$("#mapModal")
            .classList
            .contains(
                "hidden"
            )
        ) {

            closeMapModal();

        }

    }
);



/* =========================================================
   INITIAL
========================================================= */

renderNetwork();

renderAccessPoints();
