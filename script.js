import {

    MAP_WIDTH,
    MAP_HEIGHT,

    buildings,
    rooms,

    routeNodes,
    routeEdges,

    getBuildingById,
    getBuildingModels,
    getModelVariant,
    getDefaultModelVariant

} from "./data/map-data.js?v=29";


/* =========================================================
   DOM
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


function on(id,event,handler){

    const element =
        byId(id);

    if(element){

        element.addEventListener(
            event,
            handler
        );

    }

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

    byId(id)
        ?.classList
        .remove("hidden");

}


function hide(id){

    byId(id)
        ?.classList
        .add("hidden");

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

    globalSelection:
        null,

    infoLocation:
        null,

    destination:
        null,

    routeResult:
        null,

    cameraStream:
        null

};


/* =========================================================
   LANDING 3D
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


/* =========================================================
   LOCATION DATABASE
========================================================= */

const locations =
    [];


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
                building?.name
                ||
                "Fakultas Teknik UISU",

            description:

                `${room.name} berada di ${

                    building?.name
                    ||
                    "Fakultas Teknik UISU"

                }${

                    room.floor
                    ?
                    `, lantai ${room.floor}`
                    :
                    ""

                }. Detail informasi ruangan akan dilengkapi kemudian.`

        });

    }
);


/* =========================================================
   DRAWER
========================================================= */

function openDrawer(){

    byId("drawer")
        ?.classList
        .add("open");


    byId("drawerOverlay")
        ?.classList
        .add("show");


    byId("drawer")
        ?.setAttribute(
            "aria-hidden",
            "false"
        );


    byId("hamburgerButton")
        ?.setAttribute(
            "aria-expanded",
            "true"
        );


    document.body.style.overflow =
        "hidden";

}


function closeDrawer(){

    byId("drawer")
        ?.classList
        .remove("open");


    byId("drawerOverlay")
        ?.classList
        .remove("show");


    byId("drawer")
        ?.setAttribute(
            "aria-hidden",
            "true"
        );


    byId("hamburgerButton")
        ?.setAttribute(
            "aria-expanded",
            "false"
        );


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
   PAGE SYSTEM
========================================================= */

function showPage(
    pageName,
    pushHistory = true
){

    const target =
        byId(
            `${pageName}Page`
        );


    if(!target){

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
            page => {

                page.classList.remove(
                    "active"
                );

            }
        );


    target.classList.add(
        "active"
    );


    state.currentPage =
        pageName;


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


function goBack(){

    if(
        state.currentPage ===
        "arNavigation"
    ){

        stopNavigationCamera();

    }


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
                () => {

                    showPage(
                        button.dataset.page
                    );

                }
            );

        }
    );


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
                () => {

                    showSlide(
                        Number(
                            dot.dataset.slide
                        )
                    );

                }
            );

        }
    );


/* =========================================================
   LANDING MODEL
========================================================= */

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


    if(viewer){

        viewer.setAttribute(
            "src",
            model.src
        );


        viewer.setAttribute(
            "alt",
            model.name
        );

    }


    text(
        "landingModelName",
        model.name
    );


    text(
        "landingModelCounter",
        `${index + 1} / ${landingModels.length}`
    );

}


on(
    "landingNextModel",
    "click",
    event => {

        event.preventDefault();

        event.stopPropagation();


        showLandingModel(
            state.landingModelIndex + 1
        );

    }
);


showLandingModel(0);


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

        .filter(
            location =>

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


    container.classList.remove(
        "hidden"
    );

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

const globalSearch =
    byId(
        "globalSearch"
    );


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


/* =========================================================
   INFO MODAL
========================================================= */

function openInfo(location){

    if(!location){

        return;

    }


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
    "globalInfoButton",
    "click",
    () => {

        if(
            state.globalSelection
        ){

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

        if(
            state.globalSelection
        ){

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

        if(
            !state.infoLocation
        ){

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


            selectElement.appendChild(
                option
            );

        }
    );

}


populateBuildingSelect(
    byId(
        "viewerBuildingSelect"
    )
);


populateBuildingSelect(
    byId(
        "arBuildingSelect"
    )
);


/* =========================================================
   MODEL VARIANT SELECT
========================================================= */

function configureModelVariants(
    buildingId,
    wrapId,
    selectId
){

    const select =
        byId(
            selectId
        );


    if(!select){

        return;

    }


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


    const building =
        getBuildingById(
            buildingId
        );


    if(
        building?.defaultModel
    ){

        select.value =
            building.defaultModel;

    }


    if(
        models.length > 1
    ){

        show(
            wrapId
        );

    }

    else{

        hide(
            wrapId
        );

    }

}


function resolveSelectedModel(
    buildingSelectId,
    variantSelectId
){

    const buildingId =
        byId(
            buildingSelectId
        )
        ?.value;


    if(!buildingId){

        return {

            building:null,
            model:null

        };

    }


    const building =
        getBuildingById(
            buildingId
        );


    const variantId =
        byId(
            variantSelectId
        )
        ?.value
        ||
        building.defaultModel;


    const model =

        getModelVariant(
            building.id,
            variantId
        )

        ||

        getDefaultModelVariant(
            building.id
        );


    return {

        building,
        model

    };

}


byId(
    "viewerBuildingSelect"
)
?.addEventListener(
    "change",
    event => {

        configureModelVariants(

            event.target.value,

            "viewerVariantWrap",

            "viewerVariantSelect"

        );


        hide(
            "viewerCard"
        );

    }
);


byId(
    "arBuildingSelect"
)
?.addEventListener(
    "change",
    event => {

        configureModelVariants(

            event.target.value,

            "arVariantWrap",

            "arVariantSelect"

        );


        hide(
            "arCard"
        );

    }
);


/* =========================================================
   MAIN 3D VIEWER
========================================================= */

const mainModelViewer =
    byId(
        "mainModelViewer"
    );


const modelFocusRing =
    byId(
        "modelFocusRing"
    );


function hideFocusRing(){

    if(
        !modelFocusRing
    ){

        return;

    }


    modelFocusRing.classList.remove(
        "focus-visible"
    );


    modelFocusRing.classList.add(
        "hidden"
    );

}


function showFocusRingAt(
    clientX,
    clientY
){

    const stage =
        byId(
            "modelViewerStage"
        );


    if(
        !stage
        ||
        !modelFocusRing
    ){

        return;

    }


    const rect =
        stage.getBoundingClientRect();


    const x =
        Math.max(
            0,
            Math.min(
                rect.width,
                clientX -
                rect.left
            )
        );


    const y =
        Math.max(
            0,
            Math.min(
                rect.height,
                clientY -
                rect.top
            )
        );


    modelFocusRing.style.left =
        `${x}px`;


    modelFocusRing.style.top =
        `${y}px`;


    modelFocusRing.classList.remove(
        "hidden"
    );


    requestAnimationFrame(
        () => {

            modelFocusRing.classList.add(
                "focus-visible"
            );

        }
    );

}


on(
    "show3DModel",
    "click",
    () => {

        const {
            building,
            model
        } =
        resolveSelectedModel(

            "viewerBuildingSelect",

            "viewerVariantSelect"

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


        if(!model){

            text(
                "viewerMessage",
                "Model 3D belum tersedia."
            );

            hide(
                "viewerCard"
            );

            return;

        }


        hideFocusRing();


        if(
            mainModelViewer
        ){

            mainModelViewer.setAttribute(
                "src",
                model.src
            );


            mainModelViewer.setAttribute(
                "alt",
                model.label
            );


            mainModelViewer.setAttribute(
                "min-camera-orbit",
                "auto auto 0.02m"
            );


            mainModelViewer.setAttribute(
                "min-field-of-view",
                "5deg"
            );

        }


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
            ||
            "Model 3D Fakultas Teknik UISU."
        );


        text(
            "viewerMessage",
            ""
        );


        show(
            "viewerCard"
        );


        window.setTimeout(
            () => {

                byId(
                    "viewerCard"
                )
                ?.scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });

            },
            100
        );

    }
);


/* =========================================================
   3D CLICK FOCUS
========================================================= */

const activeViewerPointers =
    new Map();


let focusPointerStart =
    null;


let focusPointerMoved =
    false;


const CLICK_MOVE_LIMIT =
    8;


function pointMovement(
    start,
    current
){

    return Math.hypot(

        current.x -
        start.x,

        current.y -
        start.y

    );

}


/*
   Saat user mulai menyentuh / menekan model,
   lingkaran sebelumnya langsung hilang.
*/

mainModelViewer
?.addEventListener(
    "pointerdown",
    event => {

        hideFocusRing();


        activeViewerPointers.set(
            event.pointerId,
            {
                x:event.clientX,
                y:event.clientY
            }
        );


        /*
           Dua pointer berarti pinch.
        */

        if(
            activeViewerPointers.size > 1
        ){

            focusPointerStart =
                null;

            focusPointerMoved =
                true;

            return;

        }


        focusPointerStart = {

            x:event.clientX,

            y:event.clientY,

            pointerId:
                event.pointerId

        };


        focusPointerMoved =
            false;

    }
);


/*
   Drag / rotate / pinch:
   lingkaran tetap hilang.
*/

mainModelViewer
?.addEventListener(
    "pointermove",
    event => {

        if(
            activeViewerPointers.has(
                event.pointerId
            )
        ){

            activeViewerPointers.set(
                event.pointerId,
                {
                    x:event.clientX,
                    y:event.clientY
                }
            );

        }


        if(
            activeViewerPointers.size > 1
        ){

            focusPointerMoved =
                true;


            hideFocusRing();


            return;

        }


        if(
            !focusPointerStart
        ){

            return;

        }


        const movement =
            pointMovement(

                focusPointerStart,

                {
                    x:event.clientX,
                    y:event.clientY
                }

            );


        if(
            movement >
            CLICK_MOVE_LIMIT
        ){

            focusPointerMoved =
                true;


            hideFocusRing();

        }

    }
);


/*
   Saat pointer dilepas:
   hanya dianggap CLICK apabila pointer tidak bergerak.
*/

mainModelViewer
?.addEventListener(
    "pointerup",
    async event => {

        const wasMultiTouch =
            activeViewerPointers.size > 1;


        activeViewerPointers.delete(
            event.pointerId
        );


        if(
            wasMultiTouch
            ||
            !focusPointerStart
            ||
            focusPointerMoved
        ){

            focusPointerStart =
                null;


            hideFocusRing();


            return;

        }


        const movement =
            pointMovement(

                focusPointerStart,

                {
                    x:event.clientX,
                    y:event.clientY
                }

            );


        focusPointerStart =
            null;


        if(
            movement >
            CLICK_MOVE_LIMIT
        ){

            hideFocusRing();

            return;

        }


        await focusOnClickedModelPoint(
            event.clientX,
            event.clientY
        );

    }
);


mainModelViewer
?.addEventListener(
    "pointercancel",
    event => {

        activeViewerPointers.delete(
            event.pointerId
        );


        focusPointerStart =
            null;


        focusPointerMoved =
            false;


        hideFocusRing();

    }
);


/*
   Scroll mouse / trackpad berarti zoom manual.
*/

mainModelViewer
?.addEventListener(
    "wheel",
    () => {

        hideFocusRing();

    },
    {
        passive:true
    }
);


/*
   Click area menjadi pusat kamera,
   kemudian kamera sedikit diperbesar.
*/

async function focusOnClickedModelPoint(
    clientX,
    clientY
){

    if(
        !mainModelViewer
    ){

        return;

    }


    let hit =
        null;


    try{

        if(
            typeof
            mainModelViewer
            .positionAndNormalFromPoint
            ===
            "function"
        ){

            hit =
                mainModelViewer
                .positionAndNormalFromPoint(

                    clientX,

                    clientY

                );

        }

    }

    catch(error){

        console.warn(
            "Titik model tidak dapat dibaca.",
            error
        );

    }


    /*
       Lingkaran hanya muncul jika user
       benar-benar mengklik permukaan model.
    */

    if(
        !hit?.position
    ){

        hideFocusRing();

        return;

    }


    const position =
        hit.position;


    mainModelViewer.cameraTarget =
        `${
            position.x
        }m ${
            position.y
        }m ${
            position.z
        }m`;


    try{

        const orbit =
            mainModelViewer
            .getCameraOrbit();


        if(
            orbit
            &&
            Number.isFinite(
                orbit.radius
            )
        ){

            const newRadius =
                Math.max(

                    orbit.radius *
                    0.55,

                    0.08

                );


            mainModelViewer.cameraOrbit =
                `${
                    orbit.theta
                }rad ${
                    orbit.phi
                }rad ${
                    newRadius
                }m`;

        }

    }

    catch(error){

        console.warn(
            "Zoom fokus tidak dapat diterapkan.",
            error
        );

    }


    mainModelViewer.fieldOfView =
        "18deg";


    showFocusRingAt(
        clientX,
        clientY
    );

}


/* =========================================================
   RESET CAMERA
========================================================= */

on(
    "resetCamera",
    "click",
    () => {

        if(
            !mainModelViewer
        ){

            return;

        }


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
   AR
========================================================= */

on(
    "prepareMainAR",
    "click",
    () => {

        const {
            building,
            model
        } =
        resolveSelectedModel(

            "arBuildingSelect",

            "arVariantSelect"

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


        if(!model){

            text(
                "arMessage",
                "Model AR belum tersedia."
            );


            hide(
                "arCard"
            );


            return;

        }


        const viewer =
            byId(
                "mainARViewer"
            );


        if(viewer){

            viewer.setAttribute(
                "src",
                model.src
            );


            viewer.setAttribute(
                "alt",
                model.label
            );

        }


        text(
            "mainARStatus",
            building.name
        );


        text(
            "arModeBadge",
            model.name
        );


        text(
            "arMessage",
            ""
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
            typeof
            viewer.activateAR
            !==
            "function"
        ){

            toast(
                "AR belum dapat dibuka pada browser ini."
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
   ROUTING
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
    epsilon = .5
){

    return (
        pointDistance(
            a,
            b
        )
        <=
        epsilon
    );

}


const routingEdges =
    routeEdges.map(
        edge => {

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


                cumulative.push(
                    total
                );

            }


            return {

                ...edge,

                points,

                cumulative,

                length:
                    total

            };

        }
    );


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


Object.keys(
    routeNodes
)
.forEach(
    id => {

        routeGraph[id] =
            [];

    }
);


routingEdges.forEach(
    edge => {

        routeGraph[
            edge.from
        ]
        ?.push({

            node:
                edge.to,

            edgeId:
                edge.id,

            weight:
                edge.length

        });


        routeGraph[
            edge.to
        ]
        ?.push({

            node:
                edge.from,

            edgeId:
                edge.id,

            weight:
                edge.length

        });

    }
);


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
        lengthSquared
        ?
        (
            apX * abX
            +
            apY * abY
        )
        /
        lengthSquared
        :
        0;


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


    routingEdges.forEach(
        edge => {

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

                        point:
                            projection.point,

                        distance:
                            projection.distance,

                        along,

                        distanceToFrom:
                            along,

                        distanceToTo:
                            edge.length
                            -
                            along

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
            Object.keys(
                routeNodes
            )
        );


    Object.keys(
        routeNodes
    )
    .forEach(
        id => {

            distances[id] =
                Infinity;


            previousNode[id] =
                null;


            previousEdge[id] =
                null;

        }
    );


    distances[
        startNode
    ] = 0;


    while(
        unvisited.size
    ){

        let current =
            null;


        let smallest =
            Infinity;


        unvisited.forEach(
            id => {

                if(
                    distances[id]
                    <
                    smallest
                ){

                    smallest =
                        distances[id];


                    current =
                        id;

                }

            }
        );


        if(
            current === null
        ){

            break;

        }


        if(
            current === targetNode
        ){

            break;

        }


        unvisited.delete(
            current
        );


        routeGraph[
            current
        ]
        .forEach(
            connection => {

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
                    ] =
                        candidate;


                    previousNode[
                        connection.node
                    ] =
                        current;


                    previousEdge[
                        connection.node
                    ] =
                        connection.edgeId;

                }

            }
        );

    }


    if(
        !Number.isFinite(
            distances[
                targetNode
            ]
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


    return {

        distance:
            distances[
                targetNode
            ],

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


    points.forEach(
        point => {

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

        }
    );


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
            let j =
                i - 1;

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
            let j =
                i + 2;

            j < points.length;

            j++
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
            let i =
                startSnap.segmentIndex + 1;

            i <=
                targetSnap.segmentIndex;

            i++
        ){

            result.push(
                edge.points[i]
            );

        }

    }

    else{

        for(
            let i =
                startSnap.segmentIndex;

            i >
                targetSnap.segmentIndex;

            i--
        ){

            result.push(
                edge.points[i]
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

    const output =
        [];


    if(!result){

        return output;

    }


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


                const from =
                    result.nodePath[
                        index
                    ];


                let points =
                    edge.from ===
                    from
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


    [
        startSnap.edge.from,
        startSnap.edge.to
    ]
    .forEach(
        startNode => {

            [
                targetSnap.edge.from,
                targetSnap.edge.to
            ]
            .forEach(
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


                    candidates.push({

                        distance:
                            startDistance
                            +
                            middle.distance
                            +
                            targetDistance,

                        points:
                            dedupePolyline([

                                ...snapToEndpointPolyline(
                                    startSnap,
                                    startNode
                                ),

                                ...middlePolyline(
                                    middle
                                ),

                                ...endpointToSnapPolyline(
                                    targetSnap,
                                    targetNode
                                )

                            ])

                    });

                }
            );

        }
    );


    return candidates

        .sort(
            (a,b) =>
                a.distance
                -
                b.distance
        )[0]

        ||

        null;

}


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
        .forEach(
            entrance => {

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


                const candidate = {

                    entrance,

                    startSnap,

                    targetSnap,

                    distance:
                        networkRoute.distance,

                    points:
                        dedupePolyline([

                            startSnap.point,

                            ...networkRoute.points,

                            targetSnap.point,

                            entrance

                        ])

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

            }
        );


    return best;

}


/* =========================================================
   NAVIGATION
========================================================= */

function getDestinationBuilding(){

    return state.destination

        ?

        getBuildingById(
            state.destination
                .buildingId
        )

        :

        null;

}


function destinationDisplayName(){

    return state.destination?.name

        ||

        "tujuan pilihan Anda";

}


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


function updateProgress(stage){

    [
        "stepTarget",
        "stepPosition",
        "stepRoute",
        "stepAR"
    ]
    .forEach(
        (id,index) => {

            byId(id)
                ?.classList
                .toggle(

                    "active",

                    index <= stage

                );

        }
    );

}


function setNavigationInstruction(){

    text(

        "mapHeadingTitle",

        `Tap pada denah sesuai posisi Anda sekarang, lalu sistem akan memberikan jalur terdekat menuju ${destinationDisplayName()}.`

    );


    show(
        "mapInstructionArea"
    );

}


function clearRouteOnly(){

    state.routeResult =
        null;


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


    hide(
        "routeFoundBox"
    );


    setNavigationInstruction();

}


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


function selectNavigationDestination(
    location
){

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


    updateProgress(1);

}


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

}


const navigationSearch =
    byId(
        "navigationSearch"
    );


navigationSearch
?.addEventListener(
    "input",
    event => {

        const container =
            byId(
                "navigationSearchResults"
            );


        if(
            !container
        ){

            return;

        }


        if(
            !event.target.value
        ){

            container.innerHTML = `

                <div class="search-empty">
                    Ketik nama gedung atau ruangan tujuan.
                </div>

            `;


            return;

        }


        renderSearchResults(

            searchLocations(
                event.target.value
            ),

            container,

            selectNavigationDestination

        );

    }
);


/* =========================================================
   MAP CLICK
========================================================= */

byId(
    "navigationMap"
)
?.addEventListener(
    "click",
    event => {

        const map =
            byId(
                "navigationMap"
            );


        const building =
            getDestinationBuilding();


        if(
            !map
            ||
            !building
        ){

            return;

        }


        const rect =
            map.getBoundingClientRect();


        const clicked = {

            x:
                (
                    event.clientX
                    -
                    rect.left
                )
                /
                rect.width
                *
                MAP_WIDTH,

            y:
                (
                    event.clientY
                    -
                    rect.top
                )
                /
                rect.height
                *
                MAP_HEIGHT

        };


        const result =
            findBestEntranceRoute(
                clicked,
                building
            );


        if(!result){

            toast(
                "Rute tidak ditemukan."
            );


            return;

        }


        state.routeResult =
            result;


        setElementPosition(

            byId(
                "userMarker"
            ),

            result.startSnap.point

        );


        setElementPosition(

            byId(
                "entranceMarker"
            ),

            result.entrance

        );


        text(

            "entranceLabel",

            `Entrance ${building.shortName}`

        );


        show(
            "userMarker"
        );


        show(
            "entranceMarker"
        );


        byId(
            "activeRoute"
        )
        ?.setAttribute(

            "points",

            result.points
                .map(
                    point =>
                        `${point.x},${point.y}`
                )
                .join(" ")

        );


        hide(
            "mapInstructionArea"
        );


        show(
            "routeFoundBox"
        );


        updateProgress(2);

    }
);


/* =========================================================
   AR NAVIGATION
========================================================= */

async function startNavigationCamera(){

    const video =
        byId(
            "navigationCamera"
        );


    if(
        !navigator.mediaDevices
        ?.getUserMedia
    ){

        text(
            "cameraStatus",
            "Browser tidak mendukung kamera."
        );


        return;

    }


    try{

        state.cameraStream =

            await navigator
                .mediaDevices
                .getUserMedia({

                    video:{

                        facingMode:{
                            ideal:
                                "environment"
                        }

                    },

                    audio:false

                });


        video.srcObject =
            state.cameraStream;


        await video.play();


        text(
            "cameraStatus",
            "Kamera aktif."
        );

    }

    catch(error){

        console.error(
            error
        );


        text(
            "cameraStatus",
            "Izin kamera gagal."
        );

    }

}


function stopNavigationCamera(){

    state.cameraStream
        ?.getTracks()
        .forEach(
            track =>
                track.stop()
        );


    state.cameraStream =
        null;


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

            return;

        }


        text(
            "arNavigationTitle",
            state.destination.name
        );


        text(
            "arNavigationDestination",
            state.destination.name
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

        goBack();

    }
);


/* =========================================================
   DIRECTORY
========================================================= */

function renderRoomList(
    roomList,
    container
){

    if(
        !container
    ){

        return;

    }


    container.innerHTML =
        "";


    if(
        !roomList.length
    ){

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


    roomList.forEach(
        room => {

            const location =
                locations.find(
                    item =>
                        item.id ===
                        room.id
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


            const actions =
                item.querySelector(
                    ".room-actions"
                );


            item.querySelector(
                ".room-row button"
            )
            ?.addEventListener(
                "click",
                () => {

                    actions
                        ?.classList
                        .toggle(
                            "hidden"
                        );

                }
            );


            item.querySelector(
                ".room-info-button"
            )
            ?.addEventListener(
                "click",
                () =>
                    openInfo(
                        location
                    )
            );


            item.querySelector(
                ".room-nav-button"
            )
            ?.addEventListener(
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
    roomList,
    container
){

    const buttons =
        document.createElement(
            "div"
        );


    buttons.className =
        "floor-buttons";


    const roomsArea =
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

                        buttons
                            .querySelectorAll(
                                ".floor-button"
                            )
                            .forEach(
                                item =>
                                    item
                                        .classList
                                        .remove(
                                            "active"
                                        )
                            );


                        button.classList.add(
                            "active"
                        );


                        renderRoomList(

                            roomList.filter(
                                room =>
                                    room.floor ===
                                    floor
                            ),

                            roomsArea

                        );

                    }
                );


                buttons.appendChild(
                    button
                );

            }
        );


    container.append(
        buttons,
        roomsArea
    );


    buttons
        .firstElementChild
        ?.click();

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


            article
                .querySelector(
                    ".building-button"
                )
                ?.addEventListener(
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
   FEATURE BUTTONS
========================================================= */

[
    "menu3D",
    "feature3D",
    "hero3DButton"
]
.forEach(
    id => {

        on(
            id,
            "click",
            () =>
                showPage(
                    "viewer"
                )
        );

    }
);


[
    "menuAR",
    "featureAR",
    "heroARButton"
]
.forEach(
    id => {

        on(
            id,
            "click",
            () =>
                showPage(
                    "ar"
                )
        );

    }
);


[
    "menuNavigation",
    "featureNav",
    "heroNavigationButton"
]
.forEach(
    id => {

        on(
            id,
            "click",
            () =>
                openNavigationWithDestination()
        );

    }
);


[
    "menuDirectory",
    "featureDirectory",
    "heroDirectoryButton"
]
.forEach(
    id => {

        on(
            id,
            "click",
            () =>
                showPage(
                    "directory"
                )
        );

    }
);


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
            3000
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

            return;

        }


        if(
            state.currentPage !==
            "home"
        ){

            goBack();

        }

    }
);


/* =========================================================
   SAFARI / MOBILE PAGE RESTORE
========================================================= */

window.addEventListener(
    "pageshow",
    () => {

        if(
            !document.querySelector(
                ".page.active"
            )
        ){

            byId(
                "homePage"
            )
            ?.classList
            .add(
                "active"
            );


            state.currentPage =
                "home";

        }

    }
);
