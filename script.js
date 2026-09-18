import {

    buildings,

    rooms,

    mapNodes,

    mapEdges,

    getBuildingById

} from "./data/map-data.js";



/* =====================================================
   HELPERS
===================================================== */

const $ =
    selector =>
        document.querySelector(selector);


const $$ =
    selector =>
        [...document.querySelectorAll(selector)];



/* =====================================================
   STATE
===================================================== */

const state = {

    currentSlide: 0,

    selectedGlobalSearch: null,

    destination: null,

    navigationMode: null,

    startPosition: null,

    startNode: null,

    destinationEntrance: null,

    route: [],

    routeDistance: 0

};



/* =====================================================
   LOCATION DATABASE INDEX
===================================================== */

const locations = [];


buildings.forEach(

    building => {

        locations.push({

            id:
                building.id,

            type:
                "building",

            name:
                building.name,

            buildingId:
                building.id,

            parent:
                "Fakultas Teknik UISU",

            floor:
                building.actualFloor,

            description:
                building.description

        });

    }

);


rooms.forEach(

    room => {

        const building =
            getBuildingById(
                room.buildingId
            );


        locations.push({

            ...room,

            type:
                "room",

            parent:
                building
                    ? building.name
                    : "Fakultas Teknik UISU",

            description:

                `${room.name} berada di ${
                    building
                        ? building.name
                        : "Fakultas Teknik UISU"
                }, lantai ${room.floor}.`

        });

    }

);



/* =====================================================
   DRAWER
===================================================== */

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


$("#hamburgerButton").addEventListener(

    "click",

    openDrawer

);


$("#closeDrawer").addEventListener(

    "click",

    closeDrawer

);


drawerOverlay.addEventListener(

    "click",

    closeDrawer

);



/* =====================================================
   PAGE
===================================================== */

function showPage(page) {

    $$(".page").forEach(

        element => {

            element.classList.remove(
                "active"
            );

        }

    );


    const target =
        $("#" + page + "Page");


    if(target) {

        target.classList.add(
            "active"
        );

    }


    $$(".header-link").forEach(

        button => {

            button.classList.toggle(

                "active",

                button.dataset.page === page

            );

        }

    );


    closeDrawer();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}



$$("[data-page]").forEach(

    button => {

        button.addEventListener(

            "click",

            () => {

                showPage(
                    button.dataset.page
                );

            }

        );

    }

);


$("#logoHome").addEventListener(

    "click",

    () =>
        showPage(
            "home"
        )

);



/* =====================================================
   SLIDER 20 DETIK
===================================================== */

const slides =
    $$(".slide");


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

        (
            slide,
            slideIndex
        ) => {

            slide.classList.toggle(

                "active",

                slideIndex === index

            );

        }

    );


    $$(".dot").forEach(

        (
            dot,
            dotIndex
        ) => {

            dot.classList.toggle(

                "active",

                dotIndex === index

            );

        }

    );

}


function startSlider() {

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


$("#nextSlide").addEventListener(

    "click",

    () => {

        showSlide(
            state.currentSlide + 1
        );

        startSlider();

    }

);


$("#prevSlide").addEventListener(

    "click",

    () => {

        showSlide(
            state.currentSlide - 1
        );

        startSlider();

    }

);


$$(".dot").forEach(

    dot => {

        dot.addEventListener(

            "click",

            () => {

                showSlide(

                    Number(
                        dot.dataset.slide
                    )

                );

                startSlider();

            }

        );

    }

);


startSlider();



/* =====================================================
   SEARCH
===================================================== */

function searchLocations(value) {

    const query =
        value
        .trim()
        .toLowerCase();


    if(!query) {

        return [];

    }


    return locations
        .filter(

            location => {

                const text =
                    `${location.name} ${location.parent}`
                    .toLowerCase();


                return text.includes(
                    query
                );

            }

        )
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


    if(results.length === 0) {

        container.innerHTML =

            `

            <div class="empty-search">

                Lokasi tidak ditemukan.

            </div>

            `;


        container.classList.remove(
            "hidden"
        );


        return;

    }


    results.forEach(

        location => {

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
                                " • Lantai " +
                                location.floor
                                :
                                ""
                        }

                    </small>

                </span>

                <span class="type-badge">

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

                () =>
                    callback(
                        location
                    )

            );


            container.appendChild(
                button
            );

        }

    );


    container.classList.remove(
        "hidden"
    );

}



/* =====================================================
   GLOBAL SEARCH
===================================================== */

$("#globalSearch").addEventListener(

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


$("#clearSearch").addEventListener(

    "click",

    () => {

        $("#globalSearch").value =
            "";


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


        state.selectedGlobalSearch =
            null;

    }

);



/* =====================================================
   INFO
===================================================== */

function openInfo(location) {

    state.selectedGlobalSearch =
        location;


    $("#infoTitle").textContent =
        location.name;


    $("#infoParent").textContent =
        location.parent;


    $("#infoDescription").textContent =

        location.description

        ||

        "Detail informasi akan dilengkapi kemudian.";


    $("#infoModal").classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";

}


function closeInfo() {

    $("#infoModal").classList.add(
        "hidden"
    );


    document.body.style.overflow =
        "";

}


$("#globalInfoButton").addEventListener(

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


$("#closeInfoModal").addEventListener(

    "click",

    closeInfo

);


$("#globalNavigationButton").addEventListener(

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


$("#infoNavigationButton").addEventListener(

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



/* =====================================================
   NAVIGATION SEARCH
===================================================== */

$("#navigationSearch").addEventListener(

    "input",

    event => {

        const value =
            event.target.value;


        if(!value) {

            $("#navigationResults").innerHTML =

                `

                <div class="empty-search">

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



function selectDestination(location) {

    state.destination =
        location;


    $("#navigationSearch").value =
        location.name;


    $("#navigationResults").innerHTML =
        "";


    $("#destinationName").textContent =
        location.name;


    $("#destinationParent").textContent =
        location.parent;


    $("#destinationFloor").textContent =

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



/* =====================================================
   DESTINATION BUILDING
===================================================== */

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



/* =====================================================
   MODE
===================================================== */

$("#navigate3D").addEventListener(

    "click",

    () => {

        state.navigationMode =
            "3d";


        openMapModal();

    }

);


$("#navigateAR").addEventListener(

    "click",

    () => {

        state.navigationMode =
            "ar";


        openMapModal();

    }

);



/* =====================================================
   GRAPH
===================================================== */

function nodeDistance(

    nodeA,
    nodeB

) {

    return Math.hypot(

        nodeA.x -
        nodeB.x,

        nodeA.y -
        nodeB.y

    );

}



function createGraph() {

    const graph =
        {};


    Object.keys(
        mapNodes
    ).forEach(

        nodeId => {

            graph[nodeId] =
                [];

        }

    );


    mapEdges.forEach(

        (
            [
                nodeA,
                nodeB
            ]
        ) => {

            const distance =
                nodeDistance(

                    mapNodes[nodeA],

                    mapNodes[nodeB]

                );


            graph[nodeA].push({

                node:
                    nodeB,

                distance

            });


            graph[nodeB].push({

                node:
                    nodeA,

                distance

            });

        }

    );


    return graph;

}


const navigationGraph =
    createGraph();



/* =====================================================
   DIJKSTRA
===================================================== */

function shortestPath(

    start,
    target

) {

    const distances =
        {};


    const previous =
        {};


    const unvisited =
        new Set(

            Object.keys(
                mapNodes
            )

        );


    Object.keys(
        mapNodes
    ).forEach(

        node => {

            distances[node] =
                Infinity;

            previous[node] =
                null;

        }

    );


    distances[start] =
        0;


    while(
        unvisited.size > 0
    ) {

        let current =
            null;


        let smallest =
            Infinity;


        unvisited.forEach(

            node => {

                if(
                    distances[node] <
                    smallest
                ) {

                    smallest =
                        distances[node];

                    current =
                        node;

                }

            }

        );


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
            .forEach(

                edge => {

                    if(
                        !unvisited.has(
                            edge.node
                        )
                    ) {

                        return;

                    }


                    const distance =

                        distances[current]

                        +

                        edge.distance;


                    if(
                        distance <
                        distances[edge.node]
                    ) {

                        distances[edge.node] =
                            distance;

                        previous[edge.node] =
                            current;

                    }

                }

            );

    }


    const path =
        [];


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

            distance:
                Infinity

        };

    }


    return {

        path,

        distance:
            distances[target]

    };

}



/* =====================================================
   NEAREST NODE
===================================================== */

function findNearestNode(position) {

    let nearest =
        null;


    let nearestDistance =
        Infinity;


    Object.entries(
        mapNodes
    ).forEach(

        (
            [
                nodeId,
                node
            ]
        ) => {

            const distance =
                Math.hypot(

                    position.x -
                    node.x,

                    position.y -
                    node.y

                );


            if(
                distance <
                nearestDistance
            ) {

                nearest =
                    nodeId;


                nearestDistance =
                    distance;

            }

        }

    );


    return nearest;

}



/* =====================================================
   BEST ENTRANCE
===================================================== */

function findBestBuildingEntrance(

    startNode,
    building

) {

    const entrances =

        building.entranceNodes

        ||

        (
            building.entranceNode

                ?

            [
                building.entranceNode
            ]

                :

            []
        );


    let bestResult =
        null;


    entrances.forEach(

        entranceNode => {

            const result =
                shortestPath(

                    startNode,

                    entranceNode

                );


            if(
                result.path.length === 0
            ) {

                return;

            }


            if(
                !bestResult

                ||

                result.distance <
                bestResult.distance
            ) {

                bestResult = {

                    ...result,

                    entranceNode

                };

            }

        }

    );


    return bestResult;

}



/* =====================================================
   RENDER NETWORK
===================================================== */

function renderNetwork() {

    const svg =
        $("#networkSVG");


    svg.innerHTML =
        "";


    mapEdges.forEach(

        (
            [
                nodeA,
                nodeB
            ]
        ) => {

            const a =
                mapNodes[nodeA];


            const b =
                mapNodes[nodeB];


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



/* =====================================================
   ACCESS POINT
===================================================== */

function renderAccessPoints() {

    const layer =
        $("#accessPointLayer");


    layer.innerHTML =
        "";


    buildings.forEach(

        building => {

            const entrances =

                building.entranceNodes

                ||

                (
                    building.entranceNode

                        ?

                    [
                        building.entranceNode
                    ]

                        :

                    []
                );


            entrances.forEach(

                entranceId => {

                    const node =
                        mapNodes[
                            entranceId
                        ];


                    if(!node) {

                        return;

                    }


                    const point =
                        document.createElement(
                            "div"
                        );


                    point.className =
                        "access-point";


                    point.style.left =
                        `${node.x / 10}%`;


                    point.style.top =
                        `${node.y / 10}%`;


                    point.title =
                        building.name;


                    layer.appendChild(
                        point
                    );

                }

            );

        }

    );

}



/* =====================================================
   MAP MODAL
===================================================== */

function openMapModal() {

    const building =
        getDestinationBuilding();


    if(!building) {

        toast(
            "Gedung tujuan tidak ditemukan."
        );

        return;

    }


    state.startPosition =
        null;


    state.startNode =
        null;


    state.destinationEntrance =
        null;


    state.route =
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


    $("#destinationMarkerLabel")
        .textContent =
        building.shortName;


    /*
        Sebelum posisi user dipilih,
        tampilkan entrance pertama.
    */

    const firstEntrance =
        building.entranceNodes[0];


    const destinationNode =
        mapNodes[
            firstEntrance
        ];


    setMarkerPosition(

        $("#destinationMarker"),

        destinationNode

    );


    $("#destinationMarker")
        .classList
        .remove(
            "hidden"
        );


    $("#mapTargetStatus")
        .textContent =
        building.name;


    $("#mapStartStatus")
        .textContent =
        "Belum dipilih";


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


$("#closeMapModal").addEventListener(

    "click",

    closeMapModal

);



/* =====================================================
   MAP CLICK
===================================================== */

$("#mapCanvas").addEventListener(

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

                1000,


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

                1000

        };


        state.startPosition =
            position;


        state.startNode =
            findNearestNode(
                position
            );


        setMarkerPosition(

            $("#startMarker"),

            position

        );


        $("#startMarker")
            .classList
            .remove(
                "hidden"
            );


        $("#mapStartStatus")
            .textContent =
            "Posisi dipilih";


        calculateCurrentRoute();

    }

);



/* =====================================================
   MARKER POSITION
===================================================== */

function setMarkerPosition(

    element,
    position

) {

    element.style.left =
        `${position.x / 10}%`;


    element.style.top =
        `${position.y / 10}%`;

}



/* =====================================================
   CALCULATE ROUTE
===================================================== */

function calculateCurrentRoute() {

    const building =
        getDestinationBuilding();


    if(
        !building

        ||

        !state.startNode
    ) {

        return;

    }


    const result =
        findBestBuildingEntrance(

            state.startNode,

            building

        );


    if(!result) {

        state.route =
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


    state.route =
        result.path;


    state.routeDistance =
        result.distance;


    state.destinationEntrance =
        result.entranceNode;


    const destinationNode =
        mapNodes[
            result.entranceNode
        ];


    setMarkerPosition(

        $("#destinationMarker"),

        destinationNode

    );


    drawRoute();


    $("#mapDistanceStatus")
        .textContent =
        `${result.path.length - 1} segmen jalur`;


    $("#confirmNavigationRoute")
        .disabled =
        false;

}



/* =====================================================
   DRAW ROUTE
===================================================== */

function drawRoute() {

    if(
        state.route.length === 0
    ) {

        $("#activeRouteLine")
            .setAttribute(
                "points",
                ""
            );

        return;

    }


    const points =
        [];


    if(
        state.startPosition
    ) {

        points.push(

            `${state.startPosition.x},${state.startPosition.y}`

        );

    }


    state.route.forEach(

        nodeId => {

            const node =
                mapNodes[nodeId];


            points.push(

                `${node.x},${node.y}`

            );

        }

    );


    $("#activeRouteLine")
        .setAttribute(

            "points",

            points.join(
                " "
            )

        );

}



/* =====================================================
   RESET MAP
===================================================== */

$("#resetMapPosition").addEventListener(

    "click",

    () => {

        state.startPosition =
            null;


        state.startNode =
            null;


        state.destinationEntrance =
            null;


        state.route =
            [];


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



/* =====================================================
   CONFIRM ROUTE
===================================================== */

$("#confirmNavigationRoute").addEventListener(

    "click",

    () => {

        if(
            state.route.length === 0
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



/* =====================================================
   3D NAVIGATION
===================================================== */

function start3DNavigation() {

    const building =
        getDestinationBuilding();


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

        `Rute menuju ${building.name} dimulai.`

    );

}


$("#stop3DNavigation").addEventListener(

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



/* =====================================================
   AR NAVIGATION
===================================================== */

async function startARNavigation() {

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
        `Tujuan: ${state.destination.name}. Buka kamera dan lakukan tracking bidang datar.`;


    setTimeout(

        () => {

            launchAR();

        },

        500

    );

}



/* =====================================================
   MODEL VIEWER
===================================================== */

const mainModelViewer =
    $("#mainModelViewer");


const arModelViewer =
    $("#arModelViewer");


mainModelViewer.addEventListener(

    "load",

    () => {

        $("#modelStatus")
            .textContent =
            "Model berhasil dimuat";

    }

);


mainModelViewer.addEventListener(

    "error",

    () => {

        $("#modelStatus")
            .textContent =
            "Model gagal dimuat";


        toast(

            "Periksa file biro-fakultas-teknik.glb"

        );

    }

);


$("#resetCamera").addEventListener(

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



/* =====================================================
   AR
===================================================== */

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
            "AR gagal dibuka";


        $("#trackingHint")
            .textContent =
            "Pastikan perangkat mendukung AR dan website menggunakan HTTPS.";


        toast(
            "AR tidak tersedia pada perangkat ini."
        );

    }

}


$("#launchAR").addEventListener(

    "click",

    launchAR

);


arModelViewer.addEventListener(

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
                "Model telah ditempatkan pada bidang.";

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


$("#resetAR").addEventListener(

    "click",

    () => {

        $("#trackingStatus")
            .textContent =
            "AR direset";


        $("#trackingHint")
            .textContent =
            "Buka kamera kembali untuk tracking ulang.";


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



/* =====================================================
   DIRECTORY
===================================================== */

function renderDirectory() {

    const container =
        $("#directoryContainer");


    container.innerHTML =
        "";


    buildings.forEach(

        (
            building,
            index
        ) => {

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
                    class="building-header"
                    type="button">

                    <span class="building-number">

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

                    <strong>
                        ›
                    </strong>

                </button>

                <div class="building-content">
                </div>

                `;


            const header =
                article.querySelector(
                    ".building-header"
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



/* =====================================================
   LAB DIRECTORY
===================================================== */

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


    [1,2,3].forEach(

        floor => {

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
                            "button"
                        )
                        .forEach(

                            item =>
                                item.classList.remove(
                                    "active"
                                )

                        );


                    button.classList.add(
                        "active"
                    );


                    renderRoomList(

                        building,

                        buildingRooms.filter(

                            room =>
                                room.floor === floor

                        ),

                        roomArea

                    );

                }

            );


            floorButtons.appendChild(
                button
            );

        }

    );


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



/* =====================================================
   ROOM LIST
===================================================== */

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

            <div class="empty-search">

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


    roomList.forEach(

        room => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "room";


            item.innerHTML =

                `

                <span>
                    ${room.name}
                </span>

                <button type="button">
                    Informasi
                </button>

                `;


            item.querySelector(
                "button"
            ).addEventListener(

                "click",

                () => {

                    const location =
                        locations.find(

                            location =>
                                location.id ===
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

        }

    );


    container.appendChild(
        grid
    );

}


renderDirectory();



/* =====================================================
   MAIN BUTTONS
===================================================== */

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

            $("#navigationSearch").focus();

        },

        250

    );

}


$("#home3DButton").addEventListener(
    "click",
    openViewer
);


$("#feature3DButton").addEventListener(
    "click",
    openViewer
);


$("#menu3D").addEventListener(
    "click",
    openViewer
);


$("#homeARButton").addEventListener(

    "click",

    () =>
        showPage(
            "ar"
        )

);


$("#featureARButton").addEventListener(

    "click",

    () =>
        showPage(
            "ar"
        )

);


$("#menuAR").addEventListener(

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


$("#homeNavigationButton").addEventListener(
    "click",
    openNavigation
);


$("#featureNavigationButton").addEventListener(
    "click",
    openNavigation
);


$("#menuNavigation").addEventListener(
    "click",
    openNavigation
);


$("#homeDirectoryButton").addEventListener(

    "click",

    () =>
        showPage(
            "directory"
        )

);


$("#menuDirectory").addEventListener(

    "click",

    () =>
        showPage(
            "directory"
        )

);



/* =====================================================
   MODAL OVERLAY
===================================================== */

$$("[data-close-modal]").forEach(

    overlay => {

        overlay.addEventListener(

            "click",

            () => {

                if(
                    overlay.dataset.closeModal ===
                    "info"
                ) {

                    closeInfo();

                }


                if(
                    overlay.dataset.closeModal ===
                    "map"
                ) {

                    closeMapModal();

                }

            }

        );

    }

);



/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function toast(message) {

    const toastElement =
        $("#toast");


    toastElement.textContent =
        message;


    toastElement.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(

            () => {

                toastElement.classList.remove(
                    "show"
                );

            },

            3500

        );

}



/* =====================================================
   ESC
===================================================== */

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



/* =====================================================
   INITIAL
===================================================== */

renderNetwork();

renderAccessPoints();