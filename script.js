/* =========================================================
   FT UISU EXPLORER
   SCRIPT
   REVISION 31

   IMPORTANT:
   - Tidak menggunakan import.
   - Error satu fitur tidak boleh mematikan
     seluruh button website.
========================================================= */

(function(){

"use strict";



/* =========================================================
   SAFE DATA
========================================================= */

const DATA =
    window.FT_DATA || {};


const MAP_WIDTH =
    DATA.MAP_WIDTH || 768;


const MAP_HEIGHT =
    DATA.MAP_HEIGHT || 1024;


const buildings =
    Array.isArray(DATA.buildings)
    ?
    DATA.buildings
    :
    [];


const rooms =
    Array.isArray(DATA.rooms)
    ?
    DATA.rooms
    :
    [];


const people =
    Array.isArray(DATA.people)
    ?
    DATA.people
    :
    [];


const entrances =
    Array.isArray(DATA.entrances)
    ?
    DATA.entrances
    :
    [];


const mapNodes =
    DATA.mapNodes || {};


const mapEdges =
    Array.isArray(DATA.mapEdges)
    ?
    DATA.mapEdges
    :
    [];


const mapCalibration =
    Array.isArray(DATA.mapCalibration)
    ?
    DATA.mapCalibration
    :
    [];



/* =========================================================
   DOM HELPERS
========================================================= */

function byId(id){

    return document.getElementById(id);
}



function all(selector){

    return Array.from(
        document.querySelectorAll(
            selector
        )
    );
}



/*
   Listener aman.

   Kalau satu ID tidak ada,
   script TIDAK berhenti.
*/

function on(
    id,
    eventName,
    handler,
    options
){

    const element =
        byId(id);


    if(!element){

        console.warn(
            "Element tidak ditemukan:",
            id
        );

        return;
    }


    element.addEventListener(
        eventName,
        handler,
        options
    );
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



function setText(
    id,
    value
){

    const element =
        byId(id);


    if(element){

        element.textContent =
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

    globalSelection:
        null,

    infoLocation:
        null,

    destination:
        null,

    clickedPosition:
        null,

    routeResult:
        null,

    liveInstructions:
        [],

    gpsWatchId:
        null,

    modelPointerStart:
        null,

    modelPointerMoved:
        false

};



/* =========================================================
   DATA HELPERS
========================================================= */

function getBuildingById(id){

    if(
        typeof DATA.getBuildingById
        ===
        "function"
    ){

        return DATA.getBuildingById(id);
    }


    return (
        buildings.find(
            building =>
                building.id === id
        )
        ||
        null
    );
}



function getEntranceById(id){

    if(
        typeof DATA.getEntranceById
        ===
        "function"
    ){

        return DATA.getEntranceById(id);
    }


    return (
        entrances.find(
            entrance =>
                entrance.id === id
        )
        ||
        null
    );
}



function getBuildingModels(buildingId){

    if(
        typeof DATA.getBuildingModels
        ===
        "function"
    ){

        return DATA.getBuildingModels(
            buildingId
        );
    }


    const building =
        getBuildingById(
            buildingId
        );


    return (
        building
        ?
        building.models || []
        :
        []
    );
}



function getModelVariant(
    buildingId,
    modelId
){

    if(
        typeof DATA.getModelVariant
        ===
        "function"
    ){

        return DATA.getModelVariant(
            buildingId,
            modelId
        );
    }


    return (
        getBuildingModels(
            buildingId
        ).find(
            model =>
                model.id === modelId
        )
        ||
        null
    );
}



function getDefaultModelVariant(
    buildingId
){

    if(
        typeof DATA.getDefaultModelVariant
        ===
        "function"
    ){

        return DATA.getDefaultModelVariant(
            buildingId
        );
    }


    const building =
        getBuildingById(
            buildingId
        );


    if(!building){

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



function getNavigationEntrance(
    location
){

    if(
        typeof
        DATA.getNavigationEntranceForLocation
        ===
        "function"
    ){

        return DATA
            .getNavigationEntranceForLocation(
                location
            );
    }


    if(!location){

        return null;
    }


    if(
        location.type === "room"
        &&
        location.navigationEntranceId
    ){

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


    if(!building){

        return null;
    }


    return getEntranceById(
        building.defaultEntranceId
    );
}



/* =========================================================
   LOCATION SEARCH DATABASE
========================================================= */

const locations = [];



/* BUILDINGS */

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

            floor:
                building.actualFloor,

            parent:
                "Fakultas Teknik UISU",

            description:
                building.description,

            navigationEntranceId:
                building.defaultEntranceId,

            modelMarker:
                null
        });
    }
);



/* ROOMS */

rooms.forEach(
    room => {

        const building =
            getBuildingById(
                room.buildingId
            );


        locations.push({

            id:
                room.id,

            type:
                "room",

            name:
                room.name,

            buildingId:
                room.buildingId,

            floor:
                room.floor,

            parent:
                building
                ?
                building.name
                :
                "Fakultas Teknik UISU",

            navigationEntranceId:
                room.navigationEntranceId,

            modelMarker:
                room.modelMarker || null,

            description:
                room.name
                +
                " berada di "
                +
                (
                    building
                    ?
                    building.name
                    :
                    "Fakultas Teknik UISU"
                )
                +
                ", lantai "
                +
                room.floor
                +
                "."
        });
    }
);



/* PEOPLE */

people.forEach(
    person => {

        locations.push({

            ...person,

            type:"person"
        });
    }
);



/* =========================================================
   PAGE SYSTEM
========================================================= */

function updateHeaderActive(
    pageName
){

    all(".header-link")
    .forEach(
        button => {

            button.classList.remove(
                "active"
            );
        }
    );


    const matching =
        document.querySelector(
            '.header-link[data-page="'
            +
            pageName
            +
            '"]'
        );


    if(matching){

        matching.classList.add(
            "active"
        );
    }
    else if(pageName === "home"){

        const home =
            document.querySelector(
                '.header-link[data-page="home"]'
            );


        if(home){

            home.classList.add(
                "active"
            );
        }
    }
}



function showPage(
    pageName,
    pushHistory = true
){

    const nextPage =
        byId(
            pageName + "Page"
        );


    if(!nextPage){

        console.warn(
            "Page tidak ditemukan:",
            pageName
        );

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


    all(".page")
    .forEach(
        page => {

            page.classList.remove(
                "active"
            );
        }
    );


    nextPage.classList.add(
        "active"
    );


    state.currentPage =
        pageName;


    updateHeaderActive(
        pageName
    );


    closeDrawer();


    if(
        pageName !==
        "navigationActive"
    ){

        window.scrollTo({
            top:0,
            behavior:"instant"
        });
    }
}



function goBack(){

    stopGpsTracking();


    const previous =
        state.pageHistory.length
        ?
        state.pageHistory.pop()
        :
        "home";


    showPage(
        previous,
        false
    );
}



/* BACK BUTTONS */

all("[data-back]")
.forEach(
    button => {

        button.addEventListener(
            "click",
            goBack
        );
    }
);



/* HEADER */

on(
    "logoHome",
    "click",
    () => {

        stopGpsTracking();

        state.pageHistory = [];

        showPage(
            "home",
            false
        );
    }
);



all("[data-page]")
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
   DRAWER
========================================================= */

function openDrawer(){

    const drawer =
        byId("drawer");


    const overlay =
        byId("drawerOverlay");


    if(drawer){

        drawer.classList.add(
            "open"
        );
    }


    if(overlay){

        overlay.classList.add(
            "show"
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


    if(drawer){

        drawer.classList.remove(
            "open"
        );
    }


    if(overlay){

        overlay.classList.remove(
            "show"
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
   HOME SLIDER
   TIDAK OTOMATIS
========================================================= */

const slides =
    all(".hero-slide");



function showSlide(index){

    if(!slides.length){

        return;
    }


    if(index < 0){

        index =
            slides.length - 1;
    }


    if(index >= slides.length){

        index = 0;
    }


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


    all(".slider-dot")
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
    "prevSlide",
    "click",
    () => {

        showSlide(
            state.currentSlide - 1
        );
    }
);



on(
    "nextSlide",
    "click",
    () => {

        showSlide(
            state.currentSlide + 1
        );
    }
);



all(".slider-dot")
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
   SLIDER 1 - 3 MODEL
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

    if(!landingModels.length){

        return;
    }


    if(index < 0){

        index =
            landingModels.length - 1;
    }


    if(index >= landingModels.length){

        index = 0;
    }


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
    }


    setText(
        "landingModelName",
        model.name
    );


    setText(
        "landingModelCounter",
        `${index + 1} / ${landingModels.length}`
    );
}



on(
    "landingNextModel",
    "click",
    () => {

        showLandingModel(
            state.landingModelIndex + 1
        );
    }
);



/* =========================================================
   SEARCH FUNCTIONS
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
            location => {

                return normalize(
                    location.name
                    +
                    " "
                    +
                    (
                        location.parent
                        ||
                        ""
                    )
                )
                .includes(query);
            }
        )
        .slice(
            0,
            40
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

        container.innerHTML =
            `
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


            let typeText =
                "Ruangan";


            if(location.type === "building"){

                typeText =
                    "Gedung";
            }
            else if(location.type === "person"){

                typeText =
                    "Civitas";
            }


            button.innerHTML =
                `
                <span>

                    <strong>
                        ${location.name}
                    </strong>

                    <small>
                        ${location.parent || "Fakultas Teknik UISU"}
                        ${
                            location.floor
                            ?
                            " • Lantai " + location.floor
                            :
                            ""
                        }
                    </small>

                </span>

                <span class="search-type">
                    ${typeText}
                </span>
                `;


            button.addEventListener(
                "click",
                () => {

                    onSelect(
                        location
                    );
                }
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



if(globalSearch){

    globalSearch.addEventListener(
        "input",
        event => {

            const value =
                event.target.value;


            if(!value.trim()){

                hide(
                    "globalSearchResults"
                );

                return;
            }


            renderSearchResults(

                searchLocations(
                    value
                ),

                byId(
                    "globalSearchResults"
                ),

                location => {

                    state.globalSelection =
                        location;


                    globalSearch.value =
                        location.name;


                    setText(
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

    if(!location){

        return;
    }


    state.infoLocation =
        location;


    setText(
        "infoTitle",
        location.name
    );


    setText(
        "infoParent",
        location.parent
        ||
        "Fakultas Teknik UISU"
    );


    setText(
        "infoDescription",
        location.description
        ||
        "Informasi belum tersedia."
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

        openInfo(
            state.globalSelection
        );
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
    select
){

    if(!select){

        return;
    }


    select.innerHTML =
        `
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



const viewerBuildingSelect =
    byId(
        "viewerBuildingSelect"
    );


const arBuildingSelect =
    byId(
        "arBuildingSelect"
    );


populateBuildingSelect(
    viewerBuildingSelect
);


populateBuildingSelect(
    arBuildingSelect
);



function configureVariants(
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


    if(models.length > 1){

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



if(viewerBuildingSelect){

    viewerBuildingSelect
    .addEventListener(
        "change",
        () => {

            configureVariants(

                viewerBuildingSelect.value,

                "viewerVariantWrap",

                "viewerVariantSelect"
            );
        }
    );
}



if(arBuildingSelect){

    arBuildingSelect
    .addEventListener(
        "change",
        () => {

            configureVariants(

                arBuildingSelect.value,

                "arVariantWrap",

                "arVariantSelect"
            );
        }
    );
}



/* =========================================================
   MAIN 3D VIEWER
========================================================= */

const mainModelViewer =
    byId(
        "mainModelViewer"
    );



function display3DModel(
    buildingId,
    variantId
){

    const building =
        getBuildingById(
            buildingId
        );


    if(!building){

        setText(
            "viewerMessage",
            "Gedung belum ditemukan di database."
        );

        return;
    }


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

        setText(
            "viewerMessage",
            "Model 3D belum tersedia."
        );

        return;
    }


    if(mainModelViewer){

        mainModelViewer.setAttribute(
            "src",
            model.src
        );
    }


    setText(
        "viewerTitle",
        building.name
    );


    setText(
        "viewerModeBadge",
        model.name
    );


    setText(
        "viewerModelDescription",
        model.viewerDescription
    );


    setText(
        "viewerMessage",
        ""
    );


    show(
        "viewerCard"
    );
}



on(
    "show3DModel",
    "click",
    () => {

        const buildingId =
            viewerBuildingSelect
            ?
            viewerBuildingSelect.value
            :
            "";


        if(!buildingId){

            setText(
                "viewerMessage",
                "Pilih gedung terlebih dahulu."
            );

            return;
        }


        const variantSelect =
            byId(
                "viewerVariantSelect"
            );


        display3DModel(

            buildingId,

            variantSelect
            ?
            variantSelect.value
            :
            ""
        );
    }
);



/* =========================================================
   MODEL CLICK FOCUS
========================================================= */

const focusRing =
    byId(
        "modelFocusRing"
    );



function hideFocusRing(){

    if(!focusRing){

        return;
    }


    focusRing.classList.remove(
        "focus-visible"
    );


    focusRing.classList.add(
        "hidden"
    );
}



if(mainModelViewer){

    mainModelViewer.addEventListener(
        "pointerdown",
        event => {

            hideFocusRing();


            state.modelPointerStart = {

                x:event.clientX,

                y:event.clientY
            };


            state.modelPointerMoved =
                false;
        }
    );


    mainModelViewer.addEventListener(
        "pointermove",
        event => {

            if(
                !state.modelPointerStart
            ){

                return;
            }


            const movement =
                Math.hypot(

                    event.clientX
                    -
                    state.modelPointerStart.x,

                    event.clientY
                    -
                    state.modelPointerStart.y
                );


            if(movement > 8){

                state.modelPointerMoved =
                    true;


                hideFocusRing();
            }
        }
    );


    mainModelViewer.addEventListener(
        "wheel",
        hideFocusRing,
        {
            passive:true
        }
    );


    mainModelViewer.addEventListener(
        "pointerup",
        event => {

            if(
                !state.modelPointerStart
                ||
                state.modelPointerMoved
            ){

                state.modelPointerStart =
                    null;

                return;
            }


            const stage =
                byId(
                    "modelViewerStage"
                );


            if(
                !stage
                ||
                !focusRing
            ){

                state.modelPointerStart =
                    null;

                return;
            }


            const rect =
                stage.getBoundingClientRect();


            const localX =
                event.clientX
                -
                rect.left;


            const localY =
                event.clientY
                -
                rect.top;


            focusRing.style.left =
                localX + "px";


            focusRing.style.top =
                localY + "px";


            focusRing.classList.remove(
                "hidden"
            );


            requestAnimationFrame(
                () => {

                    focusRing.classList.add(
                        "focus-visible"
                    );
                }
            );


            /*
               Zoom ke titik klik jika API tersedia.
            */

            if(
                typeof
                mainModelViewer
                    .positionAndNormalFromPoint
                ===
                "function"
            ){

                try{

                    const hit =
                        mainModelViewer
                            .positionAndNormalFromPoint(
                                localX,
                                localY
                            );


                    if(
                        hit
                        &&
                        hit.position
                    ){

                        mainModelViewer.cameraTarget =
                            `${hit.position.x}m ${hit.position.y}m ${hit.position.z}m`;


                        if(
                            typeof
                            mainModelViewer
                                .getCameraOrbit
                            ===
                            "function"
                        ){

                            const orbit =
                                mainModelViewer
                                    .getCameraOrbit();


                            if(orbit){

                                mainModelViewer.cameraOrbit =
                                    `${orbit.theta}rad ${orbit.phi}rad ${Math.max(orbit.radius * .57,.08)}m`;
                            }
                        }
                    }
                }
                catch(error){

                    console.warn(
                        "3D focus:",
                        error
                    );
                }
            }


            state.modelPointerStart =
                null;
        }
    );
}



on(
    "resetCamera",
    "click",
    () => {

        hideFocusRing();


        if(!mainModelViewer){

            return;
        }


        mainModelViewer.cameraOrbit =
            "auto auto auto";


        mainModelViewer.cameraTarget =
            "auto auto auto";
    }
);



/* =========================================================
   AR MARKERLESS
========================================================= */

on(
    "prepareMainAR",
    "click",
    () => {

        if(!arBuildingSelect){

            return;
        }


        const buildingId =
            arBuildingSelect.value;


        if(!buildingId){

            setText(
                "arMessage",
                "Pilih gedung terlebih dahulu."
            );

            return;
        }


        const variantSelect =
            byId(
                "arVariantSelect"
            );


        const model =
            getModelVariant(
                buildingId,
                variantSelect
                ?
                variantSelect.value
                :
                ""
            )
            ||
            getDefaultModelVariant(
                buildingId
            );


        if(!model){

            setText(
                "arMessage",
                "Model AR belum tersedia."
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
        }


        setText(
            "arMessage",
            ""
        );


        show(
            "arViewerCard"
        );
    }
);



/* =========================================================
   DIRECTORY
========================================================= */

function locationForBuilding(
    building
){

    return (
        locations.find(
            location =>
                location.type === "building"
                &&
                location.id === building.id
        )
        ||
        null
    );
}



function locationForRoom(
    room
){

    return (
        locations.find(
            location =>
                location.type === "room"
                &&
                location.id === room.id
        )
        ||
        null
    );
}



function renderRoomList(
    roomList,
    container
){

    container.innerHTML =
        "";


    if(!roomList.length){

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

            const location =
                locationForRoom(
                    room
                );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "room-item";


            item.innerHTML =
                `
                <div class="room-row">

                    <span>
                        ${room.name}
                    </span>

                    <button
                        type="button"
                        class="room-select-button">
                        Pilih
                    </button>

                </div>

                <div class="room-actions hidden">

                    <button
                        type="button"
                        class="room-info">
                        Informasi
                    </button>

                    <button
                        type="button"
                        class="room-nav">
                        Petunjuk Arah
                    </button>

                </div>
                `;


            const actions =
                item.querySelector(
                    ".room-actions"
                );


            const choose =
                item.querySelector(
                    ".room-select-button"
                );


            choose.addEventListener(
                "click",
                () => {

                    actions.classList.toggle(
                        "hidden"
                    );
                }
            );


            item
            .querySelector(
                ".room-info"
            )
            .addEventListener(
                "click",
                () => {

                    openInfo(
                        location
                    );
                }
            );


            item
            .querySelector(
                ".room-nav"
            )
            .addEventListener(
                "click",
                () => {

                    openNavigationWithDestination(
                        location
                    );
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



function renderLaboratory(
    roomList,
    container
){

    const floorButtons =
        document.createElement(
            "div"
        );


    floorButtons.className =
        "floor-buttons";


    const roomContainer =
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

                    Array.from(
                        floorButtons.children
                    )
                    .forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    renderRoomList(

                        roomList.filter(
                            room =>
                                room.floor === floor
                        ),

                        roomContainer
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
        roomContainer
    );


    if(
        floorButtons.firstElementChild
    ){

        floorButtons
        .firstElementChild
        .click();
    }
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
                        room.buildingId
                        ===
                        building.id
                );


            const location =
                locationForBuilding(
                    building
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

                    <span class="building-number">
                        ${String(index + 1).padStart(2,"0")}
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



            /* ACTIONS */

            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "building-actions";


            actions.innerHTML =
                `
                <button
                    class="button button-primary building-info"
                    type="button">
                    Informasi
                </button>

                <button
                    class="button button-primary building-nav"
                    type="button">
                    Petunjuk Arah
                </button>
                `;


            content.appendChild(
                actions
            );


            actions
            .querySelector(
                ".building-info"
            )
            .addEventListener(
                "click",
                () => {

                    openInfo(
                        location
                    );
                }
            );


            actions
            .querySelector(
                ".building-nav"
            )
            .addEventListener(
                "click",
                () => {

                    openNavigationWithDestination(
                        location
                    );
                }
            );


            const roomHolder =
                document.createElement(
                    "div"
                );


            content.appendChild(
                roomHolder
            );


            if(
                building.id
                ===
                "laboratorium-ft"
            ){

                renderLaboratory(
                    buildingRooms,
                    roomHolder
                );
            }
            else{

                renderRoomList(
                    buildingRooms,
                    roomHolder
                );
            }


            container.appendChild(
                article
            );
        }
    );
}



/* =========================================================
   NAVIGATION RESET
========================================================= */

function setStep(stepNumber){

    const ids = [

        "stepTarget",

        "stepPosition",

        "stepRoute",

        "stepNavigation"

    ];


    ids.forEach(
        (id,index) => {

            const element =
                byId(id);


            if(!element){

                return;
            }


            element.classList.toggle(
                "active",
                index + 1 <= stepNumber
            );
        }
    );
}



function resetNavigation(){

    stopGpsTracking();


    state.destination =
        null;


    state.clickedPosition =
        null;


    state.routeResult =
        null;


    const search =
        byId(
            "navigationSearch"
        );


    if(search){

        search.value =
            "";
    }


    const route =
        byId(
            "activeRoute"
        );


    if(route){

        route.setAttribute(
            "points",
            ""
        );
    }


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


    hide(
        "resetPosition"
    );


    show(
        "mapInstructionArea"
    );


    setStep(1);


    const results =
        byId(
            "navigationSearchResults"
        );


    if(results){

        results.innerHTML =
            `
            <div class="search-empty">
                Ketik nama gedung atau ruangan tujuan.
            </div>
            `;
    }
}



/* =========================================================
   SELECT DESTINATION
========================================================= */

function selectDestination(
    location
){

    if(!location){

        return;
    }


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


    setText(
        "selectedDestinationName",
        location.name
    );


    setText(
        "selectedDestinationParent",
        location.parent
        ||
        "Fakultas Teknik UISU"
    );


    show(
        "selectedDestination"
    );


    const results =
        byId(
            "navigationSearchResults"
        );


    if(results){

        results.innerHTML =
            "";
    }


    setText(

        "mapHeadingTitle",

        `Tap pada denah sesuai posisi Anda sekarang, lalu sistem akan memberikan jalur terdekat menuju ${location.name}.`
    );


    show(
        "mapInstructionArea"
    );


    show(
        "mapSection"
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


    hide(
        "resetPosition"
    );


    const route =
        byId(
            "activeRoute"
        );


    if(route){

        route.setAttribute(
            "points",
            ""
        );
    }


    setStep(2);


    setTimeout(
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
        100
    );
}



/* NAVIGATION SEARCH */

const navigationSearch =
    byId(
        "navigationSearch"
    );


if(navigationSearch){

    navigationSearch.addEventListener(
        "input",
        () => {

            const value =
                navigationSearch.value;


            const container =
                byId(
                    "navigationSearchResults"
                );


            if(!value.trim()){

                container.innerHTML =
                    `
                    <div class="search-empty">
                        Ketik nama gedung atau ruangan tujuan.
                    </div>
                    `;

                return;
            }


            renderSearchResults(

                searchLocations(
                    value
                ),

                container,

                selectDestination
            );
        }
    );
}



/* =========================================================
   GRAPH PREPARATION
========================================================= */

function pointDistance(
    a,
    b
){

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
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
                    point => ({

                        x:point[0],

                        y:point[1]
                    })
                );


            let length =
                0;


            const cumulative =
                [0];


            for(
                let i = 0;
                i < points.length - 1;
                i++
            ){

                length +=
                    pointDistance(
                        points[i],
                        points[i + 1]
                    );


                cumulative.push(
                    length
                );
            }


            return{

                id:edge.id,

                from:edge.from,

                to:edge.to,

                points,

                length,

                cumulative
            };
        }
    );



const edgeById = {};


preparedEdges.forEach(
    edge => {

        edgeById[
            edge.id
        ] = edge;


        if(!graph[edge.from]){

            graph[edge.from] =
                [];
        }


        if(!graph[edge.to]){

            graph[edge.to] =
                [];
        }


        graph[edge.from]
        .push({

            node:edge.to,

            edgeId:edge.id,

            weight:edge.length
        });


        graph[edge.to]
        .push({

            node:edge.from,

            edgeId:edge.id,

            weight:edge.length
        });
    }
);



/* =========================================================
   PROJECT CLICK TO SEGMENT
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
        (
            abX * abX
        )
        +
        (
            abY * abY
        );


    let t =
        lengthSquared
        ?
        (
            (
                apX * abX
            )
            +
            (
                apY * abY
            )
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
            a.x
            +
            abX * t,

        y:
            a.y
            +
            abY * t
    };


    return{

        point:projected,

        t,

        distance:
            pointDistance(
                point,
                projected
            )
    };
}



/* =========================================================
   SNAP KE JALUR TERDEKAT
========================================================= */

function snapToRoute(
    point
){

    let best =
        null;


    preparedEdges.forEach(
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
                    (
                        segmentLength
                        *
                        projection.t
                    );


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
    start,
    target
){

    const nodeIds =
        Object.keys(
            graph
        );


    if(
        !nodeIds.includes(start)
        ||
        !nodeIds.includes(target)
    ){

        return null;
    }


    const distances = {};

    const previous = {};

    const previousEdge = {};


    nodeIds.forEach(
        id => {

            distances[id] =
                Infinity;


            previous[id] =
                null;


            previousEdge[id] =
                null;
        }
    );


    distances[start] =
        0;


    const unvisited =
        new Set(
            nodeIds
        );


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
            ||
            smallest === Infinity
        ){

            break;
        }


        if(
            current === target
        ){

            break;
        }


        unvisited.delete(
            current
        );


        const connections =
            graph[current] || [];


        connections.forEach(
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


                    previous[
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
        distances[target]
        ===
        Infinity
    ){

        return null;
    }


    const nodes = [];

    const edges = [];


    let cursor =
        target;


    while(cursor){

        nodes.unshift(
            cursor
        );


        if(cursor === start){

            break;
        }


        edges.unshift(
            previousEdge[cursor]
        );


        cursor =
            previous[cursor];
    }


    return{

        distance:
            distances[target],

        nodes,

        edges
    };
}



/* =========================================================
   SNAP POINT → ENDPOINT POLYLINE
========================================================= */

function pointsFromSnapToEndpoint(
    snap,
    endpoint
){

    const points =
        snap.edge.points;


    const output = [

        {
            x:snap.point.x,
            y:snap.point.y
        }

    ];


    if(
        endpoint
        ===
        snap.edge.from
    ){

        output.push(
            points[
                snap.segmentIndex
            ]
        );


        for(
            let i =
                snap.segmentIndex - 1;

            i >= 0;

            i--
        ){

            output.push(
                points[i]
            );
        }
    }
    else{

        output.push(
            points[
                snap.segmentIndex + 1
            ]
        );


        for(
            let i =
                snap.segmentIndex + 2;

            i < points.length;

            i++
        ){

            output.push(
                points[i]
            );
        }
    }


    return output;
}



/* =========================================================
   GRAPH ROUTE → POLYLINE
========================================================= */

function routeNodePolyline(
    route
){

    const output = [];


    route.edges.forEach(
        (edgeId,index) => {

            const edge =
                edgeById[
                    edgeId
                ];


            if(!edge){

                return;
            }


            const fromNode =
                route.nodes[index];


            let points;


            if(
                edge.from
                ===
                fromNode
            ){

                points =
                    edge.points.slice();
            }
            else{

                points =
                    edge.points
                        .slice()
                        .reverse();
            }


            if(output.length){

                points =
                    points.slice(1);
            }


            output.push(
                ...points
            );
        }
    );


    return output;
}



function dedupePoints(
    points
){

    const output = [];


    points.forEach(
        point => {

            const previous =
                output[
                    output.length - 1
                ];


            if(
                !previous
                ||
                pointDistance(
                    previous,
                    point
                )
                >
                .5
            ){

                output.push(
                    point
                );
            }
        }
    );


    return output;
}



/* =========================================================
   ROUTE TERDEKAT
   Membandingkan DUA ARAH dari edge start.
========================================================= */

function buildRoute(
    clickedPoint
){

    if(!state.destination){

        return null;
    }


    const entrance =
        getNavigationEntrance(
            state.destination
        );


    if(!entrance){

        toast(
            "Entrance tujuan belum tersedia."
        );

        return null;
    }


    const snap =
        snapToRoute(
            clickedPoint
        );


    if(!snap){

        toast(
            "Jalur terdekat tidak ditemukan."
        );

        return null;
    }


    const fromRoute =
        dijkstra(
            snap.edge.from,
            entrance.nodeId
        );


    const toRoute =
        dijkstra(
            snap.edge.to,
            entrance.nodeId
        );


    const candidates =
        [];


    if(fromRoute){

        candidates.push({

            endpoint:
                snap.edge.from,

            route:
                fromRoute,

            cost:
                snap.distanceToFrom
                +
                fromRoute.distance
        });
    }


    if(toRoute){

        candidates.push({

            endpoint:
                snap.edge.to,

            route:
                toRoute,

            cost:
                snap.distanceToTo
                +
                toRoute.distance
        });
    }


    if(!candidates.length){

        return null;
    }


    candidates.sort(
        (a,b) =>
            a.cost - b.cost
    );


    const best =
        candidates[0];


    const startPart =
        pointsFromSnapToEndpoint(
            snap,
            best.endpoint
        );


    const graphPart =
        routeNodePolyline(
            best.route
        );


    const routePoints =
        dedupePoints(

            startPart
            .concat(
                graphPart
            )
            .concat([
                {
                    x:entrance.x,
                    y:entrance.y
                }
            ])
        );


    return{

        startSnap:
            snap,

        entrance,

        graphDistance:
            best.cost,

        points:
            routePoints
    };
}



/* =========================================================
   POSITION HTML ELEMENT ON MAP
========================================================= */

function positionMapElement(
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
        (
            point.x
            /
            MAP_WIDTH
            *
            100
        )
        +
        "%";


    element.style.top =
        (
            point.y
            /
            MAP_HEIGHT
            *
            100
        )
        +
        "%";
}



/* =========================================================
   MAP CLICK
========================================================= */

const navigationMap =
    byId(
        "navigationMap"
    );


if(navigationMap){

    navigationMap.addEventListener(
        "pointerdown",
        event => {

            if(
                !state.destination
            ){

                toast(
                    "Pilih tujuan terlebih dahulu."
                );

                return;
            }


            const rect =
                navigationMap
                    .getBoundingClientRect();


            const clickedPoint = {

                x:
                    (
                        (
                            event.clientX
                            -
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
                            event.clientY
                            -
                            rect.top
                        )
                        /
                        rect.height
                    )
                    *
                    MAP_HEIGHT
            };


            const route =
                buildRoute(
                    clickedPoint
                );


            if(!route){

                toast(
                    "Rute belum dapat ditemukan."
                );

                return;
            }


            state.clickedPosition =
                clickedPoint;


            state.routeResult =
                route;


            /* ROUTE */

            const polyline =
                byId(
                    "activeRoute"
                );


            if(polyline){

                polyline.setAttribute(

                    "points",

                    route.points
                    .map(
                        point =>
                            `${point.x},${point.y}`
                    )
                    .join(" ")
                );
            }


            /* USER MARKER = SNAP */

            positionMapElement(

                byId(
                    "userMarker"
                ),

                route.startSnap.point
            );


            show(
                "userMarker"
            );


            /* ENTRANCE TUJUAN */

            positionMapElement(

                byId(
                    "entranceMarker"
                ),

                route.entrance
            );


            show(
                "entranceMarker"
            );


            /*
               Setelah user memilih posisi:
               - semua tulisan atas map dihapus
               - route card pindah / tampil di atas map
            */

            hide(
                "mapInstructionArea"
            );


            show(
                "routeFoundBox"
            );


            show(
                "resetPosition"
            );


            setStep(3);
        }
    );
}



/* =========================================================
   RESET POSITION
========================================================= */

on(
    "resetPosition",
    "click",
    () => {

        state.clickedPosition =
            null;


        state.routeResult =
            null;


        const route =
            byId(
                "activeRoute"
            );


        if(route){

            route.setAttribute(
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


        hide(
            "resetPosition"
        );


        show(
            "mapInstructionArea"
        );


        setStep(2);
    }
);



/* =========================================================
   NAVIGATION INSTRUCTIONS
========================================================= */

function turnAngle(
    a,
    b,
    c
){

    const ax =
        b.x - a.x;


    const ay =
        b.y - a.y;


    const bx =
        c.x - b.x;


    const by =
        c.y - b.y;


    const cross =
        ax * by
        -
        ay * bx;


    const dot =
        ax * bx
        +
        ay * by;


    return (
        Math.atan2(
            cross,
            dot
        )
        *
        180
        /
        Math.PI
    );
}



function simplifyInstructionPoints(
    points
){

    if(
        !points
        ||
        points.length <= 2
    ){

        return (
            points
            ?
            points.slice()
            :
            []
        );
    }


    const output = [

        points[0]

    ];


    for(
        let i = 1;
        i < points.length - 1;
        i++
    ){

        const angle =
            turnAngle(

                points[i - 1],

                points[i],

                points[i + 1]
            );


        if(
            Math.abs(angle)
            >=
            28
        ){

            output.push(
                points[i]
            );
        }
    }


    output.push(
        points[
            points.length - 1
        ]
    );


    return output;
}



function createNavigationInstructions(){

    if(
        !state.routeResult
        ||
        !state.destination
    ){

        return [];
    }


    const route =
        state.routeResult;


    const points =
        simplifyInstructionPoints(
            route.points
        );


    const instructions = [

        {
            icon:"●",

            title:
                "Lokasi Anda saat ini",

            description:
                "Mulai dari posisi yang Anda tandai pada denah."
        }

    ];


    for(
        let i = 1;
        i < points.length - 1;
        i++
    ){

        const angle =
            turnAngle(

                points[i - 1],

                points[i],

                points[i + 1]
            );


        /*
           Pada coordinate image:
           Y bertambah ke bawah.
        */

        if(angle > 28){

            instructions.push({

                icon:"↱",

                title:
                    "Belok kanan",

                description:
                    "Ikuti jalur hingga persimpangan berikutnya."
            });
        }
        else if(angle < -28){

            instructions.push({

                icon:"↰",

                title:
                    "Belok kiri",

                description:
                    "Ikuti jalur hingga persimpangan berikutnya."
            });
        }
    }


    instructions.push({

        icon:"◎",

        title:
            "Entrance tujuan di depan",

        description:
            state.routeResult
                .entrance
                .name
    });


    instructions.push({

        icon:"✓",

        title:
            "Anda sudah tiba",

        description:
            `Anda sudah tiba di entrance menuju ${state.destination.name}.`
    });


    return instructions;
}



/* =========================================================
   LIVE BUILDING MARKERS
========================================================= */

function renderLiveBuildingMarkers(){

    const container =
        byId(
            "liveBuildingMarkers"
        );


    if(!container){

        return;
    }


    container.innerHTML =
        "";


    buildings.forEach(
        building => {

            if(
                !building.liveMarker
            ){

                return;
            }


            const marker =
                document.createElement(
                    "div"
                );


            marker.className =
                "live-building-marker";


            marker.style.left =
                (
                    building.liveMarker.x
                    /
                    MAP_WIDTH
                    *
                    100
                )
                +
                "%";


            marker.style.top =
                (
                    building.liveMarker.y
                    /
                    MAP_HEIGHT
                    *
                    100
                )
                +
                "%";


            marker.innerHTML =
                `
                <span></span>

                <label>
                    ${building.name}
                </label>
                `;


            container.appendChild(
                marker
            );
        }
    );
}



/* =========================================================
   LIVE ROUTE DETAILS
========================================================= */

function renderRouteDetail(){

    const container =
        byId(
            "routeInstructionList"
        );


    if(!container){

        return;
    }


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


            item.innerHTML =
                `
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
   RENDER LIVE NAVIGATION
========================================================= */

function renderLiveNavigation(){

    if(
        !state.routeResult
        ||
        !state.destination
    ){

        return;
    }


    const route =
        state.routeResult;


    /* HANYA RUTE PILIHAN USER */

    const liveRoute =
        byId(
            "liveRoute"
        );


    if(liveRoute){

        liveRoute.setAttribute(

            "points",

            route.points
            .map(
                point =>
                    `${point.x},${point.y}`
            )
            .join(" ")
        );
    }


    /* USER POSITION */

    positionMapElement(

        byId(
            "liveUserMarker"
        ),

        route.startSnap.point
    );


    show(
        "liveUserMarker"
    );


    /* DESTINATION END MARKER */

    positionMapElement(

        byId(
            "liveDestinationMarker"
        ),

        route.entrance
    );


    show(
        "liveDestinationMarker"
    );


    setText(

        "liveDestinationMarkerLabel",

        state.destination.name
    );


    setText(

        "liveTargetName",

        state.destination.name
    );


    setText(

        "liveRouteDestination",

        state.destination.name
    );


    setText(

        "liveRouteEntrance",

        route.entrance.name
    );


    /* BUILDING MARKERS ONLY */

    renderLiveBuildingMarkers();


    /* DETAIL */

    state.liveInstructions =
        createNavigationInstructions();


    renderRouteDetail();


    const nextInstruction =
        state.liveInstructions.find(
            step =>
                step.title
                !==
                "Lokasi Anda saat ini"
        );


    if(nextInstruction){

        setText(
            "liveNextInstruction",
            nextInstruction.title
        );


        setText(
            "liveDirectionIcon",
            nextInstruction.icon
        );
    }
}



/* =========================================================
   GPS CALIBRATION
========================================================= */

/*
   GPS akan benar-benar bergerak jika nanti
   mapCalibration memiliki minimal 3 titik.

   Kita TIDAK membuat gerakan palsu sekarang.
*/

function solveAffine(
    calibration,
    lat,
    lon
){

    if(
        !Array.isArray(calibration)
        ||
        calibration.length < 3
    ){

        return null;
    }


    const p1 =
        calibration[0];


    const p2 =
        calibration[1];


    const p3 =
        calibration[2];


    const determinant =

        p1.lon
        *
        (
            p2.lat - p3.lat
        )

        -

        p1.lat
        *
        (
            p2.lon - p3.lon
        )

        +

        (
            p2.lon * p3.lat
            -
            p3.lon * p2.lat
        );


    if(
        Math.abs(determinant)
        <
        1e-12
    ){

        return null;
    }


    function coefficients(
        v1,
        v2,
        v3
    ){

        const a =

            (
                v1
                *
                (
                    p2.lat
                    -
                    p3.lat
                )

                +

                v2
                *
                (
                    p3.lat
                    -
                    p1.lat
                )

                +

                v3
                *
                (
                    p1.lat
                    -
                    p2.lat
                )
            )
            /
            determinant;


        const b =

            (
                v1
                *
                (
                    p3.lon
                    -
                    p2.lon
                )

                +

                v2
                *
                (
                    p1.lon
                    -
                    p3.lon
                )

                +

                v3
                *
                (
                    p2.lon
                    -
                    p1.lon
                )
            )
            /
            determinant;


        const c =

            (
                v1
                *
                (
                    p2.lon * p3.lat
                    -
                    p3.lon * p2.lat
                )

                +

                v2
                *
                (
                    p3.lon * p1.lat
                    -
                    p1.lon * p3.lat
                )

                +

                v3
                *
                (
                    p1.lon * p2.lat
                    -
                    p2.lon * p1.lat
                )
            )
            /
            determinant;


        return{
            a,
            b,
            c
        };
    }


    const cx =
        coefficients(
            p1.x,
            p2.x,
            p3.x
        );


    const cy =
        coefficients(
            p1.y,
            p2.y,
            p3.y
        );


    return{

        x:
            cx.a * lon
            +
            cx.b * lat
            +
            cx.c,

        y:
            cy.a * lon
            +
            cy.b * lat
            +
            cy.c
    };
}



/* =========================================================
   GPS TRACKING
========================================================= */

function stopGpsTracking(){

    if(
        state.gpsWatchId !== null
        &&
        navigator.geolocation
    ){

        navigator.geolocation
        .clearWatch(
            state.gpsWatchId
        );
    }


    state.gpsWatchId =
        null;
}



function startGpsTracking(){

    stopGpsTracking();


    /*
       Belum ada calibration.
       Marker tetap pada posisi manual user.
    */

    if(
        mapCalibration.length < 3
    ){

        console.info(
            "GPS navigation siap, tetapi koordinat mapCalibration belum diisi. Marker memakai posisi awal manual."
        );

        return;
    }


    if(
        !navigator.geolocation
    ){

        return;
    }


    state.gpsWatchId =
        navigator.geolocation
        .watchPosition(

            position => {

                const projected =
                    solveAffine(

                        mapCalibration,

                        position.coords.latitude,

                        position.coords.longitude
                    );


                if(!projected){

                    return;
                }


                /*
                   Snap GPS ke jalur terdekat,
                   agar marker tidak masuk gedung.
                */

                const snap =
                    snapToRoute(
                        projected
                    );


                const mapPoint =
                    snap
                    ?
                    snap.point
                    :
                    projected;


                positionMapElement(

                    byId(
                        "liveUserMarker"
                    ),

                    mapPoint
                );
            },

            error => {

                console.warn(
                    "GPS:",
                    error
                );
            },

            {
                enableHighAccuracy:true,

                maximumAge:1000,

                timeout:10000
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

            toast(
                "Pilih posisi terlebih dahulu."
            );

            return;
        }


        renderLiveNavigation();


        setStep(4);


        showPage(
            "navigationActive"
        );


        /*
           Marker user akan bergerak GPS
           setelah mapCalibration nanti tersedia.
        */

        startGpsTracking();
    }
);



/* =========================================================
   DETAIL NAVIGATION
========================================================= */

on(
    "toggleRouteDetail",
    "click",
    () => {

        const panel =
            byId(
                "routeDetailPanel"
            );


        if(panel){

            panel.classList.toggle(
                "hidden"
            );
        }
    }
);



/* =========================================================
   END ROUTE
========================================================= */

on(
    "endRoute",
    "click",
    () => {

        stopGpsTracking();


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

    if(
        !state.destination
    ){

        return;
    }


    const destination =
        state.destination;


    const buildingId =
        destination.buildingId
        ||
        destination.id;


    const building =
        getBuildingById(
            buildingId
        );


    if(!building){

        toast(
            "Model gedung belum tersedia."
        );

        return;
    }


    let model =
        null;


    /*
       Ruangan:
       prioritaskan model indoor.
    */

    if(
        destination.type
        ===
        "room"
    ){

        model =
            building.models.find(
                item =>
                    item.id === "indoor"
            )
            ||
            null;
    }


    if(!model){

        model =
            getDefaultModelVariant(
                building.id
            );
    }


    if(!model){

        toast(
            "Model 3D belum tersedia."
        );

        return;
    }


    showPage(
        "viewer"
    );


    if(viewerBuildingSelect){

        viewerBuildingSelect.value =
            building.id;
    }


    configureVariants(

        building.id,

        "viewerVariantWrap",

        "viewerVariantSelect"
    );


    const variantSelect =
        byId(
            "viewerVariantSelect"
        );


    if(variantSelect){

        variantSelect.value =
            model.id;
    }


    display3DModel(

        building.id,

        model.id
    );


    /*
       Marker ruangan 3D baru tampil
       saat koordinat modelMarker tersedia.
    */

    const hotspot =
        byId(
            "destination3DHotspot"
        );


    if(
        hotspot
        &&
        destination.modelMarker
    ){

        const marker =
            destination.modelMarker;


        hotspot.dataset.position =
            `${marker.x}m ${marker.y}m ${marker.z}m`;


        setText(
            "destination3DLabel",
            destination.name
        );


        show(
            "destination3DHotspot"
        );
    }
    else{

        hide(
            "destination3DHotspot"
        );


        if(
            destination.type === "room"
        ){

            setText(

                "viewerMessage",

                "Model gedung ditampilkan. Marker tepat ruangan akan aktif setelah koordinat 3D ruangan dimasukkan."
            );
        }
    }
}



on(
    "showDestination3D",
    "click",
    showDestinationIn3D
);



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

        selectDestination(
            location
        );
    }
}



/* =========================================================
   FEATURE OPENERS
========================================================= */

function openViewer(){

    showPage(
        "viewer"
    );
}


function openAR(){

    showPage(
        "ar"
    );
}


function openNavigation(){

    openNavigationWithDestination();
}


function openDirectory(){

    showPage(
        "directory"
    );
}



/* 3D */

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
            openViewer
        );
    }
);



/* AR */

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
            openAR
        );
    }
);



/* NAVIGATION */

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
            openNavigation
        );
    }
);



/* DIRECTORY */

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
            openDirectory
        );
    }
);



/* =========================================================
   TOAST
========================================================= */

let toastTimer =
    null;


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


    if(toastTimer){

        clearTimeout(
            toastTimer
        );
    }


    toastTimer =
        setTimeout(
            () => {

                element.classList.remove(
                    "show"
                );
            },
            2600
        );
}



/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key !== "Escape"
        ){

            return;
        }


        closeDrawer();


        if(
            !byId(
                "infoModal"
            )
            .classList
            .contains(
                "hidden"
            )
        ){

            closeInfo();

            return;
        }


        if(
            state.currentPage
            !==
            "home"
        ){

            goBack();
        }
    }
);



/* =========================================================
   STARTUP
========================================================= */

function startApp(){

    /*
       Render directory.
    */

    renderDirectory();


    /*
       Slider tidak otomatis.
    */

    showSlide(0);


    /*
       Slider Model pertama.
    */

    showLandingModel(0);


    /*
       Home aktif.
    */

    showPage(
        "home",
        false
    );


    console.log(
        "FT UISU Explorer Revision 31 loaded"
    );


    console.log(
        "Buildings:",
        buildings.length
    );


    console.log(
        "Rooms:",
        rooms.length
    );


    console.log(
        "Navigation Nodes:",
        Object.keys(
            mapNodes
        ).length
    );


    if(
        !window.FT_DATA
    ){

        console.error(
            "map-data.js gagal dimuat."
        );


        toast(
            "Database map-data.js gagal dimuat."
        );
    }
}



/*
   Karena script memakai defer,
   DOM seharusnya sudah tersedia.
*/

startApp();


})();
