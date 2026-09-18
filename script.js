import {

    MAP_WIDTH,
    MAP_HEIGHT,

    buildings,
    rooms,

    mapNodes,
    mapEdges,

    getBuildingById

} from "./data/map-data.js?v=9";



/* =====================================================
   DOM SHORTCUT
===================================================== */

const $ =
    selector =>
        document.querySelector(
            selector
        );


const $$ =
    selector =>
        [
            ...document.querySelectorAll(
                selector
            )
        ];



/* =====================================================
   STATE
===================================================== */

const state = {

    currentSlide:
        0,

    globalSelection:
        null,

    destination:
        null,

    startPosition:
        null,

    startNode:
        null,

    entranceId:
        null,

    route:
        [],

    routeDistance:
        0,

    cameraStream:
        null

};



/* =====================================================
   SEARCH DATABASE
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
                    ?
                    building.name
                    :
                    "Fakultas Teknik UISU",

            description:

                `${room.name} berada di ${building.name}${
                    room.floor
                        ?
                        `, lantai ${room.floor}`
                        :
                        ""
                }.`

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



/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageName) {

    $$(".page")
    .forEach(

        page => {

            page.classList.remove(
                "active"
            );

        }

    );


    const target =
        $("#" + pageName + "Page");


    if(target) {

        target.classList.add(
            "active"
        );

    }


    $$(".header-link")
    .forEach(

        button => {

            button.classList.toggle(

                "active",

                button.dataset.page ===
                pageName

            );

        }

    );


    if(
        pageName !==
        "arNavigation"
    ) {

        stopNavigationCamera();

    }


    closeDrawer();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


$$("[data-page]")
.forEach(

    button => {

        button.addEventListener(

            "click",

            () =>
                showPage(
                    button.dataset.page
                )

        );

    }

);


$("#logoHome")
.addEventListener(

    "click",

    () =>
        showPage(
            "home"
        )

);



/* =====================================================
   HOME SLIDER
===================================================== */

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

        (
            slide,
            slideIndex
        ) => {

            slide.classList.toggle(

                "active",

                slideIndex ===
                index

            );

        }

    );


    $$(".slider-dot")
    .forEach(

        (
            dot,
            dotIndex
        ) => {

            dot.classList.toggle(

                "active",

                dotIndex ===
                index

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


$$(".slider-dot")
.forEach(

    dot => {

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

    }

);


restartSlider();



/* =====================================================
   SEARCH ENGINE
===================================================== */

function normalizeText(value) {

    return String(
        value
    )
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

        .filter(

            location => {

                const text =
                    normalizeText(

                        `${location.name} ${location.parent}`

                    );


                return text.includes(
                    query
                );

            }

        )

        .slice(
            0,
            30
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
        results.length ===
        0
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

$("#globalSearch")
.addEventListener(

    "input",

    event => {

        const value =
            event.target.value;


        state.globalSelection =
            null;


        $("#globalSelectedLocation")
        .classList
        .add(
            "hidden"
        );


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

                state.globalSelection =
                    location;


                $("#globalSearch").value =
                    location.name;


                $("#globalSelectedName")
                .textContent =
                    location.name;


                $("#globalSearchResults")
                .classList
                .add(
                    "hidden"
                );


                $("#globalSelectedLocation")
                .classList
                .remove(
                    "hidden"
                );

            }

        );

    }

);


$("#clearGlobalSearch")
.addEventListener(

    "click",

    () => {

        $("#globalSearch").value =
            "";


        state.globalSelection =
            null;


        $("#globalSearchResults")
        .classList
        .add(
            "hidden"
        );


        $("#globalSelectedLocation")
        .classList
        .add(
            "hidden"
        );

    }

);



/* =====================================================
   INFO
===================================================== */

function openInfo(location) {

    state.globalSelection =
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


$("#infoModalBackdrop")
.addEventListener(

    "click",

    closeInfo

);


$("#globalInfoButton")
.addEventListener(

    "click",

    () => {

        if(
            state.globalSelection
        ) {

            openInfo(
                state.globalSelection
            );

        }

    }

);


$("#globalNavigationButton")
.addEventListener(

    "click",

    () => {

        if(
            !state.globalSelection
        ) {

            return;

        }


        openNavigationPage(

            state.globalSelection

        );

    }

);


$("#infoNavigationButton")
.addEventListener(

    "click",

    () => {

        if(
            !state.globalSelection
        ) {

            return;

        }


        const location =
            state.globalSelection;


        closeInfo();


        openNavigationPage(
            location
        );

    }

);



/* =====================================================
   NAVIGATION PAGE
===================================================== */

function resetNavigation() {

    state.destination =
        null;

    state.startPosition =
        null;

    state.startNode =
        null;

    state.entranceId =
        null;

    state.route =
        [];


    $("#navigationSearch").value =
        "";


    $("#navigationResults")
    .innerHTML =

        `
        <div class="search-empty">

            Ketik lokasi tujuan.

        </div>
        `;


    $("#navigationDestination")
    .classList
    .add(
        "hidden"
    );


    $("#navigationMapSection")
    .classList
    .add(
        "hidden"
    );


    clearNavigationRoute();

}


function openNavigationPage(

    destination = null

) {

    showPage(
        "navigation"
    );


    resetNavigation();


    if(destination) {

        selectNavigationDestination(
            destination
        );

    }


    setTimeout(

        () => {

            $("#navigationSearch")
            .focus();

        },

        200

    );

}



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

            selectNavigationDestination

        );

    }

);



function selectNavigationDestination(
    location
) {

    state.destination =
        location;


    $("#navigationSearch").value =
        location.name;


    $("#navigationResults").innerHTML =
        "";


    $("#navigationDestinationName")
    .textContent =
        location.name;


    $("#navigationDestinationBuilding")
    .textContent =
        location.parent;


    $("#navigationDestination")
    .classList
    .remove(
        "hidden"
    );


    $("#navigationMapSection")
    .classList
    .remove(
        "hidden"
    );


    const building =
        getDestinationBuilding();


    $("#navigationTargetStatus")
    .textContent =
        building.name;


    $("#navigationMapTitle")
    .textContent =
        "Tandai posisi Anda sekarang";


    $("#navigationMapInstruction")
    .textContent =
        "Tap pada denah sesuai posisi Anda saat ini.";


    clearNavigationRoute();


    showDestinationHighlight(
        building
    );


    setTimeout(

        () => {

            $("#navigationMapSection")
            .scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        },

        150

    );

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
   HIGHLIGHT BUILDING
===================================================== */

function showDestinationHighlight(
    building
) {

    const highlight =
        $("#destinationHighlight");


    setElementPosition(

        highlight,

        building.mapMarker

    );


    highlight.classList.remove(
        "hidden"
    );

}



/* =====================================================
   INTERNAL GRAPH
===================================================== */

function distance(
    a,
    b
) {

    return Math.hypot(

        a.x - b.x,

        a.y - b.y

    );

}



function createGraph() {

    const graph =
        {};


    Object.keys(
        mapNodes
    )
    .forEach(

        nodeId => {

            graph[nodeId] =
                [];

        }

    );


    mapEdges.forEach(

        (
            [
                aId,
                bId
            ]
        ) => {

            const a =
                mapNodes[aId];


            const b =
                mapNodes[bId];


            const edgeDistance =
                distance(
                    a,
                    b
                );


            graph[aId]
            .push({

                node:
                    bId,

                distance:
                    edgeDistance

            });


            graph[bId]
            .push({

                node:
                    aId,

                distance:
                    edgeDistance

            });

        }

    );


    return graph;

}


const graph =
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
    )
    .forEach(

        nodeId => {

            distances[nodeId] =
                Infinity;

            previous[nodeId] =
                null;

        }

    );


    distances[start] =
        0;


    while(
        unvisited.size >
        0
    ) {

        let current =
            null;


        let smallest =
            Infinity;


        unvisited.forEach(

            nodeId => {

                if(
                    distances[nodeId] <
                    smallest
                ) {

                    smallest =
                        distances[nodeId];

                    current =
                        nodeId;

                }

            }

        );


        if(
            current ===
            null
        ) {

            break;

        }


        if(
            current ===
            target
        ) {

            break;

        }


        unvisited.delete(
            current
        );


        graph[current]
        .forEach(

            edge => {

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
            current ===
            start
        ) {

            break;

        }


        current =
            previous[current];

    }


    if(
        path[0] !==
        start
    ) {

        return null;

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

function findNearestNode(
    position
) {

    let bestNode =
        null;


    let bestDistance =
        Infinity;


    Object.entries(
        mapNodes
    )
    .forEach(

        (
            [
                nodeId,
                point
            ]
        ) => {

            const currentDistance =
                distance(
                    position,
                    point
                );


            if(
                currentDistance <
                bestDistance
            ) {

                bestNode =
                    nodeId;


                bestDistance =
                    currentDistance;

            }

        }

    );


    return bestNode;

}



/* =====================================================
   BEST ENTRANCE
===================================================== */

function findBestEntrance(

    startNode,
    building

) {

    let best =
        null;


    building.entrances
    .forEach(

        entranceId => {

            const result =
                shortestPath(

                    startNode,

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

                best = {

                    entranceId,

                    ...result

                };

            }

        }

    );


    return best;

}



/* =====================================================
   MAP CLICK
===================================================== */

$("#navigationMap")
.addEventListener(

    "pointerdown",

    event => {

        if(
            !state.destination
        ) {

            toast(
                "Pilih tujuan terlebih dahulu."
            );

            return;

        }


        const rect =
            $("#navigationMap")
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


        state.startPosition =
            position;


        state.startNode =
            findNearestNode(
                position
            );


        setElementPosition(

            $("#navigationUserMarker"),

            position

        );


        $("#navigationUserMarker")
        .classList
        .remove(
            "hidden"
        );


        calculateNavigationRoute();

    }

);



/* =====================================================
   ROUTE
===================================================== */

function calculateNavigationRoute() {

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
        findBestEntrance(

            state.startNode,

            building

        );


    if(!result) {

        toast(
            "Rute tidak ditemukan."
        );

        return;

    }


    state.entranceId =
        result.entranceId;


    state.route =
        result.path;


    state.routeDistance =
        result.distance;


    const entrance =
        mapNodes[
            result.entranceId
        ];


    setElementPosition(

        $("#navigationEntranceMarker"),

        entrance

    );


    $("#navigationEntranceMarker")
    .classList
    .remove(
        "hidden"
    );


    drawActiveRoute();


    $("#navigationPositionStatus")
    .textContent =
        "Posisi dipilih";


    $("#navigationRouteStatus")
    .textContent =
        "Rute ditemukan";


    $("#navigationMapTitle")
    .textContent =
        "Rute menuju tujuan";


    $("#navigationMapInstruction")
    .textContent =

        `Ikuti rute menuju entrance ${building.shortName}.`;


    $("#resetNavigationPosition")
    .classList
    .remove(
        "hidden"
    );


    $("#navigationARAction")
    .classList
    .remove(
        "hidden"
    );

}



/* =====================================================
   DRAW ROUTE
===================================================== */

function drawActiveRoute() {

    const points =
        [];


    /*
        Route dimulai tepat dari posisi
        yang dipilih user.
    */

    points.push(

        `${state.startPosition.x},${state.startPosition.y}`

    );


    state.route
    .forEach(

        nodeId => {

            const node =
                mapNodes[nodeId];


            points.push(

                `${node.x},${node.y}`

            );

        }

    );


    $("#navigationRoute")
    .setAttribute(

        "points",

        points.join(
            " "
        )

    );

}



/* =====================================================
   POSITION HELPER
===================================================== */

function setElementPosition(

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



/* =====================================================
   CLEAR ROUTE
===================================================== */

function clearNavigationRoute() {

    state.startPosition =
        null;

    state.startNode =
        null;

    state.entranceId =
        null;

    state.route =
        [];


    $("#navigationRoute")
    .setAttribute(
        "points",
        ""
    );


    $("#navigationUserMarker")
    .classList
    .add(
        "hidden"
    );


    $("#navigationEntranceMarker")
    .classList
    .add(
        "hidden"
    );


    $("#navigationARAction")
    .classList
    .add(
        "hidden"
    );


    $("#resetNavigationPosition")
    .classList
    .add(
        "hidden"
    );


    $("#navigationPositionStatus")
    .textContent =
        "Belum dipilih";


    $("#navigationRouteStatus")
    .textContent =
        "Menunggu posisi";

}



/* =====================================================
   RESET USER POSITION
===================================================== */

$("#resetNavigationPosition")
.addEventListener(

    "click",

    () => {

        clearNavigationRoute();


        $("#navigationMapTitle")
        .textContent =
            "Tandai posisi Anda sekarang";


        $("#navigationMapInstruction")
        .textContent =
            "Tap pada denah sesuai posisi Anda saat ini.";

    }

);



/* =====================================================
   AR NAVIGATION
===================================================== */

$("#openARNavigation")
.addEventListener(

    "click",

    async () => {

        if(
            !state.destination
            ||
            state.route.length ===
            0
        ) {

            return;

        }


        const building =
            getDestinationBuilding();


        $("#arNavDestination")
        .textContent =
            state.destination.name;


        $("#arNavDestinationBottom")
        .textContent =
            building.name;


        showPage(
            "arNavigation"
        );


        await startNavigationCamera();

    }

);



async function startNavigationCamera() {

    const video =
        $("#navigationCamera");


    $("#arCameraStatus")
    .textContent =
        "Meminta izin kamera...";


    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode: {

                        ideal:
                            "environment"

                    }

                },

                audio:
                    false

            });


        state.cameraStream =
            stream;


        video.srcObject =
            stream;


        await video.play();


        $("#arCameraStatus")
        .textContent =
            "Kamera aktif • Navigasi AR siap";

    }


    catch(error) {

        console.error(
            error
        );


        $("#arCameraStatus")
        .textContent =
            "Kamera tidak dapat dibuka. Berikan izin kamera pada browser.";


        toast(
            "Izin kamera diperlukan untuk navigasi AR."
        );

    }

}



function stopNavigationCamera() {

    if(
        !state.cameraStream
    ) {

        return;

    }


    state.cameraStream
    .getTracks()
    .forEach(

        track => {

            track.stop();

        }

    );


    state.cameraStream =
        null;


    const video =
        $("#navigationCamera");


    if(video) {

        video.srcObject =
            null;

    }

}



$("#closeARNavigation")
.addEventListener(

    "click",

    () => {

        stopNavigationCamera();


        showPage(
            "navigation"
        );

    }

);



/* =====================================================
   MAIN 3D
===================================================== */

const mainModelViewer =
    $("#mainModelViewer");


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

    }

);



/* =====================================================
   MAIN AR
===================================================== */

const mainARViewer =
    $("#mainARViewer");


async function launchMainAR() {

    $("#mainARStatus")
    .textContent =
        "Membuka kamera...";


    try {

        await mainARViewer.activateAR();

    }


    catch(error) {

        console.error(
            error
        );


        $("#mainARStatus")
        .textContent =
            "AR tidak tersedia";


        $("#mainARHint")
        .textContent =
            "Pastikan perangkat mendukung AR dan website menggunakan HTTPS.";

    }

}


$("#launchMainAR")
.addEventListener(

    "click",

    launchMainAR

);


$("#resetMainAR")
.addEventListener(

    "click",

    () => {

        $("#mainARStatus")
        .textContent =
            "AR direset";


        $("#mainARHint")
        .textContent =
            "Arahkan kamera ke bidang datar.";

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
                    class="building-button"
                    type="button"
                >

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


                    <span>
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

                renderLabFloors(

                    building,

                    buildingRooms,

                    content

                );

            }

            else {

                renderRooms(

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



function renderLabFloors(

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


    [1,2,3]
    .forEach(

        floor => {

            const button =
                document.createElement(
                    "button"
                );


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


            button.type =
                "button";


            button.textContent =
                `Lantai ${floor}`;


            button.addEventListener(

                "click",

                () => {

                    floorButtons
                    .querySelectorAll(
                        ".floor-button"
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


                    renderRooms(

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

        }

    );


    container.appendChild(
        floorButtons
    );


    container.appendChild(
        roomArea
    );


    renderRooms(

        buildingRooms.filter(

            room =>
                room.floor === 1

        ),

        roomArea

    );

}



function renderRooms(

    roomList,
    container

) {

    container.innerHTML =
        "";


    if(
        roomList.length ===
        0
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


    roomList.forEach(

        room => {

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


                <button
                    type="button"
                >
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


function openMainAR() {

    showPage(
        "arMain"
    );

}


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



$("#homeARButton")
.addEventListener(
    "click",
    openMainAR
);


$("#featureARButton")
.addEventListener(
    "click",
    openMainAR
);


$("#menuAR")
.addEventListener(
    "click",
    openMainAR
);



$("#homeNavigationButton")
.addEventListener(

    "click",

    () =>
        openNavigationPage()

);


$("#featureNavigationButton")
.addEventListener(

    "click",

    () =>
        openNavigationPage()

);


$("#menuNavigation")
.addEventListener(

    "click",

    () =>
        openNavigationPage()

);



$("#homeDirectoryButton")
.addEventListener(

    "click",

    () =>
        showPage(
            "directory"
        )

);


$("#menuDirectory")
.addEventListener(

    "click",

    () =>
        showPage(
            "directory"
        )

);



/* =====================================================
   TOAST
===================================================== */

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
            $("#arNavigationPage")
            .classList
            .contains(
                "active"
            )
        ) {

            stopNavigationCamera();


            showPage(
                "navigation"
            );

        }

    }

);
