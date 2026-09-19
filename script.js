import {

    MAP_WIDTH,
    MAP_HEIGHT,

    buildings,
    rooms,

    routeNodes,
    routeEdges,

    getBuildingById

} from "./data/map-data.js?v=21";


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = selector =>
    document.querySelector(selector);


const $$ = selector =>
    [...document.querySelectorAll(selector)];


const byId = id =>
    document.getElementById(id);


function on(id,event,handler){

    const element =
        byId(id);

    if(!element){

        console.warn(
            `[FT UISU] Element #${id} tidak ditemukan.`
        );

        return;
    }

    element.addEventListener(
        event,
        handler
    );

}


function text(id,value){

    const element =
        byId(id);

    if(element){

        element.textContent =
            value;

    }

}


function show(id){

    const element =
        byId(id);

    if(element){

        element.classList.remove(
            "hidden"
        );

    }

}


function hide(id){

    const element =
        byId(id);

    if(element){

        element.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   STATE
========================================================= */

const state = {

    currentSlide:0,

    landingModelIndex:0,

    globalSelection:null,

    infoLocation:null,

    destination:null,

    clickedPosition:null,

    snappedPosition:null,

    routeResult:null,

    cameraStream:null

};


/* =========================================================
   LOCATION DATABASE
========================================================= */

const locations = [];


buildings.forEach(building => {

    locations.push({

        id:building.id,

        type:"building",

        name:building.name,

        buildingId:building.id,

        parent:"Fakultas Teknik UISU",

        floor:building.actualFloor,

        description:building.description

    });

});


rooms.forEach(room => {

    const building =
        getBuildingById(
            room.buildingId
        );


    locations.push({

        ...room,

        type:"room",

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
            }${
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

    return String(
        value || ""
    )
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

        .slice(
            0,
            30
        );

}


function renderSearchResults(
    results,
    container,
    onSelect
){

    if(!container){

        return;
    }


    container.innerHTML =
        "";


    if(!results.length){

        container.innerHTML = `
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
            event => {

                event.preventDefault();

                onSelect(location);

            }
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
   DRAWER
========================================================= */

function openDrawer(){

    const drawer =
        byId("drawer");

    const overlay =
        byId("drawerOverlay");

    const hamburger =
        byId("hamburgerButton");


    if(drawer){

        drawer.classList.add(
            "open"
        );

        drawer.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    if(overlay){

        overlay.classList.add(
            "show"
        );

    }


    if(hamburger){

        hamburger.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    document.body.style.overflow =
        "hidden";

}


function closeDrawer(){

    const drawer =
        byId("drawer");

    const overlay =
        byId("drawerOverlay");

    const hamburger =
        byId("hamburgerButton");


    if(drawer){

        drawer.classList.remove(
            "open"
        );

        drawer.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if(overlay){

        overlay.classList.remove(
            "show"
        );

    }


    if(hamburger){

        hamburger.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    document.body.style.overflow =
        "";

}


on(
    "hamburgerButton",
    "click",
    openDrawer
);


on(
    "closeDrawer",
    "click",
    closeDrawer
);


on(
    "drawerOverlay",
    "click",
    closeDrawer
);


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageName){

    $$(".page")
    .forEach(page => {

        page.classList.remove(
            "active"
        );

    });


    const target =
        byId(
            `${pageName}Page`
        );


    if(target){

        target.classList.add(
            "active"
        );

    }


    $$(".header-link")
    .forEach(button => {

        button.classList.toggle(

            "active",

            button.dataset.page ===
            pageName

        );

    });


    if(
        pageName !==
        "arNavigation"
    ){

        stopNavigationCamera();

    }


    closeDrawer();


    window.scrollTo({

        top:0,

        left:0,

        behavior:"smooth"

    });

}


on(
    "logoHome",
    "click",
    () =>
        showPage("home")
);


$$("[data-page]")
.forEach(button => {

    button.addEventListener(
        "click",
        event => {

            event.preventDefault();

            showPage(
                button.dataset.page
            );

        }
    );

});


/* =========================================================
   HERO SLIDER
========================================================= */

const slides =
    $$(".hero-slide");


function showSlide(index){

    if(!slides.length){

        return;
    }


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

                slideIndex ===
                index

            );

        }
    );


    $$(".slider-dot")
    .forEach(
        (dot,dotIndex) => {

            dot.classList.toggle(

                "active",

                dotIndex ===
                index

            );

        }
    );

}


on(
    "nextSlide",
    "click",
    () =>
        showSlide(
            state.currentSlide + 1
        )
);


on(
    "prevSlide",
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
        event => {

            event.preventDefault();

            showSlide(
                Number(
                    dot.dataset.slide
                )
            );

        }
    );

});


/* =========================================================
   LANDING 3D
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

        text(
            "landingModelName",
            "Model belum tersedia"
        );

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
        byId(
            "landingModelViewer"
        );


    if(viewer){

        viewer.setAttribute(
            "src",
            building.modelPath
        );

        viewer.setAttribute(
            "alt",
            building.name
        );

    }


    text(
        "landingModelName",
        building.name
    );


    text(
        "landingModelCounter",
        `${index + 1} / ${landingModels.length}`
    );

}


showLandingModel(0);


if(
    landingModels.length > 1
){

    window.setInterval(
        () => {

            showLandingModel(
                state.landingModelIndex + 1
            );

        },
        10000
    );

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

const globalSearch =
    byId("globalSearch");


if(globalSearch){

    globalSearch.addEventListener(
        "input",
        event => {

            const value =
                event.target.value;


            state.globalSelection =
                null;


            hide(
                "globalSelected"
            );


            if(!value){

                hide(
                    "globalSearchResults"
                );

                return;
            }


            renderSearchResults(

                searchLocations(value),

                byId(
                    "globalSearchResults"
                ),

                location => {

                    state.globalSelection =
                        location;


                    globalSearch.value =
                        location.name;


                    text(
                        "globalSelectedName",
                        location.name
                    );


                    hide(
                        "globalSearchResults"
                    );


                    show(
                        "globalSelected"
                    );

                }

            );

        }
    );

}


on(
    "clearGlobalSearch",
    "click",
    () => {

        if(globalSearch){

            globalSearch.value =
                "";

        }


        state.globalSelection =
            null;


        hide(
            "globalSearchResults"
        );


        hide(
            "globalSelected"
        );

    }
);


on(
    "globalInfoButton",
    "click",
    () => {

        if(state.globalSelection){

            openInfo(
                state.globalSelection
            );

        }

    }
);


on(
    "globalNavButton",
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


    text(
        "infoTitle",
        location.name
    );


    text(
        "infoParent",
        location.parent
    );


    text(

        "infoDescription",

        location.description

        ||

        "Detail informasi akan dilengkapi kemudian."

    );


    show(
        "infoModal"
    );


    document.body.style.overflow =
        "hidden";

}


function closeInfo(){

    hide(
        "infoModal"
    );


    document.body.style.overflow =
        "";

}


on(
    "closeInfoModal",
    "click",
    closeInfo
);


on(
    "infoBackdrop",
    "click",
    closeInfo
);


on(
    "infoNavigationButton",
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

function populateBuildingSelect(
    selectElement
){

    if(!selectElement){

        return;
    }


    selectElement.innerHTML = `
        <option value="">
            -- Pilih Gedung --
        </option>
    `;


    buildings.forEach(building => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            building.id;


        option.textContent =
            building.name;


        selectElement.appendChild(
            option
        );

    });

}


populateBuildingSelect(
    byId("viewerBuildingSelect")
);


populateBuildingSelect(
    byId("arBuildingSelect")
);


/* =========================================================
   3D VIEWER
========================================================= */

on(
    "show3DModel",
    "click",
    () => {

        const select =
            byId(
                "viewerBuildingSelect"
            );


        if(!select){

            return;
        }


        const building =
            getBuildingById(
                select.value
            );


        if(!building){

            text(
                "viewerMessage",
                "Pilih Gedung terlebih dahulu."
            );

            hide(
                "viewerCard"
            );

            return;
        }


        if(!building.modelPath){

            text(
                "viewerMessage",
                `Model 3D ${building.shortName} belum tersedia.`
            );

            hide(
                "viewerCard"
            );

            return;
        }


        text(
            "viewerMessage",
            ""
        );


        text(
            "viewerTitle",
            building.name
        );


        const viewer =
            byId(
                "mainModelViewer"
            );


        if(viewer){

            viewer.setAttribute(
                "src",
                building.modelPath
            );

        }


        show(
            "viewerCard"
        );

    }
);


on(
    "resetCamera",
    "click",
    () => {

        const viewer =
            byId(
                "mainModelViewer"
            );


        if(!viewer){

            return;
        }


        viewer.cameraOrbit =
            "0deg 75deg 105%";


        viewer.cameraTarget =
            "auto auto auto";

    }
);


/* =========================================================
   AR UTAMA
========================================================= */

on(
    "prepareMainAR",
    "click",
    () => {

        const select =
            byId(
                "arBuildingSelect"
            );


        if(!select){

            return;
        }


        const building =
            getBuildingById(
                select.value
            );


        if(!building){

            text(
                "arMessage",
                "Pilih Gedung terlebih dahulu."
            );

            hide(
                "arCard"
            );

            return;
        }


        if(!building.modelPath){

            text(
                "arMessage",
                `Model AR ${building.shortName} belum tersedia.`
            );

            hide(
                "arCard"
            );

            return;
        }


        text(
            "arMessage",
            ""
        );


        const viewer =
            byId(
                "mainARViewer"
            );


        if(viewer){

            viewer.setAttribute(
                "src",
                building.modelPath
            );

        }


        text(

            "mainARStatus",

            `Siap menampilkan ${building.shortName}`

        );


        show(
            "arCard"
        );

    }
);


on(
    "launchMainAR",
    "click",
    async () => {

        const viewer =
            byId(
                "mainARViewer"
            );


        if(
            !viewer
            ||
            typeof viewer.activateAR !==
            "function"
        ){

            toast(
                "Fitur AR belum siap pada browser ini."
            );

            return;
        }


        try{

            await viewer.activateAR();

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
   ROUTING HELPERS
========================================================= */

function pointDistance(a,b){

    return Math.hypot(

        a.x - b.x,

        a.y - b.y

    );

}


function pointsEqual(
    a,
    b,
    epsilon = 0.5
){

    return pointDistance(
        a,
        b
    )
    <=
    epsilon;

}


/* =========================================================
   BUILD EDGE CACHE
========================================================= */

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
            i += 1
        ){

            total +=
                pointDistance(
                    points[i],
                    points[i + 1]
                );


            cumulative.push(
                total
            );

        }


        return {

            ...edge,

            points,

            cumulative,

            length:total

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


const routeGraph = {};


Object.keys(
    routeNodes
)
.forEach(nodeId => {

    routeGraph[nodeId] =
        [];

});


routingEdges.forEach(edge => {

    if(
        !routeGraph[edge.from]
        ||
        !routeGraph[edge.to]
    ){

        return;
    }


    routeGraph[
        edge.from
    ]
    .push({

        node:edge.to,

        edgeId:edge.id,

        weight:edge.length

    });


    routeGraph[
        edge.to
    ]
    .push({

        node:edge.from,

        edgeId:edge.id,

        weight:edge.length

    });

});


/* =========================================================
   SNAP
========================================================= */

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
            a.x +
            abX * t,

        y:
            a.y +
            abY * t

    };


    return {

        point:projected,

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
            i += 1
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

                    segmentIndex:i,

                    t:projection.t,

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

    const distances = {};
    const previousNode = {};
    const previousEdge = {};


    const unvisited =
        new Set(
            Object.keys(
                routeNodes
            )
        );


    Object.keys(
        routeNodes
    )
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


    while(
        unvisited.size
    ){

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


        if(
            current ===
            targetNode
        ){

            break;
        }


        unvisited.delete(
            current
        );


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


    const nodePath = [];
    const edgePath = [];


    let cursor =
        targetNode;


    while(cursor){

        nodePath.unshift(
            cursor
        );


        if(
            cursor ===
            startNode
        ){

            break;
        }


        edgePath.unshift(

            previousEdge[
                cursor
            ]

        );


        cursor =
            previousNode[
                cursor
            ];

    }


    if(
        nodePath[0]
        !==
        startNode
    ){

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
   POLYLINE HELPERS
========================================================= */

function dedupePolyline(points){

    const output = [];


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

                x:point.x,

                y:point.y

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


    const result = [
        {
            ...snap.point
        }
    ];


    if(
        endpointNode ===
        edge.from
    ){

        result.push(
            points[i]
        );


        for(
            let j = i - 1;
            j >= 0;
            j -= 1
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
            j += 1
        ){

            result.push(
                points[j]
            );

        }

    }


    return dedupePolyline(
        result
    );

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


    const result = [
        {
            ...startSnap.point
        }
    ];


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

            j += 1
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

            j -= 1
        ){

            result.push(
                points[j]
            );

        }

    }


    result.push({
        ...targetSnap.point
    });


    return dedupePolyline(
        result
    );

}


function middlePolyline(result){

    if(
        !result
        ||
        !result.edgePath.length
    ){

        return [];
    }


    const output = [];


    result.edgePath
    .forEach(
        (edgeId,index) => {

            const edge =
                edgeById.get(
                    edgeId
                );


            if(!edge){

                return;
            }


            const fromNode =
                result.nodePath[index];


            let points =

                edge.from ===
                fromNode

                    ?

                edge.points

                    :

                [...edge.points]
                .reverse();


            if(
                output.length
            ){

                points =
                    points.slice(1);

            }


            output.push(
                ...points
            );

        }
    );


    return dedupePolyline(
        output
    );

}


function routeBetweenSnaps(
    startSnap,
    targetSnap
){

    const candidates = [];


    if(
        startSnap.edge.id
        ===
        targetSnap.edge.id
    ){

        candidates.push({

            distance:

                Math.abs(
                    startSnap.along
                    -
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
   BUILDING ROUTE
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
   DESTINATION
========================================================= */

function getDestinationBuilding(){

    if(
        !state.destination
    ){

        return null;
    }


    return getBuildingById(

        state.destination
        .buildingId

    );

}


function destinationDisplayName(){

    if(
        !state.destination
    ){

        return "tujuan pilihan Anda";
    }


    return state.destination.name;

}


/* =========================================================
   MAP MARKER POSITION
========================================================= */

function setElementPosition(
    element,
    point
){

    if(
        !element
        ||
        !point
    ){

        return;
    }


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

            const element =
                byId(id);


            if(!element){

                return;
            }


            element.classList.toggle(

                "active",

                index <= stage

            );

        }
    );

}


/* =========================================================
   MAP INSTRUCTION
========================================================= */

function setNavigationInstruction(){

    text(

        "mapHeadingTitle",

        `Tap pada denah sesuai posisi Anda sekarang, lalu sistem akan memberikan jalur terdekat menuju ${destinationDisplayName()}.`

    );


    show(
        "mapInstructionArea"
    );

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


    const line =
        byId(
            "activeRoute"
        );


    if(line){

        line.setAttribute(
            "points",
            ""
        );

    }


    hide(
        "userMarker"
    );


    hide(
        "entranceMarker"
    );


    hide(
        "routeFoundBox"
    );


    setNavigationInstruction();


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


    const search =
        byId(
            "navigationSearch"
        );


    if(search){

        search.value =
            "";

    }


    const results =
        byId(
            "navigationSearchResults"
        );


    if(results){

        results.innerHTML = `
            <div class="search-empty">
                Ketik nama gedung atau ruangan tujuan.
            </div>
        `;

    }


    hide(
        "selectedDestination"
    );


    hide(
        "mapSection"
    );


    hide(
        "destinationHighlight"
    );


    clearRouteOnly();


    updateProgress(0);

}


/* =========================================================
   SELECT DESTINATION
========================================================= */

function selectNavigationDestination(location){

    state.destination =
        location;


    const search =
        byId(
            "navigationSearch"
        );


    if(search){

        search.value =
            location.name;

    }


    const results =
        byId(
            "navigationSearchResults"
        );


    if(results){

        results.innerHTML =
            "";

    }


    text(
        "selectedDestinationName",
        location.name
    );


    text(
        "selectedDestinationParent",
        location.parent
    );


    show(
        "selectedDestination"
    );


    const building =
        getDestinationBuilding();


    if(!building){

        toast(
            "Data gedung tujuan tidak ditemukan."
        );

        return;
    }


    setElementPosition(

        byId(
            "destinationHighlight"
        ),

        building.mapMarker

    );


    show(
        "destinationHighlight"
    );


    show(
        "mapSection"
    );


    clearRouteOnly();


    setNavigationInstruction();


    updateProgress(1);


    window.setTimeout(
        () => {

            const mapSection =
                byId(
                    "mapSection"
                );


            if(mapSection){

                mapSection.scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });

            }

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

    showPage(
        "navigation"
    );


    resetNavigation();


    if(location){

        selectNavigationDestination(
            location
        );

    }

    else{

        window.setTimeout(
            () => {

                const input =
                    byId(
                        "navigationSearch"
                    );


                if(input){

                    input.focus({
                        preventScroll:true
                    });

                }

            },
            180
        );

    }

}


/* =========================================================
   NAVIGATION SEARCH
========================================================= */

const navigationSearch =
    byId(
        "navigationSearch"
    );


if(navigationSearch){

    navigationSearch.addEventListener(
        "input",
        event => {

            const value =
                event.target.value;


            const container =
                byId(
                    "navigationSearchResults"
                );


            if(!container){

                return;
            }


            if(!value){

                container.innerHTML = `
                    <div class="search-empty">
                        Ketik nama gedung atau ruangan tujuan.
                    </div>
                `;

                return;
            }


            renderSearchResults(

                searchLocations(value),

                container,

                selectNavigationDestination

            );

        }
    );

}


/* =========================================================
   MAP CLICK
   Menggunakan click supaya lebih stabil pada mobile Safari,
   Chrome Android, tablet, maupun desktop.
========================================================= */

function handleMapSelection(event){

    const map =
        byId(
            "navigationMap"
        );


    if(!map){

        return;
    }


    const building =
        getDestinationBuilding();


    if(!building){

        toast(
            "Pilih tujuan terlebih dahulu."
        );

        return;
    }


    const rect =
        map.getBoundingClientRect();


    if(
        !rect.width
        ||
        !rect.height
    ){

        return;
    }


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


    /* USER */

    setElementPosition(

        byId("userMarker"),

        routeResult
        .startSnap
        .point

    );


    show(
        "userMarker"
    );


    /* ENTRANCE */

    setElementPosition(

        byId("entranceMarker"),

        routeResult.entrance

    );


    text(

        "entranceLabel",

        `Entrance ${building.shortName}`

    );


    show(
        "entranceMarker"
    );


    /* ROUTE */

    const pointsText =

        routeResult.points

        .map(
            point =>
                `${point.x.toFixed(1)},${point.y.toFixed(1)}`
        )

        .join(" ");


    const routeLine =
        byId(
            "activeRoute"
        );


    if(routeLine){

        routeLine.setAttribute(
            "points",
            pointsText
        );

    }


    /*
       Brief 19-21:
       instruksi hilang,
       hasil route di atas map.
    */

    hide(
        "mapInstructionArea"
    );


    show(
        "routeFoundBox"
    );


    updateProgress(2);

}


const navigationMap =
    byId(
        "navigationMap"
    );


if(navigationMap){

    navigationMap.addEventListener(
        "click",
        handleMapSelection
    );


    navigationMap.addEventListener(
        "keydown",
        event => {

            /*
               Keyboard tidak memiliki koordinat klik,
               jadi Enter hanya memberi petunjuk.
            */

            if(
                event.key === "Enter"
                ||
                event.key === " "
            ){

                event.preventDefault();

                toast(
                    "Tap atau klik titik posisi Anda pada denah."
                );

            }

        }
    );

}


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
        i += 1
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


async function startNavigationCamera(){

    const video =
        byId(
            "navigationCamera"
        );


    text(
        "cameraStatus",
        "Meminta izin kamera..."
    );


    if(
        !video
        ||
        !navigator.mediaDevices
        ||
        !navigator.mediaDevices.getUserMedia
    ){

        text(

            "cameraStatus",

            "Browser tidak mendukung akses kamera."

        );

        return;
    }


    try{

        const stream =

            await navigator
            .mediaDevices
            .getUserMedia({

                video:{

                    facingMode:{

                        ideal:"environment"

                    }

                },

                audio:false

            });


        state.cameraStream =
            stream;


        video.srcObject =
            stream;


        await video.play();


        text(

            "cameraStatus",

            "Kamera aktif • Navigasi AR siap"

        );

    }

    catch(error){

        console.error(error);


        text(

            "cameraStatus",

            "Kamera gagal dibuka. Periksa izin kamera browser."

        );

    }

}


function stopNavigationCamera(){

    if(
        state.cameraStream
    ){

        state.cameraStream
        .getTracks()
        .forEach(track => {

            track.stop();

        });


        state.cameraStream =
            null;

    }


    const video =
        byId(
            "navigationCamera"
        );


    if(video){

        video.srcObject =
            null;

    }

}


on(
    "openARNavigation",
    "click",
    async () => {

        if(
            !state.routeResult
            ||
            !state.destination
        ){

            toast(
                "Tentukan posisi dan rute terlebih dahulu."
            );

            return;
        }


        const building =
            getDestinationBuilding();


        if(!building){

            return;
        }


        text(

            "arNavigationTitle",

            state.destination.name

        );


        text(

            "arNavigationDestination",

            `${state.destination.name} • ${building.shortName}`

        );


        const rotation =
            calculateInitialArrowRotation(
                state.routeResult.points
            );


        const arrow =
            byId(
                "directionArrow"
            );


        if(arrow){

            arrow.style.setProperty(

                "--arrow-rotation",

                `${rotation}deg`

            );

        }


        text(

            "directionText",

            "Ikuti arah menuju tujuan"

        );


        updateProgress(3);


        showPage(
            "arNavigation"
        );


        await startNavigationCamera();

    }
);


on(
    "closeARNavigation",
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

    if(!container){

        return;
    }


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


        const chooseButton =
            item.querySelector(
                ".room-row button"
            );


        if(chooseButton){

            chooseButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    if(actions){

                        actions.classList.toggle(
                            "hidden"
                        );

                    }

                }
            );

        }


        const location =
            locations.find(
                candidate =>
                    candidate.id ===
                    room.id
            );


        const infoButton =
            item.querySelector(
                ".room-info-button"
            );


        if(infoButton){

            infoButton.addEventListener(
                "click",
                () => {

                    if(location){

                        openInfo(
                            location
                        );

                    }

                }
            );

        }


        const navigationButton =
            item.querySelector(
                ".room-nav-button"
            );


        if(navigationButton){

            navigationButton.addEventListener(
                "click",
                () => {

                    if(location){

                        openNavigationWithDestination(
                            location
                        );

                    }

                }
            );

        }


        grid.appendChild(
            item
        );

    });


    container.appendChild(
        grid
    );

}


function renderLaboratory(
    buildingRooms,
    container
){

    if(!container){

        return;
    }


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
    .forEach(floor => {

        const button =
            document.createElement(
                "button"
            );


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
                .forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


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
                room.floor ===
                1
        ),

        roomArea

    );

}


function renderDirectory(){

    const container =
        byId(
            "directoryContainer"
        );


    if(!container){

        return;
    }


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


            const buildingButton =
                article.querySelector(
                    ".building-button"
                );


            if(buildingButton){

                buildingButton.addEventListener(
                    "click",
                    () => {

                        article.classList.toggle(
                            "open"
                        );

                    }
                );

            }


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
   MAIN FEATURE BUTTONS
========================================================= */

const openViewer =
    () =>
        showPage(
            "viewer"
        );


const openAR =
    () =>
        showPage(
            "ar"
        );


const openDirectory =
    () =>
        showPage(
            "directory"
        );


const openNavigation =
    () =>
        openNavigationWithDestination();


[
    "menu3D",
    "feature3D",
    "hero3DButton"
]
.forEach(id => {

    on(
        id,
        "click",
        openViewer
    );

});


[
    "menuAR",
    "featureAR",
    "heroARButton"
]
.forEach(id => {

    on(
        id,
        "click",
        openAR
    );

});


[
    "menuNavigation",
    "featureNav",
    "heroNavigationButton"
]
.forEach(id => {

    on(
        id,
        "click",
        openNavigation
    );

});


[
    "menuDirectory",
    "featureDirectory",
    "heroDirectoryButton"
]
.forEach(id => {

    on(
        id,
        "click",
        openDirectory
    );

});


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function toast(message){

    const element =
        byId(
            "toast"
        );


    if(!element){

        return;
    }


    element.textContent =
        message;


    element.classList.add(
        "show"
    );


    window.clearTimeout(
        toastTimer
    );


    toastTimer =
        window.setTimeout(
            () => {

                element.classList.remove(
                    "show"
                );

            },
            3200
        );

}


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key !==
            "Escape"
        ){

            return;
        }


        closeDrawer();


        const modal =
            byId(
                "infoModal"
            );


        if(
            modal
            &&
            !modal.classList.contains(
                "hidden"
            )
        ){

            closeInfo();

        }


        const arNavigation =
            byId(
                "arNavigationPage"
            );


        if(
            arNavigation
            &&
            arNavigation.classList.contains(
                "active"
            )
        ){

            stopNavigationCamera();


            showPage(
                "navigation"
            );

        }

    }
);


/* =========================================================
   PAGE RESTORE / MOBILE CACHE FIX
========================================================= */

/*
   Safari/iPhone kadang mengembalikan halaman dari
   Back-Forward Cache. Pastikan overlay lama tidak
   tertinggal dan memblokir sentuhan.
*/

window.addEventListener(
    "pageshow",
    () => {

        const overlay =
            byId(
                "drawerOverlay"
            );


        const drawer =
            byId(
                "drawer"
            );


        if(
            overlay
            &&
            !drawer?.classList.contains(
                "open"
            )
        ){

            overlay.classList.remove(
                "show"
            );

        }


        /*
           Pastikan home aktif bila karena cache browser
           tidak ada page yang aktif.
        */

        if(
            !document.querySelector(
                ".page.active"
            )
        ){

            const home =
                byId(
                    "homePage"
                );


            if(home){

                home.classList.add(
                    "active"
                );

            }

        }

    }
);
