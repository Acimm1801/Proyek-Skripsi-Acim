import {

    MAP_WIDTH,
    MAP_HEIGHT,
    NAVIGATION_MAP,

    buildings,
    rooms,
    entrances,

    mapNodes,
    mapEdges,

    getBuildingById,
    getEntranceById,

    getBuildingModels,
    getModelVariant,
    getDefaultModelVariant,

    getNavigationEntranceForLocation

} from "./data/map-data.js?v=30";


/* =========================================================
   SHORTCUT
========================================================= */

const $ =
    selector =>
        document.querySelector(selector);


const $$ =
    selector =>
        [...document.querySelectorAll(selector)];


const byId =
    id =>
        document.getElementById(id);


function on(
    id,
    event,
    handler
){

    byId(id)
        ?.addEventListener(
            event,
            handler
        );

}


function show(id){

    byId(id)
        ?.classList
        .remove("hidden");

}


function hide(id){

    byId(id)
        ?.classList
        .add("hidden");

}


function text(
    id,
    value
){

    const el =
        byId(id);

    if(el){

        el.textContent =
            value;

    }

}


/* =========================================================
   STATE
========================================================= */

const state = {

    currentPage:
        "home",

    pageHistory:
        [],

    currentSlide:
        0,

    landingModelIndex:
        0,

    destination:
        null,

    routeResult:
        null,

    activeEntrance:
        null,

    selectedStartPoint:
        null,

    infoLocation:
        null,

    globalSelection:
        null,

    liveInstructions:
        []

};


/* =========================================================
   LOCATION DATABASE
========================================================= */

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
                building.description,

            defaultEntranceId:
                building.defaultEntranceId

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
                building?.name
                ||
                "Fakultas Teknik UISU",

            description:

                `${room.name} berada di ${

                    building?.name
                    ||
                    "Fakultas Teknik UISU"

                }, lantai ${room.floor}.`

        });

    }
);


/* =========================================================
   PAGE SYSTEM
========================================================= */

function showPage(
    pageName,
    pushHistory = true
){

    const page =
        byId(
            `${pageName}Page`
        );


    if(!page){
        return;
    }


    if(
        pushHistory
        &&
        state.currentPage
        &&
        state.currentPage !== pageName
    ){

        state.pageHistory.push(
            state.currentPage
        );

    }


    $$(".page")
        .forEach(
            item =>
                item.classList.remove(
                    "active"
                )
        );


    page.classList.add(
        "active"
    );


    state.currentPage =
        pageName;


    closeDrawer();


    if(
        pageName !==
        "navigationActive"
    ){

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    }

}


function goBack(){

    const previous =
        state.pageHistory.pop()
        ||
        "home";


    showPage(
        previous,
        false
    );

}


$$("[data-back]")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                goBack
            );

        }
    );


on(
    "logoHome",
    "click",
    () =>
        showPage("home")
);


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


/* =========================================================
   DRAWER
========================================================= */

function openDrawer(){

    byId("drawer")
        ?.classList.add("open");

    byId("drawerOverlay")
        ?.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


function closeDrawer(){

    byId("drawer")
        ?.classList.remove("open");

    byId("drawerOverlay")
        ?.classList.remove("show");

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
   SLIDER
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
        (slide,i) => {

            slide.classList.toggle(
                "active",
                i === index
            );

        }
    );


    $$(".slider-dot")
        .forEach(
            (dot,i) => {

                dot.classList.toggle(
                    "active",
                    i === index
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
    .forEach(
        dot => {

            dot.addEventListener(
                "click",
                () =>
                    showSlide(
                        Number(
                            dot.dataset.slide
                        )
                    )
            );

        }
    );


/* =========================================================
   LANDING 3D MODELS
========================================================= */

const landingModels = [

    {
        name:
            "Gedung Biro Fakultas Teknik",

        src:
            "./assets/models/gedung_biro_indoor.glb"
    },

    {
        name:
            "Gedung Perkuliahan Fakultas Teknik",

        src:
            "./assets/models/gedung_perkuliahan_outdoor.glb"
    },

    {
        name:
            "Gedung Laboratorium Fakultas Teknik",

        src:
            "./assets/models/gedung_laboratorium.glb"
    }

];


function showLandingModel(index){

    index =
        (
            index +
            landingModels.length
        )
        %
        landingModels.length;


    state.landingModelIndex =
        index;


    const model =
        landingModels[index];


    const viewer =
        byId(
            "landingModelViewer"
        );


    viewer?.setAttribute(
        "src",
        model.src
    );


    text(
        "landingModelName",
        model.name
    );


    text(
        "landingModelCounter",
        `${index+1} / ${landingModels.length}`
    );

}


on(
    "landingNextModel",
    "click",
    () =>
        showLandingModel(
            state.landingModelIndex + 1
        )
);


showLandingModel(0);


/* =========================================================
   SEARCH
========================================================= */

function normalize(value){

    return String(
        value || ""
    )
        .toLowerCase()
        .trim();

}


function searchLocations(value){

    const query =
        normalize(value);


    if(!query){
        return [];
    }


    return locations

        .filter(
            location =>

                normalize(
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
                    onSelect(location)
            );


            container.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

const globalSearch =
    byId(
        "globalSearch"
    );


globalSearch
?.addEventListener(
    "input",
    event => {

        const value =
            event.target.value;


        if(!value){

            hide(
                "globalSearchResults"
            );

            return;

        }


        const results =
            byId(
                "globalSearchResults"
            );


        renderSearchResults(

            searchLocations(value),

            results,

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


        show(
            "globalSearchResults"
        );

    }
);


on(
    "clearGlobalSearch",
    "click",
    () => {

        globalSearch.value =
            "";

        state.globalSelection =
            null;

        hide(
            "globalSelected"
        );

        hide(
            "globalSearchResults"
        );

    }
);


/* =========================================================
   INFO MODAL
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
    );


    show(
        "infoModal"
    );

}


function closeInfo(){

    hide(
        "infoModal"
    );

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


on(
    "infoNavigationButton",
    "click",
    () => {

        if(!state.infoLocation){
            return;
        }


        const destination =
            state.infoLocation;


        closeInfo();


        openNavigationWithDestination(
            destination
        );

    }
);


/* =========================================================
   BUILDING SELECTS
========================================================= */

function populateBuildingSelect(select){

    if(!select){
        return;
    }


    select.innerHTML = `

        <option value="">
            -- Pilih Gedung --
        </option>

    `;


    buildings.forEach(
        building => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                building.id;


            option.textContent =
                building.name;


            select.appendChild(
                option
            );

        }
    );

}


populateBuildingSelect(
    byId("viewerBuildingSelect")
);


populateBuildingSelect(
    byId("arBuildingSelect")
);


function configureVariants(
    buildingId,
    wrapId,
    selectId
){

    const select =
        byId(selectId);


    const models =
        getBuildingModels(
            buildingId
        );


    select.innerHTML =
        "";


    models.forEach(
        model => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                model.id;


            option.textContent =
                model.name;


            select.appendChild(
                option
            );

        }
    );


    if(models.length > 1){

        show(wrapId);

    }else{

        hide(wrapId);

    }

}


byId("viewerBuildingSelect")
?.addEventListener(
    "change",
    event => {

        configureVariants(

            event.target.value,

            "viewerVariantWrap",

            "viewerVariantSelect"

        );

    }
);


byId("arBuildingSelect")
?.addEventListener(
    "change",
    event => {

        configureVariants(

            event.target.value,

            "arVariantWrap",

            "arVariantSelect"

        );

    }
);


/* =========================================================
   3D VIEWER
========================================================= */

const mainModelViewer =
    byId(
        "mainModelViewer"
    );


on(
    "show3DModel",
    "click",
    () => {

        const buildingId =
            byId(
                "viewerBuildingSelect"
            )
            ?.value;


        if(!buildingId){

            text(
                "viewerMessage",
                "Pilih gedung terlebih dahulu."
            );

            return;

        }


        const building =
            getBuildingById(
                buildingId
            );


        const variantId =
            byId(
                "viewerVariantSelect"
            )
            ?.value;


        const model =
            getModelVariant(
                buildingId,
                variantId
            )
            ||
            getDefaultModelVariant(
                buildingId
            );


        if(!model){
            return;
        }


        mainModelViewer.setAttribute(
            "src",
            model.src
        );


        text(
            "viewerTitle",
            building.name
        );


        text(
            "viewerModeBadge",
            model.name
        );


        text(
            "viewerModelDescription",
            model.viewerDescription
        );


        show(
            "viewerCard"
        );

    }
);


/* =========================================================
   3D FOCUS
========================================================= */

const modelFocusRing =
    byId(
        "modelFocusRing"
    );


let pointerStart =
    null;


let pointerMoved =
    false;


function hideFocusRing(){

    modelFocusRing
        ?.classList
        .remove(
            "focus-visible"
        );


    hide(
        "modelFocusRing"
    );

}


mainModelViewer
?.addEventListener(
    "pointerdown",
    event => {

        hideFocusRing();


        pointerStart = {
            x:event.clientX,
            y:event.clientY
        };


        pointerMoved =
            false;

    }
);


mainModelViewer
?.addEventListener(
    "pointermove",
    event => {

        if(!pointerStart){
            return;
        }


        if(
            Math.hypot(
                event.clientX -
                pointerStart.x,

                event.clientY -
                pointerStart.y
            )
            >
            8
        ){

            pointerMoved =
                true;


            hideFocusRing();

        }

    }
);


mainModelViewer
?.addEventListener(
    "wheel",
    hideFocusRing,
    {passive:true}
);


mainModelViewer
?.addEventListener(
    "pointerup",
    event => {

        if(
            !pointerStart
            ||
            pointerMoved
        ){

            pointerStart =
                null;

            return;

        }


        const stage =
            byId(
                "modelViewerStage"
            );


        const rect =
            stage.getBoundingClientRect();


        try{

            const hit =
                mainModelViewer
                .positionAndNormalFromPoint(

                    event.clientX,

                    event.clientY

                );


            if(!hit?.position){

                pointerStart =
                    null;

                return;

            }


            mainModelViewer.cameraTarget =

                `${hit.position.x}m ${hit.position.y}m ${hit.position.z}m`;


            const orbit =
                mainModelViewer
                .getCameraOrbit();


            mainModelViewer.cameraOrbit =

                `${orbit.theta}rad ${orbit.phi}rad ${Math.max(
                    orbit.radius*.55,
                    .08
                )}m`;


            modelFocusRing.style.left =

                `${
                    event.clientX -
                    rect.left
                }px`;


            modelFocusRing.style.top =

                `${
                    event.clientY -
                    rect.top
                }px`;


            show(
                "modelFocusRing"
            );


            requestAnimationFrame(
                () =>
                    modelFocusRing
                        .classList
                        .add(
                            "focus-visible"
                        )
            );

        }

        catch(error){

            console.warn(error);

        }


        pointerStart =
            null;

    }
);


on(
    "resetCamera",
    "click",
    () => {

        hideFocusRing();


        mainModelViewer.cameraOrbit =
            "auto auto auto";


        mainModelViewer.cameraTarget =
            "auto auto auto";


        mainModelViewer.fieldOfView =
            "auto";

    }
);


/* =========================================================
   ROUTE GRAPH BUILD
========================================================= */

function distance(a,b){

    return Math.hypot(
        a.x-b.x,
        a.y-b.y
    );

}


const graph = {};


Object.keys(
    mapNodes
)
.forEach(
    nodeId => {

        graph[nodeId] =
            [];

    }
);


const preparedEdges =
    mapEdges.map(
        edge => {

            const points =
                edge.points.map(
                    ([x,y])=>({x,y})
                );


            let length =
                0;


            const cumulative =
                [0];


            for(
                let i=0;
                i<points.length-1;
                i++
            ){

                length +=
                    distance(
                        points[i],
                        points[i+1]
                    );


                cumulative.push(
                    length
                );

            }


            return {
                ...edge,
                points,
                length,
                cumulative
            };

        }
    );


preparedEdges.forEach(
    edge => {

        graph[edge.from]
            ?.push({

                node:edge.to,
                edgeId:edge.id,
                weight:edge.length

            });


        graph[edge.to]
            ?.push({

                node:edge.from,
                edgeId:edge.id,
                weight:edge.length

            });

    }
);


const edgeById =
    new Map(

        preparedEdges.map(
            edge=>[
                edge.id,
                edge
            ]
        )

    );


/* =========================================================
   SNAP TO ROUTE
========================================================= */

function projectToSegment(
    point,
    a,
    b
){

    const abX =
        b.x-a.x;

    const abY =
        b.y-a.y;

    const apX =
        point.x-a.x;

    const apY =
        point.y-a.y;


    const lengthSq =
        abX*abX+
        abY*abY;


    let t =
        lengthSq
        ?
        (
            apX*abX+
            apY*abY
        )
        /
        lengthSq
        :
        0;


    t =
        Math.max(
            0,
            Math.min(1,t)
        );


    const projected = {

        x:
            a.x +
            abX*t,

        y:
            a.y +
            abY*t

    };


    return {

        point:projected,

        t,

        distance:
            distance(
                point,
                projected
            )

    };

}


function snapToRoute(point){

    let best =
        null;


    preparedEdges.forEach(
        edge => {

            for(
                let i=0;
                i<edge.points.length-1;
                i++
            ){

                const a =
                    edge.points[i];

                const b =
                    edge.points[i+1];


                const projection =
                    projectToSegment(
                        point,
                        a,
                        b
                    );


                const segmentLength =
                    distance(a,b);


                const along =
                    edge.cumulative[i]
                    +
                    segmentLength*
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

                        point:
                            projection.point,

                        distance:
                            projection.distance,

                        along,

                        distanceToFrom:
                            along,

                        distanceToTo:
                            edge.length-along

                    };

                }

            }

        }
    );


    return best;

}


/* =========================================================
   DIJKSTRA
========================================================= */

function dijkstra(
    start,
    end
){

    const dist = {};
    const prev = {};
    const prevEdge = {};

    const remaining =
        new Set(
            Object.keys(
                mapNodes
            )
        );


    Object.keys(
        mapNodes
    )
    .forEach(
        id => {

            dist[id] =
                Infinity;

            prev[id] =
                null;

            prevEdge[id] =
                null;

        }
    );


    dist[start] =
        0;


    while(remaining.size){

        let current =
            null;


        let minimum =
            Infinity;


        remaining.forEach(
            id => {

                if(
                    dist[id]
                    <
                    minimum
                ){

                    minimum =
                        dist[id];

                    current =
                        id;

                }

            }
        );


        if(current===null){
            break;
        }


        if(current===end){
            break;
        }


        remaining.delete(
            current
        );


        graph[current]
            .forEach(
                connection => {

                    if(
                        !remaining.has(
                            connection.node
                        )
                    ){
                        return;
                    }


                    const candidate =
                        dist[current]
                        +
                        connection.weight;


                    if(
                        candidate
                        <
                        dist[
                            connection.node
                        ]
                    ){

                        dist[
                            connection.node
                        ] =
                            candidate;


                        prev[
                            connection.node
                        ] =
                            current;


                        prevEdge[
                            connection.node
                        ] =
                            connection.edgeId;

                    }

                }
            );

    }


    if(
        !Number.isFinite(
            dist[end]
        )
    ){

        return null;

    }


    const nodes = [];
    const edges = [];


    let cursor =
        end;


    while(cursor){

        nodes.unshift(
            cursor
        );


        if(cursor===start){
            break;
        }


        edges.unshift(
            prevEdge[cursor]
        );


        cursor =
            prev[cursor];

    }


    return {

        distance:
            dist[end],

        nodes,
        edges

    };

}


/* =========================================================
   ROUTE START SNAP -> ENTRANCE NODE
========================================================= */

function routeFromSnapToNode(
    snap,
    targetNodeId
){

    const candidates = [];


    [
        snap.edge.from,
        snap.edge.to
    ]
    .forEach(
        startNode => {

            const route =
                dijkstra(
                    startNode,
                    targetNodeId
                );


            if(!route){
                return;
            }


            const startCost =
                startNode===
                snap.edge.from

                ?
                snap.distanceToFrom

                :
                snap.distanceToTo;


            candidates.push({

                startNode,

                total:
                    startCost+
                    route.distance,

                route

            });

        }
    );


    return candidates
        .sort(
            (a,b)=>
                a.total-b.total
        )[0]
        ||
        null;

}


/* =========================================================
   BUILD POLYLINE
========================================================= */

function pointsFromSnapToEndpoint(
    snap,
    endpoint
){

    const points =
        snap.edge.points;


    const result = [
        {...snap.point}
    ];


    if(
        endpoint===
        snap.edge.from
    ){

        result.push(
            points[
                snap.segmentIndex
            ]
        );


        for(
            let i=
                snap.segmentIndex-1;

            i>=0;

            i--
        ){

            result.push(
                points[i]
            );

        }

    }else{

        result.push(
            points[
                snap.segmentIndex+1
            ]
        );


        for(
            let i=
                snap.segmentIndex+2;

            i<points.length;

            i++
        ){

            result.push(
                points[i]
            );

        }

    }


    return result;

}


function routeNodePolyline(route){

    const result = [];


    route.edges
        .forEach(
            (edgeId,index) => {

                const edge =
                    edgeById.get(
                        edgeId
                    );


                const fromNode =
                    route.nodes[index];


                let points =
                    edge.from===
                    fromNode

                    ?
                    edge.points

                    :
                    [...edge.points]
                        .reverse();


                if(result.length){

                    points =
                        points.slice(1);

                }


                result.push(
                    ...points
                );

            }
        );


    return result;

}


function dedupePoints(points){

    const result = [];


    points.forEach(
        point => {

            const previous =
                result[
                    result.length-1
                ];


            if(
                !previous
                ||
                distance(
                    previous,
                    point
                )
                >
                .4
            ){

                result.push(
                    point
                );

            }

        }
    );


    return result;

}


/* =========================================================
   NAVIGATION DESTINATION ENTRANCE
========================================================= */

function resolveDestinationEntrance(){

    return getNavigationEntranceForLocation(
        state.destination
    );

}


/* =========================================================
   BUILD ROUTE
========================================================= */

function buildRoute(
    clickedPoint
){

    const entrance =
        resolveDestinationEntrance();


    if(!entrance){

        return null;

    }


    const startSnap =
        snapToRoute(
            clickedPoint
        );


    if(!startSnap){

        return null;

    }


    const endpointRoute =
        routeFromSnapToNode(

            startSnap,

            entrance.nodeId

        );


    if(!endpointRoute){

        return null;

    }


    const startPart =
        pointsFromSnapToEndpoint(

            startSnap,

            endpointRoute.startNode

        );


    const middlePart =
        routeNodePolyline(
            endpointRoute.route
        );


    const points =
        dedupePoints([

            ...startPart,

            ...middlePart,

            {
                x:entrance.x,
                y:entrance.y
            }

        ]);


    return {

        startSnap,

        entrance,

        points,

        graphDistance:
            endpointRoute.total

    };

}


/* =========================================================
   MAP POSITION
========================================================= */

function positionElement(
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
            point.x /
            MAP_WIDTH *
            100
        }%`;


    element.style.top =
        `${
            point.y /
            MAP_HEIGHT *
            100
        }%`;

}


/* =========================================================
   NAVIGATION SEARCH
========================================================= */

function resetNavigation(){

    state.destination =
        null;

    state.routeResult =
        null;

    state.activeEntrance =
        null;

    state.selectedStartPoint =
        null;


    const input =
        byId(
            "navigationSearch"
        );


    if(input){

        input.value =
            "";

    }


    byId(
        "activeRoute"
    )
    ?.setAttribute(
        "points",
        ""
    );


    hide(
        "mapSection"
    );

    hide(
        "selectedDestination"
    );

    hide(
        "routeFoundBox"
    );

    hide(
        "userMarker"
    );

    hide(
        "entranceMarker"
    );

}


function selectDestination(location){

    state.destination =
        location;


    const input =
        byId(
            "navigationSearch"
        );


    input.value =
        location.name;


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


    byId(
        "navigationSearchResults"
    ).innerHTML =
        "";


    text(

        "mapHeadingTitle",

        `Tap pada denah sesuai posisi Anda sekarang, lalu sistem akan memberikan jalur terdekat menuju ${location.name}.`

    );


    show(
        "mapSection"
    );


    hide(
        "routeFoundBox"
    );


    byId(
        "activeRoute"
    )
    ?.setAttribute(
        "points",
        ""
    );


    hide(
        "userMarker"
    );


    hide(
        "entranceMarker"
    );

}


byId(
    "navigationSearch"
)
?.addEventListener(
    "input",
    event => {

        const results =
            searchLocations(
                event.target.value
            );


        renderSearchResults(

            results,

            byId(
                "navigationSearchResults"
            ),

            selectDestination

        );

    }
);


function openNavigationWithDestination(
    location = null
){

    showPage(
        "navigation"
    );


    resetNavigation();


    if(location){

        selectDestination(
            location
        );

    }

}


/* =========================================================
   MAP CLICK
========================================================= */

on(
    "navigationMap",
    "click",
    event => {

        if(!state.destination){

            toast(
                "Pilih tujuan terlebih dahulu."
            );

            return;

        }


        const map =
            byId(
                "navigationMap"
            );


        const rect =
            map.getBoundingClientRect();


        const clickPoint = {

            x:
                (
                    event.clientX-
                    rect.left
                )
                /
                rect.width
                *
                MAP_WIDTH,

            y:
                (
                    event.clientY-
                    rect.top
                )
                /
                rect.height
                *
                MAP_HEIGHT

        };


        const route =
            buildRoute(
                clickPoint
            );


        if(!route){

            toast(
                "Rute belum dapat ditemukan."
            );

            return;

        }


        state.routeResult =
            route;


        state.activeEntrance =
            route.entrance;


        state.selectedStartPoint =
            route.startSnap.point;


        byId(
            "activeRoute"
        )
        ?.setAttribute(

            "points",

            route.points
                .map(
                    point =>
                        `${point.x},${point.y}`
                )
                .join(" ")

        );


        positionElement(

            byId(
                "userMarker"
            ),

            route.startSnap.point

        );


        positionElement(

            byId(
                "entranceMarker"
            ),

            route.entrance

        );


        text(
            "entranceLabel",
            route.entrance.name
        );


        show(
            "userMarker"
        );


        show(
            "entranceMarker"
        );


        hide(
            "mapInstructionArea"
        );


        text(

            "routeFoundDescription",

            `Jalur biru menuju ${route.entrance.name}.`

        );


        show(
            "routeFoundBox"
        );

    }
);


/* =========================================================
   TURN INSTRUCTION GENERATOR
========================================================= */

function angleBetween(
    a,
    b,
    c
){

    const v1 = {
        x:
            b.x-a.x,

        y:
            b.y-a.y
    };


    const v2 = {
        x:
            c.x-b.x,

        y:
            c.y-b.y
    };


    const cross =
        v1.x*v2.y-
        v1.y*v2.x;


    const dot =
        v1.x*v2.x+
        v1.y*v2.y;


    const angle =
        Math.atan2(
            cross,
            dot
        )
        *
        180 /
        Math.PI;


    return angle;

}


function simplifyRouteForInstructions(points){

    if(points.length<=2){
        return points;
    }


    const output = [
        points[0]
    ];


    for(
        let i=1;
        i<points.length-1;
        i++
    ){

        const angle =
            angleBetween(
                points[i-1],
                points[i],
                points[i+1]
            );


        if(
            Math.abs(angle)>25
        ){

            output.push(
                points[i]
            );

        }

    }


    output.push(
        points[
            points.length-1
        ]
    );


    return output;

}


function createNavigationInstructions(){

    const route =
        state.routeResult;


    if(!route){

        return [];
    }


    const destinationName =
        state.destination.name;


    const entrance =
        route.entrance;


    const reduced =
        simplifyRouteForInstructions(
            route.points
        );


    const instructions = [

        {
            icon:"●",

            title:
                "Lokasi Anda saat ini",

            description:
                "Posisi awal sesuai titik yang Anda tandai pada denah."
        }

    ];


    for(
        let i=1;
        i<reduced.length-1;
        i++
    ){

        const angle =
            angleBetween(
                reduced[i-1],
                reduced[i],
                reduced[i+1]
            );


        let title =
            "Lanjut lurus";


        let icon =
            "↑";


        if(angle>25){

            title =
                "Belok kanan";

            icon =
                "↱";

        }


        if(angle<-25){

            title =
                "Belok kiri";

            icon =
                "↰";

        }


        instructions.push({

            icon,

            title,

            description:
                "Ikuti jalur hingga persimpangan berikutnya."

        });

    }


    instructions.push({

        icon:"◎",

        title:
            "Entrance tujuan ada di depan",

        description:
            entrance.name

    });


    if(entrance.deadEnd){

        instructions.push({

            icon:"⌂",

            title:
                "Gunakan entrance khusus ini",

            description:
                `${entrance.name} merupakan entrance yang digunakan untuk tujuan ${destinationName}.`

        });

    }


    instructions.push({

        icon:"✓",

        title:
            "Anda sudah tiba",

        description:
            destinationName

    });


    return instructions;

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function renderLiveRoute(){

    const route =
        state.routeResult;


    if(!route){
        return;
    }


    byId(
        "liveRoute"
    )
    ?.setAttribute(

        "points",

        route.points
            .map(
                point =>
                    `${point.x},${point.y}`
            )
            .join(" ")

    );


    positionElement(

        byId(
            "liveUserMarker"
        ),

        route.startSnap.point

    );


    positionElement(

        byId(
            "liveDestinationMarker"
        ),

        route.entrance

    );


    text(
        "liveDestinationMarkerLabel",
        state.destination.name
    );


    text(
        "liveRouteDestination",
        state.destination.name
    );


    text(
        "liveDestinationTitle",
        state.destination.name
    );


    text(
        "liveRouteEntrance",
        route.entrance.name
    );


    state.liveInstructions =
        createNavigationInstructions();


    const firstMovement =
        state.liveInstructions
            .find(
                item =>
                    ![
                        "Lokasi Anda saat ini",
                        "Anda sudah tiba"
                    ]
                    .includes(
                        item.title
                    )
            );


    text(
        "liveNextInstruction",
        firstMovement?.title
        ||
        "Ikuti jalur"
    );


    text(
        "liveManeuverIcon",
        firstMovement?.icon
        ||
        "↑"
    );


    renderRouteDetails();

}


function renderRouteDetails(){

    const container =
        byId(
            "routeInstructionList"
        );


    container.innerHTML =
        "";


    state.liveInstructions
        .forEach(
            step => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "route-instruction-item";


                item.innerHTML = `

                    <div class="route-step-icon">

                        ${step.icon}

                    </div>


                    <div class="route-step-copy">

                        <strong>

                            ${step.title}

                        </strong>

                        <span>

                            ${step.description}

                        </span>

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

}


/* =========================================================
   START NAVIGATION
========================================================= */

on(
    "startNavigation",
    "click",
    () => {

        if(
            !state.routeResult
            ||
            !state.destination
        ){

            return;

        }


        renderLiveRoute();


        showPage(
            "navigationActive"
        );


        requestAnimationFrame(
            () => {

                byId(
                    "liveMapContent"
                )
                ?.classList
                .add(
                    "navigation-started"
                );

            }
        );

    }
);


/* =========================================================
   DETAIL BUTTON
========================================================= */

on(
    "toggleRouteDetail",
    "click",
    () => {

        byId(
            "routeDetailPanel"
        )
        ?.classList
        .toggle(
            "hidden"
        );

    }
);


on(
    "collapseRouteSheet",
    "click",
    () => {

        byId(
            "routeDetailPanel"
        )
        ?.classList
        .toggle(
            "hidden"
        );

    }
);


/* =========================================================
   END ROUTE
========================================================= */

on(
    "endRoute",
    "click",
    () => {

        byId(
            "liveMapContent"
        )
        ?.classList
        .remove(
            "navigation-started"
        );


        resetNavigation();


        state.pageHistory =
            [];


        showPage(
            "navigation",
            false
        );


        toast(
            "Navigasi telah diakhiri."
        );

    }
);


/* =========================================================
   SHOW DESTINATION IN 3D
========================================================= */

function showDestinationIn3D(){

    const destination =
        state.destination;


    if(!destination){
        return;
    }


    const building =
        getBuildingById(
            destination.buildingId
            ||
            destination.id
        );


    if(!building){
        return;
    }


    /*
       Untuk RUANGAN gunakan model Indoor
       jika tersedia.

       Untuk GEDUNG gunakan model default.
    */

    let model = null;


    if(destination.type==="room"){

        model =
            building.models.find(
                item =>
                    item.id==="indoor"
            )
            ||
            getDefaultModelVariant(
                building.id
            );

    }else{

        model =
            getDefaultModelVariant(
                building.id
            );

    }


    if(!model){
        return;
    }


    showPage(
        "viewer"
    );


    byId(
        "viewerBuildingSelect"
    ).value =
        building.id;


    configureVariants(

        building.id,

        "viewerVariantWrap",

        "viewerVariantSelect"

    );


    if(
        byId(
            "viewerVariantSelect"
        )
    ){

        byId(
            "viewerVariantSelect"
        ).value =
            model.id;

    }


    mainModelViewer.setAttribute(
        "src",
        model.src
    );


    text(
        "viewerTitle",
        building.name
    );


    text(
        "viewerModeBadge",
        model.name
    );


    text(
        "viewerModelDescription",
        model.viewerDescription
    );


    show(
        "viewerCard"
    );


    /*
       MARKER 3D TEPAT
       baru bisa digunakan setelah modelMarker
       tiap ruangan diberikan.
    */

    const hotspot =
        byId(
            "destination3DHotspot"
        );


    const marker =
        destination.modelMarker;


    if(marker){

        hotspot.dataset.position =
            `${marker.x}m ${marker.y}m ${marker.z}m`;


        text(
            "destination3DLabel",
            destination.name
        );


        show(
            "destination3DHotspot"
        );

    }else{

        hide(
            "destination3DHotspot"
        );


        text(

            "viewerMessage",

            destination.type==="room"

            ?
            "Model gedung berhasil dibuka. Koordinat marker 3D ruangan belum dimasukkan ke database."

            :
            ""

        );

    }

}


on(
    "showDestination3D",
    "click",
    showDestinationIn3D
);


/* =========================================================
   DIRECTORY
========================================================= */

function renderRoomList(
    list,
    container
){

    container.innerHTML =
        "";


    if(!list.length){

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


    list.forEach(
        room => {

            const location =
                locations.find(
                    item =>
                        item.id===room.id
                );


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


            item.querySelector(
                ".room-row button"
            )
            .addEventListener(
                "click",
                () => {

                    item.querySelector(
                        ".room-actions"
                    )
                    .classList
                    .toggle(
                        "hidden"
                    );

                }
            );


            item.querySelector(
                ".room-info-button"
            )
            .addEventListener(
                "click",
                () =>
                    openInfo(location)
            );


            item.querySelector(
                ".room-nav-button"
            )
            .addEventListener(
                "click",
                () =>
                    openNavigationWithDestination(
                        location
                    )
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


function renderLaboratory(
    list,
    container
){

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


                button.type =
                    "button";


                button.className =
                    "floor-button";


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
                                el =>
                                    el
                                    .classList
                                    .remove(
                                        "active"
                                    )
                            );


                        button.classList.add(
                            "active"
                        );


                        renderRoomList(

                            list.filter(
                                room =>
                                    room.floor===
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


    container.append(
        floorButtons,
        roomArea
    );


    floorButtons
        .firstElementChild
        ?.click();

}


function renderDirectory(){

    const container =
        byId(
            "directoryContainer"
        );


    container.innerHTML =
        "";


    buildings.forEach(
        (building,index) => {

            const list =
                rooms.filter(
                    room =>
                        room.buildingId===
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
                            String(index+1)
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


            article.querySelector(
                ".building-button"
            )
            .addEventListener(
                "click",
                () => {

                    article
                        .classList
                        .toggle(
                            "open"
                        );

                }
            );


            const content =
                article.querySelector(
                    ".building-content"
                );


            if(
                building.id===
                "laboratorium-ft"
            ){

                renderLaboratory(
                    list,
                    content
                );

            }else{

                renderRoomList(
                    list,
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
   FEATURE LINKS
========================================================= */

[
    "menu3D",
    "feature3D",
    "hero3DButton"
]
.forEach(
    id =>
        on(
            id,
            "click",
            () =>
                showPage("viewer")
        )
);


[
    "menuAR",
    "featureAR",
    "heroARButton"
]
.forEach(
    id =>
        on(
            id,
            "click",
            () =>
                showPage("ar")
        )
);


[
    "menuNavigation",
    "featureNav",
    "heroNavigationButton"
]
.forEach(
    id =>
        on(
            id,
            "click",
            () =>
                openNavigationWithDestination()
        )
);


[
    "menuDirectory",
    "featureDirectory",
    "heroDirectoryButton"
]
.forEach(
    id =>
        on(
            id,
            "click",
            () =>
                showPage("directory")
        )
);


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function toast(message){

    const el =
        byId(
            "toast"
        );


    el.textContent =
        message;


    el.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () =>
                el.classList.remove(
                    "show"
                ),
            2600
        );

}


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key!=="Escape"
        ){
            return;
        }


        closeDrawer();


        if(
            state.currentPage!==
            "home"
        ){

            goBack();

        }

    }
);
