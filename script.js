(function () {

    "use strict";


    /* =====================================================
       DATA SAFE LOADER
       ===================================================== */

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


    /*
     * PENTING:
     *
     * Walaupun map-data gagal,
     * script tetap jalan.
     *
     * Jadi Beranda, slider, drawer,
     * Bantuan, Tentang, 3D page,
     * dll TIDAK ikut mati.
     */

    const DATA_READY =
        buildings.length > 0
        &&
        Object.keys(mapNodes).length > 0;



    /* =====================================================
       DOM HELPERS
       ===================================================== */

    function byId(id) {

        return document.getElementById(id);

    }


    function all(selector) {

        return Array.from(
            document.querySelectorAll(selector)
        );

    }


    function listen(
        id,
        eventName,
        handler
    ) {

        const element =
            byId(id);


        if (!element) {
            return;
        }


        element.addEventListener(
            eventName,
            handler
        );

    }


    function show(id) {

        const element =
            byId(id);


        if (element) {

            element.classList.remove(
                "hidden"
            );

        }

    }


    function hide(id) {

        const element =
            byId(id);


        if (element) {

            element.classList.add(
                "hidden"
            );

        }

    }


    function setText(
        id,
        value
    ) {

        const element =
            byId(id);


        if (element) {

            element.textContent =
                value;

        }

    }



    /* =====================================================
       APP STATE
       ===================================================== */

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

        globalSelection:
            null,

        infoLocation:
            null,

        routeResult:
            null,

        activeEntrance:
            null,

        selectedStartPoint:
            null,

        liveInstructions:
            []

    };



    /* =====================================================
       DATA HELPERS
       ===================================================== */

    function getBuildingById(id) {

        if (
            typeof DATA.getBuildingById
            ===
            "function"
        ) {

            return DATA.getBuildingById(id);

        }


        return buildings.find(
            function (building) {

                return building.id === id;

            }
        ) || null;

    }


    function getEntranceById(id) {

        if (
            typeof DATA.getEntranceById
            ===
            "function"
        ) {

            return DATA.getEntranceById(id);

        }


        return entrances.find(
            function (entrance) {

                return entrance.id === id;

            }
        ) || null;

    }


    function getBuildingModels(
        buildingId
    ) {

        const building =
            getBuildingById(
                buildingId
            );


        if (!building) {
            return [];
        }


        return building.models || [];

    }


    function getModelVariant(
        buildingId,
        modelId
    ) {

        return getBuildingModels(
            buildingId
        ).find(
            function (model) {

                return model.id === modelId;

            }
        ) || null;

    }


    function getDefaultModelVariant(
        buildingId
    ) {

        const building =
            getBuildingById(
                buildingId
            );


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


    function getNavigationEntrance(
        location
    ) {

        if (!location) {
            return null;
        }


        /*
         * RUANGAN:
         * selalu patuhi entrance spesifik.
         *
         * Ini inti sistem Entrance Buntu.
         */

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
       LOCATION SEARCH DATABASE
       ===================================================== */

    const locations = [];


    buildings.forEach(
        function (building) {

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

                navigationEntranceId:
                    building.defaultEntranceId,

                modelMarker:
                    null

            });

        }
    );


    rooms.forEach(
        function (room) {

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



    /* =====================================================
       PAGE SYSTEM
       ===================================================== */

    function updateHeaderActive(
        pageName
    ) {

        all(".header-link")
            .forEach(
                function (button) {

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


        if (matching) {

            matching.classList.add(
                "active"
            );

        } else {

            const home =
                document.querySelector(
                    '.header-link[data-page="home"]'
                );


            if (
                pageName === "home"
                &&
                home
            ) {

                home.classList.add(
                    "active"
                );

            }

        }

    }


    function showPage(
        pageName,
        pushHistory
    ) {

        if (
            typeof pushHistory
            ===
            "undefined"
        ) {

            pushHistory = true;

        }


        const nextPage =
            byId(
                pageName + "Page"
            );


        if (!nextPage) {

            console.warn(
                "Page tidak ditemukan:",
                pageName
            );

            return;

        }


        if (
            pushHistory
            &&
            state.currentPage
            &&
            state.currentPage !== pageName
        ) {

            state.pageHistory.push(
                state.currentPage
            );

        }


        all(".page")
            .forEach(
                function (page) {

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


        if (
            pageName !==
            "navigationActive"
        ) {

            window.scrollTo(
                0,
                0
            );

        }

    }


    function goBack() {

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


    all("[data-back]")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    goBack
                );

            }
        );


    listen(
        "logoHome",
        "click",
        function () {

            showPage(
                "home"
            );

        }
    );


    all("[data-page]")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        showPage(
                            button.dataset.page
                        );

                    }
                );

            }
        );



    /* =====================================================
       DRAWER
       ===================================================== */

    function openDrawer() {

        const drawer =
            byId("drawer");


        const overlay =
            byId("drawerOverlay");


        if (drawer) {

            drawer.classList.add(
                "open"
            );

        }


        if (overlay) {

            overlay.classList.add(
                "show"
            );

        }


        document.body.style.overflow =
            "hidden";

    }


    function closeDrawer() {

        const drawer =
            byId("drawer");


        const overlay =
            byId("drawerOverlay");


        if (drawer) {

            drawer.classList.remove(
                "open"
            );

        }


        if (overlay) {

            overlay.classList.remove(
                "show"
            );

        }


        document.body.style.overflow =
            "";

    }


    listen(
        "hamburgerButton",
        "click",
        openDrawer
    );


    listen(
        "closeDrawer",
        "click",
        closeDrawer
    );


    listen(
        "drawerOverlay",
        "click",
        closeDrawer
    );



    /* =====================================================
       HOME SLIDER
       ===================================================== */

    const slides =
        all(".hero-slide");


    function showSlide(index) {

        if (!slides.length) {
            return;
        }


        if (index < 0) {

            index =
                slides.length - 1;

        }


        if (
            index >=
            slides.length
        ) {

            index = 0;

        }


        state.currentSlide =
            index;


        slides.forEach(
            function (slide, i) {

                slide.classList.toggle(
                    "active",
                    i === index
                );

            }
        );


        all(".slider-dot")
            .forEach(
                function (dot, i) {

                    dot.classList.toggle(
                        "active",
                        i === index
                    );

                }
            );

    }


    listen(
        "prevSlide",
        "click",
        function () {

            showSlide(
                state.currentSlide - 1
            );

        }
    );


    listen(
        "nextSlide",
        "click",
        function () {

            showSlide(
                state.currentSlide + 1
            );

        }
    );


    all(".slider-dot")
        .forEach(
            function (dot) {

                dot.addEventListener(
                    "click",
                    function () {

                        showSlide(
                            Number(
                                dot.dataset.slide
                            )
                        );

                    }
                );

            }
        );



    /* =====================================================
       LANDING 3D MODELS
       ===================================================== */

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


    function showLandingModel(index) {

        if (!landingModels.length) {
            return;
        }


        if (index < 0) {

            index =
                landingModels.length - 1;

        }


        if (
            index >=
            landingModels.length
        ) {

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


        if (viewer) {

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
            (index + 1)
            +
            " / "
            +
            landingModels.length
        );

    }


    listen(
        "landingNextModel",
        "click",
        function () {

            showLandingModel(
                state.landingModelIndex
                +
                1
            );

        }
    );


    showLandingModel(0);



    /* =====================================================
       SEARCH
       ===================================================== */

    function normalize(value) {

        return String(
            value || ""
        )
        .toLowerCase()
        .trim();

    }


    function searchLocations(value) {

        const query =
            normalize(value);


        if (!query) {

            return [];

        }


        return locations
            .filter(
                function (location) {

                    return normalize(
                        location.name
                        +
                        " "
                        +
                        location.parent
                    )
                    .includes(query);

                }
            )
            .slice(0, 40);

    }


    function renderSearchResults(
        results,
        container,
        onSelect
    ) {

        if (!container) {
            return;
        }


        container.innerHTML =
            "";


        if (!results.length) {

            container.innerHTML =
                '<div class="search-empty">'
                +
                "Lokasi tidak ditemukan."
                +
                "</div>";

            return;
        }


        results.forEach(
            function (location) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "search-result";


                button.innerHTML =

                    "<span>"
                    +
                        "<strong>"
                        +
                            location.name
                        +
                        "</strong>"
                        +
                        "<small>"
                        +
                            location.parent
                            +
                            (
                                location.floor
                                ?
                                " • Lantai "
                                +
                                location.floor
                                :
                                ""
                            )
                        +
                        "</small>"
                    +
                    "</span>"

                    +

                    '<span class="search-type">'
                    +
                        (
                            location.type
                            ===
                            "building"
                            ?
                            "Gedung"
                            :
                            "Ruangan"
                        )
                    +
                    "</span>";


                button.addEventListener(
                    "click",
                    function () {

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



    /* =====================================================
       GLOBAL SEARCH
       ===================================================== */

    const globalSearch =
        byId(
            "globalSearch"
        );


    if (globalSearch) {

        globalSearch.addEventListener(
            "input",
            function (event) {

                const value =
                    event.target.value;


                if (!value.trim()) {

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

                    function (location) {

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


    listen(
        "clearGlobalSearch",
        "click",
        function () {

            if (globalSearch) {

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



    /* =====================================================
       INFO MODAL
       ===================================================== */

    function openInfo(location) {

        if (!location) {
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


    function closeInfo() {

        hide(
            "infoModal"
        );

    }


    listen(
        "closeInfoModal",
        "click",
        closeInfo
    );


    listen(
        "infoBackdrop",
        "click",
        closeInfo
    );


    listen(
        "globalInfoButton",
        "click",
        function () {

            openInfo(
                state.globalSelection
            );

        }
    );


    listen(
        "globalNavButton",
        "click",
        function () {

            if (
                !state.globalSelection
            ) {

                return;

            }


            openNavigationWithDestination(
                state.globalSelection
            );

        }
    );


    listen(
        "infoNavigationButton",
        "click",
        function () {

            const location =
                state.infoLocation;


            if (!location) {
                return;
            }


            closeInfo();


            openNavigationWithDestination(
                location
            );

        }
    );



    /* =====================================================
       BUILDING SELECT
       ===================================================== */

    function populateBuildingSelect(
        select
    ) {

        if (!select) {
            return;
        }


        select.innerHTML =
            '<option value="">'
            +
            "-- Pilih Gedung --"
            +
            "</option>";


        buildings.forEach(
            function (building) {

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
        byId(
            "viewerBuildingSelect"
        )
    );


    populateBuildingSelect(
        byId(
            "arBuildingSelect"
        )
    );


    function configureVariants(
        buildingId,
        wrapId,
        selectId
    ) {

        const select =
            byId(selectId);


        if (!select) {
            return;
        }


        const models =
            getBuildingModels(
                buildingId
            );


        select.innerHTML =
            "";


        models.forEach(
            function (model) {

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


        if (
            models.length > 1
        ) {

            show(
                wrapId
            );

        } else {

            hide(
                wrapId
            );

        }

    }


    const viewerBuildingSelect =
        byId(
            "viewerBuildingSelect"
        );


    if (viewerBuildingSelect) {

        viewerBuildingSelect
            .addEventListener(
                "change",
                function () {

                    configureVariants(

                        viewerBuildingSelect.value,

                        "viewerVariantWrap",

                        "viewerVariantSelect"

                    );

                }
            );

    }


    const arBuildingSelect =
        byId(
            "arBuildingSelect"
        );


    if (arBuildingSelect) {

        arBuildingSelect
            .addEventListener(
                "change",
                function () {

                    configureVariants(

                        arBuildingSelect.value,

                        "arVariantWrap",

                        "arVariantSelect"

                    );

                }
            );

    }



    /* =====================================================
       MAIN 3D VIEWER
       ===================================================== */

    const mainModelViewer =
        byId(
            "mainModelViewer"
        );


    function display3DModel(
        buildingId,
        variantId
    ) {

        const building =
            getBuildingById(
                buildingId
            );


        if (!building) {

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


        if (!model) {

            setText(
                "viewerMessage",
                "Model 3D belum tersedia."
            );

            return;
        }


        if (mainModelViewer) {

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


    listen(
        "show3DModel",
        "click",
        function () {

            const buildingId =
                viewerBuildingSelect
                ?
                viewerBuildingSelect.value
                :
                "";


            if (!buildingId) {

                setText(
                    "viewerMessage",
                    "Pilih gedung terlebih dahulu."
                );

                return;

            }


            const variant =
                byId(
                    "viewerVariantSelect"
                );


            display3DModel(

                buildingId,

                variant
                ?
                variant.value
                :
                ""

            );

        }
    );



    /* =====================================================
       MODEL FOCUS
       ===================================================== */

    const focusRing =
        byId(
            "modelFocusRing"
        );


    let modelPointerStart =
        null;


    let modelPointerMoved =
        false;


    function hideFocusRing() {

        if (!focusRing) {
            return;
        }


        focusRing.classList.remove(
            "focus-visible"
        );


        focusRing.classList.add(
            "hidden"
        );

    }


    if (mainModelViewer) {


        mainModelViewer.addEventListener(
            "pointerdown",
            function (event) {

                hideFocusRing();


                modelPointerStart = {

                    x:
                        event.clientX,

                    y:
                        event.clientY

                };


                modelPointerMoved =
                    false;

            }
        );


        mainModelViewer.addEventListener(
            "pointermove",
            function (event) {

                if (!modelPointerStart) {
                    return;
                }


                const movement =
                    Math.hypot(

                        event.clientX
                        -
                        modelPointerStart.x,

                        event.clientY
                        -
                        modelPointerStart.y

                    );


                if (movement > 8) {

                    modelPointerMoved =
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
            function (event) {

                if (
                    !modelPointerStart
                    ||
                    modelPointerMoved
                ) {

                    modelPointerStart =
                        null;

                    return;
                }


                if (!focusRing) {

                    modelPointerStart =
                        null;

                    return;
                }


                const stage =
                    byId(
                        "modelViewerStage"
                    );


                if (!stage) {

                    modelPointerStart =
                        null;

                    return;
                }


                const rect =
                    stage.getBoundingClientRect();


                focusRing.style.left =
                    (
                        event.clientX
                        -
                        rect.left
                    )
                    +
                    "px";


                focusRing.style.top =
                    (
                        event.clientY
                        -
                        rect.top
                    )
                    +
                    "px";


                focusRing.classList.remove(
                    "hidden"
                );


                requestAnimationFrame(
                    function () {

                        focusRing.classList.add(
                            "focus-visible"
                        );

                    }
                );


                /*
                 * Jika API positionAndNormalFromPoint
                 * tersedia, jadikan titik klik sebagai
                 * fokus kamera.
                 */

                if (
                    typeof mainModelViewer
                        .positionAndNormalFromPoint
                    ===
                    "function"
                ) {

                    try {

                        const hit =
                            mainModelViewer
                                .positionAndNormalFromPoint(

                                    event.clientX,

                                    event.clientY

                                );


                        if (
                            hit
                            &&
                            hit.position
                        ) {

                            mainModelViewer.cameraTarget =

                                hit.position.x
                                +
                                "m "
                                +
                                hit.position.y
                                +
                                "m "
                                +
                                hit.position.z
                                +
                                "m";


                            if (
                                typeof
                                mainModelViewer
                                    .getCameraOrbit
                                ===
                                "function"
                            ) {

                                const orbit =
                                    mainModelViewer
                                        .getCameraOrbit();


                                if (orbit) {

                                    mainModelViewer.cameraOrbit =

                                        orbit.theta
                                        +
                                        "rad "
                                        +
                                        orbit.phi
                                        +
                                        "rad "
                                        +
                                        Math.max(
                                            orbit.radius * .55,
                                            .08
                                        )
                                        +
                                        "m";

                                }

                            }

                        }

                    }

                    catch (error) {

                        console.warn(
                            "Focus model:",
                            error
                        );

                    }

                }


                modelPointerStart =
                    null;

            }
        );

    }


    listen(
        "resetCamera",
        "click",
        function () {

            hideFocusRing();


            if (!mainModelViewer) {
                return;
            }


            mainModelViewer.cameraOrbit =
                "auto auto auto";


            mainModelViewer.cameraTarget =
                "auto auto auto";

        }
    );



    /* =====================================================
       AR TEMPORARY
       ===================================================== */

    listen(
        "prepareMainAR",
        "click",
        function () {

            toast(
                "AR Markerless akan kita aktifkan pada tahap berikutnya."
            );

        }
    );



    /* =====================================================
       DIRECTORY
       ===================================================== */

    function makeLocationFromRoom(
        room
    ) {

        return locations.find(
            function (location) {

                return (
                    location.type
                    ===
                    "room"
                    &&
                    location.id
                    ===
                    room.id
                );

            }
        ) || null;

    }


    function makeLocationFromBuilding(
        building
    ) {

        return locations.find(
            function (location) {

                return (
                    location.type
                    ===
                    "building"
                    &&
                    location.id
                    ===
                    building.id
                );

            }
        ) || null;

    }


    function renderRoomList(
        roomList,
        container
    ) {

        container.innerHTML =
            "";


        if (!roomList.length) {

            container.innerHTML =

                '<div class="search-empty">'
                +
                "Data ruangan akan dilengkapi kemudian."
                +
                "</div>";

            return;
        }


        const grid =
            document.createElement(
                "div"
            );


        grid.className =
            "room-grid";


        roomList.forEach(
            function (room) {

                const location =
                    makeLocationFromRoom(
                        room
                    );


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "room-item";


                item.innerHTML =

                    '<div class="room-row">'
                    +
                        "<span>"
                        +
                            room.name
                        +
                        "</span>"
                        +
                        '<button type="button">'
                        +
                            "Pilih"
                        +
                        "</button>"
                    +
                    "</div>"

                    +

                    '<div class="room-actions hidden">'
                    +
                        '<button type="button" class="room-info">'
                        +
                            "Informasi"
                        +
                        "</button>"
                        +
                        '<button type="button" class="room-nav">'
                        +
                            "Petunjuk Arah"
                        +
                        "</button>"
                    +
                    "</div>";


                const chooseButton =
                    item.querySelector(
                        ".room-row button"
                    );


                const actionBox =
                    item.querySelector(
                        ".room-actions"
                    );


                chooseButton.addEventListener(
                    "click",
                    function () {

                        actionBox.classList.toggle(
                            "hidden"
                        );

                    }
                );


                item.querySelector(
                    ".room-info"
                )
                .addEventListener(
                    "click",
                    function () {

                        openInfo(
                            location
                        );

                    }
                );


                item.querySelector(
                    ".room-nav"
                )
                .addEventListener(
                    "click",
                    function () {

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
    ) {

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


        [1,2,3].forEach(
            function (floor) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "floor-button";


                button.textContent =
                    "Lantai "
                    +
                    floor;


                button.addEventListener(
                    "click",
                    function () {

                        Array.from(
                            floorButtons.children
                        )
                        .forEach(
                            function (item) {

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
                                function (room) {

                                    return (
                                        room.floor
                                        ===
                                        floor
                                    );

                                }
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


        if (
            floorButtons
                .firstElementChild
        ) {

            floorButtons
                .firstElementChild
                .click();

        }

    }


    function renderDirectory() {

        const container =
            byId(
                "directoryContainer"
            );


        if (!container) {
            return;
        }


        container.innerHTML =
            "";


        buildings.forEach(
            function (building, index) {

                const roomList =
                    rooms.filter(
                        function (room) {

                            return (
                                room.buildingId
                                ===
                                building.id
                            );

                        }
                    );


                const location =
                    makeLocationFromBuilding(
                        building
                    );


                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "building-card";


                article.innerHTML =

                    '<button class="building-button" type="button">'
                    +
                        '<span class="building-number">'
                        +
                            String(
                                index + 1
                            )
                            .padStart(
                                2,
                                "0"
                            )
                        +
                        "</span>"

                        +

                        "<span>"
                        +
                            "<strong>"
                            +
                                building.name
                            +
                            "</strong>"
                            +
                            "<p>"
                            +
                                building.description
                            +
                            "</p>"
                        +
                        "</span>"

                        +

                        "<span>›</span>"
                    +
                    "</button>"

                    +

                    '<div class="building-content"></div>';


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
                    function () {

                        article.classList.toggle(
                            "open"
                        );

                    }
                );


                const buildingActions =
                    document.createElement(
                        "div"
                    );


                buildingActions.className =
                    "building-actions";


                buildingActions.innerHTML =

                    '<button class="button button-soft building-info" type="button">'
                    +
                        "Informasi"
                    +
                    "</button>"

                    +

                    '<button class="button button-primary building-nav" type="button">'
                    +
                        "Petunjuk Arah"
                    +
                    "</button>";


                content.appendChild(
                    buildingActions
                );


                buildingActions
                    .querySelector(
                        ".building-info"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            openInfo(
                                location
                            );

                        }
                    );


                buildingActions
                    .querySelector(
                        ".building-nav"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            openNavigationWithDestination(
                                location
                            );

                        }
                    );


                const roomsHolder =
                    document.createElement(
                        "div"
                    );


                content.appendChild(
                    roomsHolder
                );


                if (
                    building.id
                    ===
                    "laboratorium-ft"
                ) {

                    renderLaboratory(
                        roomList,
                        roomsHolder
                    );

                } else {

                    renderRoomList(
                        roomList,
                        roomsHolder
                    );

                }


                container.appendChild(
                    article
                );

            }
        );

    }


    renderDirectory();



    /* =====================================================
       NAVIGATION RESET
       ===================================================== */

    function setStep(stepNumber) {

        const steps = [
            "stepTarget",
            "stepPosition",
            "stepRoute",
            "stepNavigation"
        ];


        steps.forEach(
            function (id, index) {

                const element =
                    byId(id);


                if (!element) {
                    return;
                }


                element.classList.toggle(
                    "active",
                    index + 1
                    <=
                    stepNumber
                );

            }
        );

    }


    function resetNavigation() {

        state.destination =
            null;


        state.routeResult =
            null;


        state.activeEntrance =
            null;


        state.selectedStartPoint =
            null;


        const search =
            byId(
                "navigationSearch"
            );


        if (search) {

            search.value =
                "";

        }


        const activeRoute =
            byId(
                "activeRoute"
            );


        if (activeRoute) {

            activeRoute.setAttribute(
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


        show(
            "mapInstructionArea"
        );


        setStep(1);


        const results =
            byId(
                "navigationSearchResults"
            );


        if (results) {

            results.innerHTML =

                '<div class="search-empty">'
                +
                "Ketik nama gedung atau ruangan tujuan."
                +
                "</div>";

        }

    }



    /* =====================================================
       NAVIGATION SEARCH
       ===================================================== */

    function selectDestination(
        location
    ) {

        if (!location) {
            return;
        }


        state.destination =
            location;


        const search =
            byId(
                "navigationSearch"
            );


        if (search) {

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
        );


        show(
            "selectedDestination"
        );


        const results =
            byId(
                "navigationSearchResults"
            );


        if (results) {

            results.innerHTML =
                "";

        }


        setText(

            "mapHeadingTitle",

            "Tap pada denah sesuai posisi Anda sekarang, lalu sistem akan memberikan jalur terdekat menuju "
            +
            location.name
            +
            "."

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


        const route =
            byId(
                "activeRoute"
            );


        if (route) {

            route.setAttribute(
                "points",
                ""
            );

        }


        setStep(2);


        /*
         * Scroll halus ke map.
         */

        setTimeout(
            function () {

                const mapSection =
                    byId(
                        "mapSection"
                    );


                if (mapSection) {

                    mapSection.scrollIntoView({
                        behavior:
                            "smooth",

                        block:
                            "start"
                    });

                }

            },
            100
        );

    }


    const navigationSearch =
        byId(
            "navigationSearch"
        );


    if (navigationSearch) {

        navigationSearch
            .addEventListener(
                "input",
                function () {

                    renderSearchResults(

                        searchLocations(
                            navigationSearch.value
                        ),

                        byId(
                            "navigationSearchResults"
                        ),

                        selectDestination

                    );

                }
            );

    }


    function openNavigationWithDestination(
        location
    ) {

        showPage(
            "navigation"
        );


        resetNavigation();


        if (location) {

            selectDestination(
                location
            );

        }

    }



    /* =====================================================
       GRAPH PREPARATION
       ===================================================== */

    function distance(a,b) {

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
        function (nodeId) {

            graph[nodeId] = [];

        }
    );


    const preparedEdges =
        mapEdges.map(
            function (edge) {

                const points =
                    edge.points.map(
                        function (point) {

                            return {
                                x:point[0],
                                y:point[1]
                            };

                        }
                    );


                let length = 0;


                const cumulative =
                    [0];


                for (
                    let i = 0;
                    i < points.length - 1;
                    i++
                ) {

                    length +=
                        distance(
                            points[i],
                            points[i + 1]
                        );


                    cumulative.push(
                        length
                    );

                }


                return {

                    id:
                        edge.id,

                    from:
                        edge.from,

                    to:
                        edge.to,

                    points:
                        points,

                    length:
                        length,

                    cumulative:
                        cumulative

                };

            }
        );


    const edgeById = {};


    preparedEdges.forEach(
        function (edge) {

            edgeById[
                edge.id
            ] = edge;


            if (!graph[edge.from]) {

                graph[edge.from] = [];

            }


            if (!graph[edge.to]) {

                graph[edge.to] = [];

            }


            graph[edge.from]
                .push({

                    node:
                        edge.to,

                    edgeId:
                        edge.id,

                    weight:
                        edge.length

                });


            graph[edge.to]
                .push({

                    node:
                        edge.from,

                    edgeId:
                        edge.id,

                    weight:
                        edge.length

                });

        }
    );



    /* =====================================================
       SNAP TO PATH
       ===================================================== */

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
                a.x
                +
                abX * t,

            y:
                a.y
                +
                abY * t

        };


        return {

            point:
                projected,

            t:
                t,

            distance:
                distance(
                    point,
                    projected
                )

        };

    }


    function snapToRoute(
        point
    ) {

        let best =
            null;


        preparedEdges.forEach(
            function (edge) {

                for (
                    let i = 0;
                    i < edge.points.length - 1;
                    i++
                ) {

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
                        distance(
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


                    if (
                        !best
                        ||
                        projection.distance
                        <
                        best.distance
                    ) {

                        best = {

                            edge:
                                edge,

                            segmentIndex:
                                i,

                            point:
                                projection.point,

                            distance:
                                projection.distance,

                            along:
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



    /* =====================================================
       DIJKSTRA
       ===================================================== */

    function dijkstra(
        start,
        target
    ) {

        const nodeIds =
            Object.keys(
                graph
            );


        const distances = {};
        const previous = {};
        const previousEdge = {};


        nodeIds.forEach(
            function (id) {

                distances[id] =
                    Infinity;

                previous[id] =
                    null;

                previousEdge[id] =
                    null;

            }
        );


        if (
            typeof distances[start]
            ===
            "undefined"
            ||
            typeof distances[target]
            ===
            "undefined"
        ) {

            return null;

        }


        distances[start] =
            0;


        const unvisited =
            new Set(
                nodeIds
            );


        while (
            unvisited.size
        ) {

            let current =
                null;


            let smallest =
                Infinity;


            unvisited.forEach(
                function (id) {

                    if (
                        distances[id]
                        <
                        smallest
                    ) {

                        smallest =
                            distances[id];

                        current =
                            id;

                    }

                }
            );


            if (
                current === null
                ||
                smallest === Infinity
            ) {

                break;

            }


            if (
                current === target
            ) {

                break;

            }


            unvisited.delete(
                current
            );


            const connections =
                graph[current] || [];


            connections.forEach(
                function (connection) {

                    if (
                        !unvisited.has(
                            connection.node
                        )
                    ) {

                        return;

                    }


                    const candidate =
                        distances[current]
                        +
                        connection.weight;


                    if (
                        candidate
                        <
                        distances[
                            connection.node
                        ]
                    ) {

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


        if (
            distances[target]
            ===
            Infinity
        ) {

            return null;

        }


        const nodes = [];
        const edges = [];


        let cursor =
            target;


        while (cursor) {

            nodes.unshift(
                cursor
            );


            if (
                cursor === start
            ) {

                break;

            }


            edges.unshift(
                previousEdge[cursor]
            );


            cursor =
                previous[cursor];

        }


        return {

            distance:
                distances[target],

            nodes:
                nodes,

            edges:
                edges

        };

    }



    /* =====================================================
       ROUTE FROM SNAP
       ===================================================== */

    function routeFromSnapToNode(
        snap,
        targetNodeId
    ) {

        const candidates =
            [];


        [
            snap.edge.from,
            snap.edge.to
        ]
        .forEach(
            function (endpoint) {

                const route =
                    dijkstra(
                        endpoint,
                        targetNodeId
                    );


                if (!route) {
                    return;
                }


                const snapCost =

                    endpoint
                    ===
                    snap.edge.from

                    ?

                    snap.distanceToFrom

                    :

                    snap.distanceToTo;


                candidates.push({

                    startNode:
                        endpoint,

                    total:
                        snapCost
                        +
                        route.distance,

                    route:
                        route

                });

            }
        );


        candidates.sort(
            function (a,b) {

                return (
                    a.total
                    -
                    b.total
                );

            }
        );


        return (
            candidates[0]
            ||
            null
        );

    }



    /* =====================================================
       BUILD POLYLINE
       ===================================================== */

    function pointsFromSnapToEndpoint(
        snap,
        endpoint
    ) {

        const points =
            snap.edge.points;


        const output =
            [
                {
                    x:snap.point.x,
                    y:snap.point.y
                }
            ];


        if (
            endpoint ===
            snap.edge.from
        ) {

            output.push(
                points[
                    snap.segmentIndex
                ]
            );


            for (
                let i =
                    snap.segmentIndex - 1;

                i >= 0;

                i--
            ) {

                output.push(
                    points[i]
                );

            }

        } else {

            output.push(
                points[
                    snap.segmentIndex + 1
                ]
            );


            for (
                let i =
                    snap.segmentIndex + 2;

                i < points.length;

                i++
            ) {

                output.push(
                    points[i]
                );

            }

        }


        return output;

    }


    function routeNodePolyline(
        route
    ) {

        const output = [];


        route.edges.forEach(
            function (
                edgeId,
                index
            ) {

                const edge =
                    edgeById[
                        edgeId
                    ];


                if (!edge) {
                    return;
                }


                const fromNode =
                    route.nodes[index];


                let points;


                if (
                    edge.from
                    ===
                    fromNode
                ) {

                    points =
                        edge.points.slice();

                } else {

                    points =
                        edge.points
                            .slice()
                            .reverse();

                }


                if (
                    output.length
                ) {

                    points =
                        points.slice(1);

                }


                output.push.apply(
                    output,
                    points
                );

            }
        );


        return output;

    }


    function dedupePoints(
        points
    ) {

        const output = [];


        points.forEach(
            function (point) {

                const previous =
                    output[
                        output.length - 1
                    ];


                if (
                    !previous
                    ||
                    distance(
                        previous,
                        point
                    )
                    >
                    .5
                ) {

                    output.push(
                        point
                    );

                }

            }
        );


        return output;

    }



    /* =====================================================
       BUILD NAVIGATION ROUTE
       ===================================================== */

    function buildRoute(
        clickedPoint
    ) {

        if (!DATA_READY) {

            toast(
                "Database navigasi belum berhasil dimuat."
            );

            return null;

        }


        const entrance =
            getNavigationEntrance(
                state.destination
            );


        if (!entrance) {

            toast(
                "Entrance tujuan belum tersedia."
            );

            return null;

        }


        const snap =
            snapToRoute(
                clickedPoint
            );


        if (!snap) {

            return null;

        }


        const route =
            routeFromSnapToNode(

                snap,

                entrance.nodeId

            );


        if (!route) {

            return null;

        }


        const startPart =
            pointsFromSnapToEndpoint(

                snap,

                route.startNode

            );


        const graphPart =
            routeNodePolyline(
                route.route
            );


        const routePoints =
            dedupePoints(

                startPart
                .concat(
                    graphPart
                )
                .concat(
                    [
                        {
                            x:
                                entrance.x,

                            y:
                                entrance.y
                        }
                    ]
                )

            );


        return {

            startSnap:
                snap,

            entrance:
                entrance,

            graphDistance:
                route.total,

            points:
                routePoints

        };

    }



    /* =====================================================
       MAP ELEMENT POSITION
       ===================================================== */

    function positionMapElement(
        element,
        point
    ) {

        if (
            !element
            ||
            !point
        ) {

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



    /* =====================================================
       STATIC MAP CLICK
       ===================================================== */

    const navigationMap =
        byId(
            "navigationMap"
        );


    if (navigationMap) {

        navigationMap.addEventListener(
            "click",
            function (event) {

                if (
                    !state.destination
                ) {

                    toast(
                        "Pilih tujuan terlebih dahulu."
                    );

                    return;
                }


                const rect =
                    navigationMap
                        .getBoundingClientRect();


                const clickPoint = {

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
                        clickPoint
                    );


                if (!route) {

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


                const routePolyline =
                    byId(
                        "activeRoute"
                    );


                if (routePolyline) {

                    routePolyline.setAttribute(

                        "points",

                        route.points
                            .map(
                                function (point) {

                                    return (
                                        point.x
                                        +
                                        ","
                                        +
                                        point.y
                                    );

                                }
                            )
                            .join(" ")

                    );

                }


                positionMapElement(

                    byId(
                        "userMarker"
                    ),

                    route.startSnap.point

                );


                positionMapElement(

                    byId(
                        "entranceMarker"
                    ),

                    route.entrance

                );


                setText(
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


                setText(

                    "routeFoundDescription",

                    "Garis biru adalah jalur outdoor menuju "
                    +
                    route.entrance.name
                    +
                    ". Pilih Mulai Navigasi untuk petunjuk selanjutnya."

                );


                show(
                    "routeFoundBox"
                );


                setStep(3);

            }
        );

    }



    /* =====================================================
       TURN INSTRUCTIONS
       ===================================================== */

    function turnAngle(
        a,
        b,
        c
    ) {

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
    ) {

        if (
            points.length <= 2
        ) {

            return points.slice();

        }


        const output =
            [
                points[0]
            ];


        for (
            let i = 1;
            i < points.length - 1;
            i++
        ) {

            const angle =
                turnAngle(

                    points[i - 1],

                    points[i],

                    points[i + 1]

                );


            if (
                Math.abs(angle)
                >=
                25
            ) {

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


    function createNavigationInstructions() {

        if (
            !state.routeResult
            ||
            !state.destination
        ) {

            return [];

        }


        const route =
            state.routeResult;


        const entrance =
            route.entrance;


        const destinationName =
            state.destination.name;


        const points =
            simplifyInstructionPoints(
                route.points
            );


        const instructions = [

            {
                icon:
                    "●",

                title:
                    "Lokasi Anda saat ini",

                description:
                    "Mulai dari posisi yang Anda tandai pada denah."
            }

        ];


        for (
            let i = 1;
            i < points.length - 1;
            i++
        ) {

            const angle =
                turnAngle(

                    points[i - 1],

                    points[i],

                    points[i + 1]

                );


            if (
                angle > 25
            ) {

                instructions.push({

                    icon:
                        "↱",

                    title:
                        "Belok kanan",

                    description:
                        "Ikuti jalur menuju persimpangan berikutnya."

                });

            }

            else if (
                angle < -25
            ) {

                instructions.push({

                    icon:
                        "↰",

                    title:
                        "Belok kiri",

                    description:
                        "Ikuti jalur menuju persimpangan berikutnya."

                });

            }

        }


        instructions.push({

            icon:
                "◎",

            title:
                "Entrance tujuan di depan",

            description:
                entrance.name

        });


        if (
            entrance.deadEnd
        ) {

            instructions.push({

                icon:
                    "⌂",

                title:
                    "Gunakan entrance ini",

                description:
                    "Entrance ini merupakan akses yang sesuai untuk "
                    +
                    destinationName
                    +
                    "."

            });

        }


        /*
         * Navigasi kita berhenti di ENTRANCE.
         * Bukan navigasi indoor.
         */

        instructions.push({

            icon:
                "✓",

            title:
                "Anda sudah tiba di entrance tujuan",

            description:
                "Tujuan: "
                +
                destinationName

        });


        return instructions;

    }



    /* =====================================================
       LIVE NAVIGATION RENDER
       ===================================================== */

    function renderRouteDetails() {

        const container =
            byId(
                "routeInstructionList"
            );


        if (!container) {
            return;
        }


        container.innerHTML =
            "";


        state.liveInstructions
            .forEach(
                function (step) {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "route-instruction-item";


                    item.innerHTML =

                        '<div class="route-step-icon">'
                        +
                            step.icon
                        +
                        "</div>"

                        +

                        '<div class="route-step-copy">'
                        +
                            "<strong>"
                            +
                                step.title
                            +
                            "</strong>"
                            +
                            "<span>"
                            +
                                step.description
                            +
                            "</span>"
                        +
                        "</div>";


                    container.appendChild(
                        item
                    );

                }
            );

    }


    function renderLiveNavigation() {

        const route =
            state.routeResult;


        if (
            !route
            ||
            !state.destination
        ) {

            return;

        }


        const liveRoute =
            byId(
                "liveRoute"
            );


        if (liveRoute) {

            liveRoute.setAttribute(

                "points",

                route.points
                    .map(
                        function (point) {

                            return (
                                point.x
                                +
                                ","
                                +
                                point.y
                            );

                        }
                    )
                    .join(" ")

            );

        }


        positionMapElement(

            byId(
                "liveUserMarker"
            ),

            route.startSnap.point

        );


        positionMapElement(

            byId(
                "liveDestinationMarker"
            ),

            route.entrance

        );


        setText(

            "liveDestinationMarkerLabel",

            state.destination.name

        );


        setText(

            "liveDestinationTitle",

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


        state.liveInstructions =
            createNavigationInstructions();


        let nextStep =
            null;


        for (
            let i = 0;
            i < state.liveInstructions.length;
            i++
        ) {

            if (
                state.liveInstructions[i]
                    .title
                !==
                "Lokasi Anda saat ini"
            ) {

                nextStep =
                    state.liveInstructions[i];

                break;

            }

        }


        setText(

            "liveNextInstruction",

            nextStep
            ?
            nextStep.title
            :
            "Ikuti jalur"

        );


        setText(

            "liveManeuverIcon",

            nextStep
            ?
            nextStep.icon
            :
            "↑"

        );


        renderRouteDetails();

    }



    /* =====================================================
       START NAVIGATION
       ===================================================== */

    listen(
        "startNavigation",
        "click",
        function () {

            if (
                !state.routeResult
                ||
                !state.destination
            ) {

                toast(
                    "Pilih posisi dan buat rute terlebih dahulu."
                );

                return;
            }


            renderLiveNavigation();


            setStep(4);


            showPage(
                "navigationActive"
            );


            setTimeout(
                function () {

                    const map =
                        byId(
                            "liveMapContent"
                        );


                    if (map) {

                        map.classList.add(
                            "navigation-started"
                        );

                    }

                },
                80
            );

        }
    );



    /* =====================================================
       LIVE DETAIL
       ===================================================== */

    function toggleRouteDetails() {

        const panel =
            byId(
                "routeDetailPanel"
            );


        if (panel) {

            panel.classList.toggle(
                "hidden"
            );

        }

    }


    listen(
        "toggleRouteDetail",
        "click",
        toggleRouteDetails
    );


    listen(
        "collapseRouteSheet",
        "click",
        toggleRouteDetails
    );



    /* =====================================================
       END ROUTE
       ===================================================== */

    listen(
        "endRoute",
        "click",
        function () {

            const liveMap =
                byId(
                    "liveMapContent"
                );


            if (liveMap) {

                liveMap.classList.remove(
                    "navigation-started"
                );

            }


            /*
             * Sesuai konsep baru:
             * kembali ke halaman awal fitur Navigasi.
             */

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



    /* =====================================================
       SHOW DESTINATION 3D
       ===================================================== */

    function showDestinationIn3D() {

        const destination =
            state.destination;


        if (!destination) {

            toast(
                "Tujuan belum dipilih."
            );

            return;

        }


        const buildingId =
            destination.buildingId
            ||
            destination.id;


        const building =
            getBuildingById(
                buildingId
            );


        if (!building) {

            toast(
                "Model gedung belum tersedia."
            );

            return;

        }


        let model;


        /*
         * Ruangan -> prioritaskan Indoor.
         * Gedung -> default model.
         */

        if (
            destination.type
            ===
            "room"
        ) {

            model =
                building.models.find(
                    function (item) {

                        return (
                            item.id
                            ===
                            "indoor"
                        );

                    }
                );

        }


        if (!model) {

            model =
                getDefaultModelVariant(
                    building.id
                );

        }


        if (!model) {

            return;

        }


        showPage(
            "viewer"
        );


        if (
            viewerBuildingSelect
        ) {

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


        if (variantSelect) {

            variantSelect.value =
                model.id;

        }


        display3DModel(

            building.id,

            model.id

        );


        /*
         * MARKER 3D.
         *
         * Belum ditempatkan sampai koordinat XYZ
         * ruangan benar-benar diberikan.
         */

        const hotspot =
            byId(
                "destination3DHotspot"
            );


        if (
            hotspot
            &&
            destination.modelMarker
        ) {

            const marker =
                destination.modelMarker;


            hotspot.dataset.position =

                marker.x
                +
                "m "
                +
                marker.y
                +
                "m "
                +
                marker.z
                +
                "m";


            setText(
                "destination3DLabel",
                destination.name
            );


            show(
                "destination3DHotspot"
            );

        }

        else {

            hide(
                "destination3DHotspot"
            );


            if (
                destination.type
                ===
                "room"
            ) {

                setText(

                    "viewerMessage",

                    "Model gedung berhasil dibuka. Marker tepat ruangan akan aktif setelah koordinat 3D ruangan dimasukkan."

                );

            }

        }

    }


    listen(
        "showDestination3D",
        "click",
        showDestinationIn3D
    );



    /* =====================================================
       FEATURE NAVIGATION
       ===================================================== */

    function openViewer() {

        showPage(
            "viewer"
        );

    }


    function openAR() {

        showPage(
            "ar"
        );

    }


    function openNavigation() {

        openNavigationWithDestination(
            null
        );

    }


    function openDirectory() {

        showPage(
            "directory"
        );

    }


    [
        "menu3D",
        "feature3D",
        "hero3DButton"
    ]
    .forEach(
        function (id) {

            listen(
                id,
                "click",
                openViewer
            );

        }
    );


    [
        "menuAR",
        "featureAR",
        "heroARButton"
    ]
    .forEach(
        function (id) {

            listen(
                id,
                "click",
                openAR
            );

        }
    );


    [
        "menuNavigation",
        "featureNav",
        "heroNavigationButton"
    ]
    .forEach(
        function (id) {

            listen(
                id,
                "click",
                openNavigation
            );

        }
    );


    [
        "menuDirectory",
        "featureDirectory",
        "heroDirectoryButton"
    ]
    .forEach(
        function (id) {

            listen(
                id,
                "click",
                openDirectory
            );

        }
    );



    /* =====================================================
       TOAST
       ===================================================== */

    let toastTimer =
        null;


    function toast(message) {

        const element =
            byId(
                "toast"
            );


        if (!element) {
            return;
        }


        element.textContent =
            message;


        element.classList.add(
            "show"
        );


        if (toastTimer) {

            clearTimeout(
                toastTimer
            );

        }


        toastTimer =
            setTimeout(
                function () {

                    element.classList.remove(
                        "show"
                    );

                },
                2600
            );

    }



    /* =====================================================
       ESCAPE
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key
                !==
                "Escape"
            ) {

                return;

            }


            closeDrawer();


            if (
                state.currentPage
                !==
                "home"
            ) {

                goBack();

            }

        }
    );



    /* =====================================================
       STARTUP DIAGNOSTIC
       ===================================================== */

    console.log(
        "FT UISU Explorer Revision 30 FIX loaded."
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
        "Navigation nodes:",
        Object.keys(
            mapNodes
        ).length
    );


    if (!window.FT_DATA) {

        console.error(
            "map-data.js tidak berhasil dimuat."
        );


        toast(
            "Database map-data.js gagal dimuat, tetapi menu website tetap dapat digunakan."
        );

    }


    /*
     * Pastikan Home aktif pertama kali.
     */

    showPage(
        "home",
        false
    );


    showSlide(0);

})();
