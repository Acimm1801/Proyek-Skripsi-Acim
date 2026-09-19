import {

    MAP_WIDTH,
    MAP_HEIGHT,

    buildings,
    rooms,

    routeNodes,
    routeEdges,

    getBuildingById

} from "./data/map-data.js?v=19";



/* =========================================================
   DOM
========================================================= */

const $ =
    selector =>
        document.querySelector(selector);


const $$ =
    selector =>
        [...document.querySelectorAll(selector)];



/* =========================================================
   STATE
========================================================= */

const state = {

    currentSlide: 0,

    landingModelIndex: 0,

    globalSelection: null,

    infoLocation: null,

    destination: null,

    clickedPosition: null,

    snappedPosition: null,

    routeResult: null,

    cameraStream: null

};



/* =========================================================
   LOCATION DATABASE
========================================================= */

const locations = [];


buildings.forEach(building => {

    locations.push({

        id: building.id,

        type: "building",

        name: building.name,

        buildingId: building.id,

        parent: "Fakultas Teknik UISU",

        floor: building.actualFloor,

        description: building.description

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
                ?
                building.name
                :
                "Fakultas Teknik UISU",

        description:

            `${room.name} berada di ${
                building
                    ?
                    building.name
                    :
                    "Fakultas Teknik UISU"
            }`

            +

            `${
                room.floor
                    ?
                    `, lantai ${room.floor}`
                    :
                    ""
            }. Detail informasi ruangan akan dilengkapi kemudian.`

    });

});



/* =========================================================
   SEARCH
========================================================= */

function normalizeText(value){

    return String(value || "")
        .toLowerCase()
        .trim();

}


function searchLocations(value){

    const query =
        normalizeText(value);


    if(!query){

        return [];

    }


    return locations
        .filter(location =>

            normalizeText(
                `${location.name} ${location.parent}`
            )
            .includes(query)

        )
        .slice(0,30);

}



function renderSearchResults(
    results,
    container,
    onSelect
){

    container.innerHTML = "";


    if(!results.length){

        container.innerHTML = `
            <div class="search-empty">
                Lokasi tidak ditemukan.
            </div>
        `;

        container.classList.remove("hidden");

        return;
    }


    results.forEach(location => {

        const button =
            document.createElement("button");


        button.type =
            "button";


        button.className =
            "search-result";


        button.innerHTML = `

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
                    location.type === "building"
                        ?
                        "Gedung"
                        :
                        "Ruangan"
                }

            </span>

        `;


        button.addEventListener(
            "click",
            () => onSelect(location)
        );


        container.appendChild(button);

    });


    container.classList.remove("hidden");

}



/* =========================================================
   DRAWER
========================================================= */

function openDrawer(){

    $("#drawer")
        .classList
        .add("open");


    $("#drawerOverlay")
        .classList
        .add("show");


    document.body.style.overflow =
        "hidden";

}


function closeDrawer(){

    $("#drawer")
        .classList
        .remove("open");


    $("#drawerOverlay")
        .classList
        .remove("show");


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


$("#drawerOverlay")
    .addEventListener(
        "click",
        closeDrawer
    );



/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageName){

    $$(".page")
        .forEach(page =>
            page.classList.remove("active")
        );


    const target =
        $(`#${pageName}Page`);


    if(target){

        target.classList.add("active");

    }


    $$(".header-link")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === pageName
            );

        });


    if(pageName !== "arNavigation"){

        stopNavigationCamera();

    }


    closeDrawer();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}



$("#logoHome")
    .addEventListener(
        "click",
        () => showPage("home")
    );


$$("[data-page]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () =>
                showPage(
                    button.dataset.page
                )
        );

    });



/* =========================================================
   HERO SLIDER
========================================================= */

const slides =
    $$(".hero-slide");


function showSlide(index){

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
        (slide,slideIndex) => {

            slide.classList.toggle(
                "active",
                slideIndex === index
            );

        }
    );


    $$(".slider-dot")
        .forEach(
            (dot,dotIndex) => {

                dot.classList.toggle(
                    "active",
                    dotIndex === index
                );

            }
        );

}


$("#nextSlide")
    .addEventListener(
        "click",
        () =>
            showSlide(
                state.currentSlide + 1
            )
    );


$("#prevSlide")
    .addEventListener(
        "click",
        () =>
            showSlide(
                state.currentSlide - 1
            )
    );


$$(".slider-dot")
    .forEach(dot => {

        dot.addEventListener(
            "click",
            () =>
                showSlide(
                    Number(
                        dot.dataset.slide
                    )
                )
        );

    });



/* =========================================================
   LANDING MODEL
========================================================= */

const landingModels =
    buildings.filter(
        building =>
            Boolean(
                building.modelPath
            )
    );


function showLandingModel(index){

    if(!landingModels.length){

        $("#landingModelName")
            .textContent =
                "Model belum tersedia";

        return;
    }


    index =
        (
            index +
            landingModels.length
        )
        %
        landingModels.length;


    state.landingModelIndex =
        index;


    const building =
        landingModels[index];


    const viewer =
        $("#landingModelViewer");


    viewer.setAttribute(
        "src",
        building.modelPath
    );


    viewer.setAttribute(
        "alt",
        building.name
    );


    $("#landingModelName")
        .textContent =
            building.name;


    $("#landingModelCounter")
        .textContent =
            `${index + 1} / ${landingModels.length}`;

}


showLandingModel(0);


if(landingModels.length > 1){

    setInterval(
        () =>
            showLandingModel(
                state.landingModelIndex + 1
            ),
        10000
    );

}



/* =========================================================
   GLOBAL SEARCH
========================================================= */

$("#globalSearch")
    .addEventListener(
        "input",
        event => {

            const value =
                event.target.value;


            state.globalSelection =
                null;


            $("#globalSelected")
                .classList
                .add("hidden");


            if(!value){

                $("#globalSearchResults")
                    .classList
                    .add("hidden");

                return;
            }


            renderSearchResults(

                searchLocations(value),

                $("#globalSearchResults"),

                location => {

                    state.globalSelection =
                        location;


                    $("#globalSearch")
                        .value =
                            location.name;


                    $("#globalSelectedName")
                        .textContent =
                            location.name;


                    $("#globalSearchResults")
                        .classList
                        .add("hidden");


                    $("#globalSelected")
                        .classList
                        .remove("hidden");

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
                .add("hidden");


            $("#globalSelected")
                .classList
                .add("hidden");

        }
    );



$("#globalInfoButton")
    .addEventListener(
        "click",
        () => {

            if(state.globalSelection){

                openInfo(
                    state.globalSelection
                );

            }

        }
    );



$("#globalNavButton")
    .addEventListener(
        "click",
        () => {

            if(state.globalSelection){

                openNavigationWithDestination(
                    state.globalSelection
                );

            }

        }
    );



/* =========================================================
   INFO
========================================================= */

function openInfo(location){

    state.infoLocation =
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
        .remove("hidden");


    document.body.style.overflow =
        "hidden";

}


function closeInfo(){

    $("#infoModal")
        .classList
        .add("hidden");


    document.body.style.overflow =
        "";

}


$("#closeInfoModal")
    .addEventListener(
        "click",
        closeInfo
    );


$("#infoBackdrop")
    .addEventListener(
        "click",
        closeInfo
    );


$("#infoNavigationButton")
    .addEventListener(
        "click",
        () => {

            if(!state.infoLocation){

                return;
            }


            const location =
                state.infoLocation;


            closeInfo();


            openNavigationWithDestination(
                location
            );

        }
    );



/* =========================================================
   BUILDING SELECT
========================================================= */

function populateBuildingSelect(selectElement){

    selectElement.innerHTML = `

        <option value="">
            -- Pilih Gedung --
        </option>

    `;


    buildings.forEach(building => {

        const option =
            document.createElement("option");


        option.value =
            building.id;


        option.textContent =
            building.name;


        selectElement.appendChild(option);

    });

}


populateBuildingSelect(
    $("#viewerBuildingSelect")
);


populateBuildingSelect(
    $("#arBuildingSelect")
);



/* =========================================================
   3D VIEWER
========================================================= */

$("#show3DModel")
    .addEventListener(
        "click",
        () => {

            const building =
                getBuildingById(
                    $("#viewerBuildingSelect").value
                );


            if(!building){

                $("#viewerMessage")
                    .textContent =
                        "Pilih Gedung terlebih dahulu.";


                $("#viewerCard")
                    .classList
                    .add("hidden");

                return;
            }


            if(!building.modelPath){

                $("#viewerMessage")
                    .textContent =
                        `Model 3D ${building.shortName} belum tersedia.`;


                $("#viewerCard")
                    .classList
                    .add("hidden");

                return;
            }


            $("#viewerMessage")
                .textContent =
                    "";


            $("#viewerTitle")
                .textContent =
                    building.name;


            $("#mainModelViewer")
                .setAttribute(
                    "src",
                    building.modelPath
                );


            $("#viewerCard")
                .classList
                .remove("hidden");

        }
    );



$("#resetCamera")
    .addEventListener(
        "click",
        () => {

            const viewer =
                $("#mainModelViewer");


            viewer.cameraOrbit =
                "0deg 75deg 105%";


            viewer.cameraTarget =
                "auto auto auto";

        }
    );



/* =========================================================
   AR UTAMA
========================================================= */

$("#prepareMainAR")
    .addEventListener(
        "click",
        () => {

            const building =
                getBuildingById(
                    $("#arBuildingSelect").value
                );


            if(!building){

                $("#arMessage")
                    .textContent =
                        "Pilih Gedung terlebih dahulu.";


                $("#arCard")
                    .classList
                    .add("hidden");

                return;
            }


            if(!building.modelPath){

                $("#arMessage")
                    .textContent =
                        `Model AR ${building.shortName} belum tersedia.`;


                $("#arCard")
                    .classList
                    .add("hidden");

                return;
            }


            $("#arMessage")
                .textContent =
                    "";


            $("#mainARViewer")
                .setAttribute(
                    "src",
                    building.modelPath
                );


            $("#mainARStatus")
                .textContent =
                    `Siap menampilkan ${building.shortName}`;


            $("#arCard")
                .classList
                .remove("hidden");

        }
    );



$("#launchMainAR")
    .addEventListener(
        "click",
        async () => {

            try{

                await $("#mainARViewer")
                    .activateAR();

            }

            catch(error){

                console.error(error);

                toast(
                    "AR belum dapat dibuka pada perangkat ini."
                );

            }

        }
    );



/* =========================================================
   ROUTING
========================================================= */

function pointDistance(a,b){

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );

}


function pointsEqual(a,b,epsilon = 0.5){

    return pointDistance(a,b)
        <= epsilon;

}



const routingEdges =
    routeEdges.map(edge => {

        const points =
            edge.points.map(
                ([x,y]) => ({
                    x,
                    y
                })
            );


        const cumulative =
            [0];


        let total =
            0;


        for(
            let i = 0;
            i < points.length - 1;
            i++
        ){

            total +=
                pointDistance(
                    points[i],
                    points[i + 1]
                );


            cumulative.push(total);

        }


        return {

            ...edge,

            points,

            cumulative,

            length:
                total

        };

    });



const edgeById =
    new Map(
        routingEdges.map(
            edge => [
                edge.id,
                edge
            ]
        )
    );



const routeGraph =
    {};


Object.keys(routeNodes)
    .forEach(nodeId => {

        routeGraph[nodeId] =
            [];

    });



routingEdges.forEach(edge => {

    routeGraph[edge.from]
        .push({

            node:
                edge.to,

            edgeId:
                edge.id,

            weight:
                edge.length

        });


    routeGraph[edge.to]
        .push({

            node:
                edge.from,

            edgeId:
                edge.id,

            weight:
                edge.length

        });

});



function projectPointToSegment(
    point,
    a,
    b
){

    const abX =
        b.x - a.x;


    const abY =
        b.y - a.y;


    const apX =
        point.x - a.x;


    const apY =
        point.y - a.y;


    const lengthSquared =
        abX * abX +
        abY * abY;


    let t =
        lengthSquared === 0
            ?
            0
            :
            (
                apX * abX +
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
            a.x +
            abX * t,

        y:
            a.y +
            abY * t

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



function snapPointToNetwork(point){

    let best =
        null;


    routingEdges.forEach(edge => {

        for(
            let i = 0;
            i < edge.points.length - 1;
            i++
        ){

            const a =
                edge.points[i];


            const b =
                edge.points[i + 1];


            const projection =
                projectPointToSegment(
                    point,
                    a,
                    b
                );


            const segmentLength =
                pointDistance(
                    a,
                    b
                );


            const along =
                edge.cumulative[i]
                +
                segmentLength
                *
                projection.t;


            if(
                !best
                ||
                projection.distance
                <
                best.distance
            ){

                best = {

                    edge,

                    segmentIndex:
                        i,

                    t:
                        projection.t,

                    point:
                        projection.point,

                    distance:
                        projection.distance,

                    along,

                    distanceToFrom:
                        along,

                    distanceToTo:
                        edge.length -
                        along

                };

            }

        }

    });


    return best;

}



/* =========================================================
   DIJKSTRA
========================================================= */

function dijkstra(
    startNode,
    targetNode
){

    const distances =
        {};


    const previousNode =
        {};


    const previousEdge =
        {};


    const unvisited =
        new Set(
            Object.keys(routeNodes)
        );


    Object.keys(routeNodes)
        .forEach(nodeId => {

            distances[nodeId] =
                Infinity;


            previousNode[nodeId] =
                null;


            previousEdge[nodeId] =
                null;

        });


    distances[startNode] =
        0;


    while(unvisited.size){

        let current =
            null;


        let smallest =
            Infinity;


        unvisited.forEach(nodeId => {

            if(
                distances[nodeId]
                <
                smallest
            ){

                smallest =
                    distances[nodeId];


                current =
                    nodeId;

            }

        });


        if(current === null){

            break;
        }


        if(current === targetNode){

            break;
        }


        unvisited.delete(current);


        routeGraph[current]
            .forEach(connection => {

                if(
                    !unvisited.has(
                        connection.node
                    )
                ){

                    return;
                }


                const candidate =
                    distances[current]
                    +
                    connection.weight;


                if(
                    candidate
                    <
                    distances[
                        connection.node
                    ]
                ){

                    distances[
                        connection.node
                    ]
                    =
                    candidate;


                    previousNode[
                        connection.node
                    ]
                    =
                    current;


                    previousEdge[
                        connection.node
                    ]
                    =
                    connection.edgeId;

                }

            });

    }


    if(
        !Number.isFinite(
            distances[targetNode]
        )
    ){

        return null;
    }


    const nodePath =
        [];


    const edgePath =
        [];


    let cursor =
        targetNode;


    while(cursor){

        nodePath.unshift(cursor);


        if(cursor === startNode){

            break;
        }


        edgePath.unshift(
            previousEdge[cursor]
        );


        cursor =
            previousNode[cursor];

    }


    if(nodePath[0] !== startNode){

        return null;
    }


    return {

        distance:
            distances[targetNode],

        nodePath,

        edgePath

    };

}



/* =========================================================
   ROUTE POLYLINE
========================================================= */

function dedupePolyline(points){

    const output =
        [];


    points.forEach(point => {

        if(
            !output.length
            ||
            !pointsEqual(
                output[
                    output.length - 1
                ],
                point
            )
        ){

            output.push({

                x:
                    point.x,

                y:
                    point.y

            });

        }

    });


    return output;

}



function snapToEndpointPolyline(
    snap,
    endpointNode
){

    const edge =
        snap.edge;


    const points =
        edge.points;


    const i =
        snap.segmentIndex;


    const result =
        [{
            ...snap.point
        }];


    if(endpointNode === edge.from){

        result.push(
            points[i]
        );


        for(
            let j = i - 1;
            j >= 0;
            j--
        ){

            result.push(
                points[j]
            );

        }

    }

    else{

        result.push(
            points[i + 1]
        );


        for(
            let j = i + 2;
            j < points.length;
            j++
        ){

            result.push(
                points[j]
            );

        }

    }


    return dedupePolyline(result);

}



function endpointToSnapPolyline(
    snap,
    endpointNode
){

    return snapToEndpointPolyline(
        snap,
        endpointNode
    )
    .reverse();

}



function sameEdgePolyline(
    startSnap,
    targetSnap
){

    const edge =
        startSnap.edge;


    const points =
        edge.points;


    const result =
        [{
            ...startSnap.point
        }];


    if(
        startSnap.along
        <=
        targetSnap.along
    ){

        for(
            let j =
                startSnap.segmentIndex + 1;

            j <=
                targetSnap.segmentIndex;

            j++
        ){

            result.push(
                points[j]
            );

        }

    }

    else{

        for(
            let j =
                startSnap.segmentIndex;

            j >
                targetSnap.segmentIndex;

            j--
        ){

            result.push(
                points[j]
            );

        }

    }


    result.push({
        ...targetSnap.point
    });


    return dedupePolyline(result);

}



function middlePolyline(
    result
){

    if(
        !result
        ||
        !result.edgePath.length
    ){

        return [];
    }


    const output =
        [];


    result.edgePath
        .forEach(
            (edgeId,index) => {

                const edge =
                    edgeById.get(edgeId);


                const fromNode =
                    result.nodePath[index];


                let points =
                    edge.from === fromNode
                        ?
                        edge.points
                        :
                        [...edge.points]
                            .reverse();


                if(output.length){

                    points =
                        points.slice(1);

                }


                output.push(
                    ...points
                );

            }
        );


    return dedupePolyline(output);

}



function routeBetweenSnaps(
    startSnap,
    targetSnap
){

    const candidates =
        [];


    if(
        startSnap.edge.id
        ===
        targetSnap.edge.id
    ){

        candidates.push({

            distance:
                Math.abs(
                    startSnap.along -
                    targetSnap.along
                ),

            points:
                sameEdgePolyline(
                    startSnap,
                    targetSnap
                )

        });

    }


    const startEndpoints = [

        startSnap.edge.from,
        startSnap.edge.to

    ];


    const targetEndpoints = [

        targetSnap.edge.from,
        targetSnap.edge.to

    ];


    startEndpoints.forEach(
        startNode => {

            targetEndpoints.forEach(
                targetNode => {

                    const middle =
                        dijkstra(
                            startNode,
                            targetNode
                        );


                    if(!middle){

                        return;
                    }


                    const startDistance =
                        startNode ===
                        startSnap.edge.from

                            ?

                        startSnap.distanceToFrom

                            :

                        startSnap.distanceToTo;


                    const targetDistance =
                        targetNode ===
                        targetSnap.edge.from

                            ?

                        targetSnap.distanceToFrom

                            :

                        targetSnap.distanceToTo;


                    const startPart =
                        snapToEndpointPolyline(
                            startSnap,
                            startNode
                        );


                    const middlePart =
                        middlePolyline(
                            middle
                        );


                    const targetPart =
                        endpointToSnapPolyline(
                            targetSnap,
                            targetNode
                        );


                    candidates.push({

                        distance:

                            startDistance
                            +
                            middle.distance
                            +
                            targetDistance,


                        points:

                            dedupePolyline([

                                ...startPart,
                                ...middlePart,
                                ...targetPart

                            ])

                    });

                }
            );

        }
    );


    return candidates
        .sort(
            (a,b) =>
                a.distance -
                b.distance
        )[0]
        ||
        null;

}



/* =========================================================
   BEST BUILDING ENTRANCE
========================================================= */

function findBestEntranceRoute(
    clickedPosition,
    building
){

    const startSnap =
        snapPointToNetwork(
            clickedPosition
        );


    if(!startSnap){

        return null;
    }


    let best =
        null;


    building.entrances
        .forEach(entrance => {

            const targetSnap =
                snapPointToNetwork(
                    entrance
                );


            if(!targetSnap){

                return;
            }


            const networkRoute =
                routeBetweenSnaps(
                    startSnap,
                    targetSnap
                );


            if(!networkRoute){

                return;
            }


            const points =
                dedupePolyline([

                    startSnap.point,

                    ...networkRoute.points,

                    targetSnap.point,

                    entrance

                ]);


            const candidate = {

                entrance,

                startSnap,

                targetSnap,

                distance:
                    networkRoute.distance,

                points

            };


            if(
                !best
                ||
                candidate.distance
                <
                best.distance
            ){

                best =
                    candidate;

            }

        });


    return best;

}



/* =========================================================
   NAVIGATION DESTINATION
========================================================= */

function getDestinationBuilding(){

    if(!state.destination){

        return null;
    }


    return getBuildingById(
        state.destination.buildingId
    );

}



function destinationDisplayName(){

    if(!state.destination){

        return "tujuan pilihan Anda";
    }


    return state.destination.name;

}



/* =========================================================
   MAP POSITION
========================================================= */

function setElementPosition(
    element,
    point
){

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
   PROGRESS
========================================================= */

function updateProgress(stage){

    const steps = [

        "stepTarget",
        "stepPosition",
        "stepRoute",
        "stepAR"

    ];


    steps.forEach(
        (id,index) => {

            $(`#${id}`)
                .classList
                .toggle(
                    "active",
                    index <= stage
                );

        }
    );

}



/* =========================================================
   REVISI 19
   TEXT BEFORE POSITION
========================================================= */

function setNavigationInstruction(){

    const destination =
        destinationDisplayName();


    $("#mapHeadingTitle")
        .textContent =

            `Tap pada denah sesuai posisi Anda sekarang, lalu sistem akan memberikan jalur terdekat menuju ${destination}.`;


    $("#mapInstructionArea")
        .classList
        .remove("hidden");

}



/* =========================================================
   CLEAR ROUTE
========================================================= */

function clearRouteOnly(){

    state.clickedPosition =
        null;


    state.snappedPosition =
        null;


    state.routeResult =
        null;


    $("#activeRoute")
        .setAttribute(
            "points",
            ""
        );


    $("#userMarker")
        .classList
        .add("hidden");


    $("#entranceMarker")
        .classList
        .add("hidden");


    /*
       ROUTE RESULT DISEMBUNYIKAN
    */

    $("#routeFoundBox")
        .classList
        .add("hidden");


    /*
       INSTRUKSI DI ATAS MAP MUNCUL
    */

    setNavigationInstruction();


    $("#positionStatus")
        .textContent =
            "Belum dipilih";


    $("#routeStatus")
        .textContent =
            "Menunggu posisi";


    updateProgress(
        state.destination
            ?
            1
            :
            0
    );

}



/* =========================================================
   RESET NAVIGATION
========================================================= */

function resetNavigation(){

    state.destination =
        null;


    $("#navigationSearch").value =
        "";


    $("#navigationSearchResults")
        .innerHTML = `

            <div class="search-empty">
                Ketik nama gedung atau ruangan tujuan.
            </div>

        `;


    $("#selectedDestination")
        .classList
        .add("hidden");


    $("#mapSection")
        .classList
        .add("hidden");


    $("#destinationHighlight")
        .classList
        .add("hidden");


    clearRouteOnly();


    updateProgress(0);

}



/* =========================================================
   SELECT DESTINATION
========================================================= */

function selectNavigationDestination(
    location
){

    state.destination =
        location;


    $("#navigationSearch")
        .value =
            location.name;


    $("#navigationSearchResults")
        .innerHTML =
            "";


    $("#selectedDestinationName")
        .textContent =
            location.name;


    $("#selectedDestinationParent")
        .textContent =
            location.parent;


    $("#selectedDestination")
        .classList
        .remove("hidden");


    const building =
        getDestinationBuilding();


    if(!building){

        return;
    }


    $("#targetStatus")
        .textContent =
            location.name;


    setElementPosition(
        $("#destinationHighlight"),
        building.mapMarker
    );


    $("#destinationHighlight")
        .classList
        .remove("hidden");


    $("#mapSection")
        .classList
        .remove("hidden");


    clearRouteOnly();


    /*
       REVISI 19:
       Heading langsung menggunakan
       nama ruangan/gedung yang dipilih.
    */

    setNavigationInstruction();


    updateProgress(1);


    setTimeout(
        () => {

            $("#mapSection")
                .scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });

        },
        120
    );

}



/* =========================================================
   OPEN NAVIGATION
========================================================= */

function openNavigationWithDestination(
    location = null
){

    showPage("navigation");


    resetNavigation();


    if(location){

        selectNavigationDestination(
            location
        );

    }

    else{

        setTimeout(
            () =>
                $("#navigationSearch")
                    .focus(),
            180
        );

    }

}



/* =========================================================
   NAVIGATION SEARCH
========================================================= */

$("#navigationSearch")
    .addEventListener(
        "input",
        event => {

            const value =
                event.target.value;


            if(!value){

                $("#navigationSearchResults")
                    .innerHTML = `

                        <div class="search-empty">
                            Ketik nama gedung atau ruangan tujuan.
                        </div>

                    `;

                return;
            }


            renderSearchResults(

                searchLocations(value),

                $("#navigationSearchResults"),

                selectNavigationDestination

            );

        }
    );



/* =========================================================
   CLICK MAP
========================================================= */

$("#navigationMap")
    .addEventListener(
        "pointerdown",
        event => {

            const building =
                getDestinationBuilding();


            if(!building){

                toast(
                    "Pilih tujuan terlebih dahulu."
                );

                return;
            }


            const rect =
                $("#navigationMap")
                    .getBoundingClientRect();


            const clicked = {

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
                clicked;


            const routeResult =
                findBestEntranceRoute(
                    clicked,
                    building
                );


            if(!routeResult){

                toast(
                    "Rute tidak ditemukan dari posisi tersebut."
                );

                return;
            }


            state.routeResult =
                routeResult;


            state.snappedPosition =
                routeResult
                    .startSnap
                    .point;



            /* USER MARKER */

            setElementPosition(

                $("#userMarker"),

                routeResult
                    .startSnap
                    .point

            );


            $("#userMarker")
                .classList
                .remove("hidden");



            /* ENTRANCE */

            setElementPosition(

                $("#entranceMarker"),

                routeResult.entrance

            );


            $("#entranceLabel")
                .textContent =
                    `Entrance ${building.shortName}`;


            $("#entranceMarker")
                .classList
                .remove("hidden");



            /* ROUTE */

            const pointsText =
                routeResult.points
                    .map(
                        point =>
                            `${point.x.toFixed(1)},${point.y.toFixed(1)}`
                    )
                    .join(" ");


            $("#activeRoute")
                .setAttribute(
                    "points",
                    pointsText
                );



            /* INTERNAL */

            $("#positionStatus")
                .textContent =
                    "Disesuaikan ke jalur terdekat";


            $("#routeStatus")
                .textContent =
                    "Rute Ditemukan";



            /* =================================================
               REVISI 19

               Setelah user memilih posisi:
               - Semua tulisan instruksi dihilangkan.
               - Container Rute ditemukan muncul.
               - Container sudah berada DI ATAS DENAH.
               - Tidak ada konten lagi di bawah denah.
            ================================================= */

            $("#mapInstructionArea")
                .classList
                .add("hidden");


            $("#routeFoundBox")
                .classList
                .remove("hidden");


            updateProgress(2);

        }
    );



/* =========================================================
   INTERNAL RESET
========================================================= */

$("#resetPosition")
    .addEventListener(
        "click",
        clearRouteOnly
    );



/* =========================================================
   AR NAVIGATION
========================================================= */

function calculateInitialArrowRotation(
    points
){

    if(
        !points
        ||
        points.length < 2
    ){

        return 0;
    }


    const start =
        points[0];


    let next =
        points[1];


    for(
        let i = 1;
        i < points.length;
        i++
    ){

        if(
            pointDistance(
                start,
                points[i]
            )
            >
            8
        ){

            next =
                points[i];

            break;
        }

    }


    const dx =
        next.x -
        start.x;


    const dy =
        next.y -
        start.y;


    return Math.atan2(
        dx,
        -dy
    )
    *
    (
        180 /
        Math.PI
    );

}



/* =========================================================
   CAMERA
========================================================= */

async function startNavigationCamera(){

    const video =
        $("#navigationCamera");


    $("#cameraStatus")
        .textContent =
            "Meminta izin kamera...";


    if(
        !navigator.mediaDevices
        ||
        !navigator.mediaDevices.getUserMedia
    ){

        $("#cameraStatus")
            .textContent =
                "Browser tidak mendukung akses kamera.";

        return;
    }


    try{

        const stream =
            await navigator
                .mediaDevices
                .getUserMedia({

                    video:{

                        facingMode:{

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


        $("#cameraStatus")
            .textContent =
                "Kamera aktif • Navigasi AR siap";

    }

    catch(error){

        console.error(error);


        $("#cameraStatus")
            .textContent =
                "Kamera gagal dibuka. Periksa izin kamera browser.";

    }

}



function stopNavigationCamera(){

    if(state.cameraStream){

        state.cameraStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );


        state.cameraStream =
            null;

    }


    const video =
        $("#navigationCamera");


    if(video){

        video.srcObject =
            null;

    }

}



/* =========================================================
   OPEN AR NAVIGATION
========================================================= */

$("#openARNavigation")
    .addEventListener(
        "click",
        async () => {

            if(
                !state.routeResult
                ||
                !state.destination
            ){

                return;
            }


            const building =
                getDestinationBuilding();


            $("#arNavigationTitle")
                .textContent =
                    state.destination.name;


            $("#arNavigationDestination")
                .textContent =

                    `${state.destination.name} • ${building.shortName}`;


            const rotation =
                calculateInitialArrowRotation(
                    state.routeResult.points
                );


            $("#directionArrow")
                .style
                .setProperty(
                    "--arrow-rotation",
                    `${rotation}deg`
                );


            $("#directionText")
                .textContent =
                    "Ikuti arah menuju tujuan";


            updateProgress(3);


            showPage(
                "arNavigation"
            );


            await startNavigationCamera();

        }
    );



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



/* =========================================================
   DIRECTORY
========================================================= */

function renderRoomList(
    roomList,
    container
){

    container.innerHTML =
        "";


    if(!roomList.length){

        container.innerHTML = `

            <div class="search-empty">
                Data ruangan akan dilengkapi kemudian.
            </div>

        `;

        return;
    }


    const grid =
        document.createElement("div");


    grid.className =
        "room-grid";


    roomList.forEach(room => {

        const item =
            document.createElement("div");


        item.className =
            "room-item";


        item.innerHTML = `

            <div class="room-row">

                <span>
                    ${room.name}
                </span>

                <button type="button">
                    Pilih
                </button>

            </div>


            <div class="room-actions hidden">

                <button
                    class="room-info-button"
                    type="button"
                >
                    Informasi
                </button>

                <button
                    class="room-nav-button"
                    type="button"
                >
                    Petunjuk Arah
                </button>

            </div>

        `;


        const actions =
            item.querySelector(
                ".room-actions"
            );


        item.querySelector(
            ".room-row button"
        )
        .addEventListener(
            "click",
            () => {

                actions.classList.toggle(
                    "hidden"
                );

            }
        );


        const location =
            locations.find(
                candidate =>
                    candidate.id ===
                    room.id
            );


        item.querySelector(
            ".room-info-button"
        )
        .addEventListener(
            "click",
            () => {

                if(location){

                    openInfo(location);

                }

            }
        );


        item.querySelector(
            ".room-nav-button"
        )
        .addEventListener(
            "click",
            () => {

                if(location){

                    openNavigationWithDestination(
                        location
                    );

                }

            }
        );


        grid.appendChild(item);

    });


    container.appendChild(grid);

}



/* =========================================================
   LAB FLOOR
========================================================= */

function renderLaboratory(
    buildingRooms,
    container
){

    const floorButtons =
        document.createElement("div");


    floorButtons.className =
        "floor-buttons";


    const roomArea =
        document.createElement("div");


    [1,2,3]
        .forEach(floor => {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                `floor-button${
                    floor === 1
                        ?
                        " active"
                        :
                        ""
                }`;


            button.textContent =
                `Lantai ${floor}`;


            button.addEventListener(
                "click",
                () => {

                    floorButtons
                        .querySelectorAll(
                            ".floor-button"
                        )
                        .forEach(item =>
                            item.classList.remove(
                                "active"
                            )
                        );


                    button.classList.add(
                        "active"
                    );


                    renderRoomList(

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

        buildingRooms.filter(
            room =>
                room.floor === 1
        ),

        roomArea

    );

}



/* =========================================================
   DIRECTORY
========================================================= */

function renderDirectory(){

    const container =
        $("#directoryContainer");


    container.innerHTML =
        "";


    buildings.forEach(
        (building,index) => {

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


            article.innerHTML = `

                <button
                    class="building-button"
                    type="button"
                >

                    <span class="building-number">

                        ${
                            String(
                                index + 1
                            )
                            .padStart(
                                2,
                                "0"
                            )
                        }

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


            article
                .querySelector(
                    ".building-button"
                )
                .addEventListener(
                    "click",
                    () => {

                        article
                            .classList
                            .toggle("open");

                    }
                );


            const content =
                article.querySelector(
                    ".building-content"
                );


            if(
                building.id ===
                "laboratorium-ft"
            ){

                renderLaboratory(
                    buildingRooms,
                    content
                );

            }

            else{

                renderRoomList(
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


renderDirectory();



/* =========================================================
   BUTTON ROUTES
========================================================= */

const openViewer =
    () =>
        showPage("viewer");


const openAR =
    () =>
        showPage("ar");


const openDirectory =
    () =>
        showPage("directory");


const openNavigation =
    () =>
        openNavigationWithDestination();



$("#menu3D")
    .addEventListener(
        "click",
        openViewer
    );


$("#feature3D")
    .addEventListener(
        "click",
        openViewer
    );


$("#hero3DButton")
    .addEventListener(
        "click",
        openViewer
    );



$("#menuAR")
    .addEventListener(
        "click",
        openAR
    );


$("#featureAR")
    .addEventListener(
        "click",
        openAR
    );


$("#heroARButton")
    .addEventListener(
        "click",
        openAR
    );



$("#menuNavigation")
    .addEventListener(
        "click",
        openNavigation
    );


$("#featureNav")
    .addEventListener(
        "click",
        openNavigation
    );


$("#heroNavigationButton")
    .addEventListener(
        "click",
        openNavigation
    );



$("#menuDirectory")
    .addEventListener(
        "click",
        openDirectory
    );


$("#featureDirectory")
    .addEventListener(
        "click",
        openDirectory
    );


$("#heroDirectoryButton")
    .addEventListener(
        "click",
        openDirectory
    );



/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function toast(message){

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
            () =>
                element.classList.remove(
                    "show"
                ),
            3200
        );

}



/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if(event.key !== "Escape"){

            return;
        }


        closeDrawer();


        if(
            !$("#infoModal")
                .classList
                .contains("hidden")
        ){

            closeInfo();

        }


        if(
            $("#arNavigationPage")
                .classList
                .contains("active")
        ){

            stopNavigationCamera();

            showPage(
                "navigation"
            );

        }

    }
);
