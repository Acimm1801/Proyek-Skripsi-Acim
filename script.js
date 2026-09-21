/* =========================================================
   FT UISU EXPLORER • REVISI 25

   Lokasi utama:
   ./data/map-data.js

   Fallback:
   ./map-data.js

   Tujuan fallback:
   jika map-data salah lokasi, seluruh UI dasar
   tidak ikut mati.
========================================================= */

let mapDataModule = null;


try {

  mapDataModule =
    await import(
      "./data/map-data.js?v=25.1"
    );

} catch (firstError) {

  console.warn(
    "map-data.js tidak ditemukan di ./data/. Mencoba folder utama...",
    firstError
  );


  try {

    mapDataModule =
      await import(
        "./map-data.js?v=25.1"
      );

  } catch (secondError) {

    console.error(
      "map-data.js gagal dimuat dari kedua lokasi.",
      secondError
    );

  }

}


const MAP_WIDTH =
  mapDataModule?.MAP_WIDTH ??
  1400;


const MAP_HEIGHT =
  mapDataModule?.MAP_HEIGHT ??
  787;


const buildings =
  mapDataModule?.buildings ??
  [];


const rooms =
  mapDataModule?.rooms ??
  [];


const routeNodes =
  mapDataModule?.routeNodes ??
  {};


const routeEdges =
  mapDataModule?.routeEdges ??
  [];


const models3D =
  mapDataModule?.models3D ??
  [];


const getBuildingById =
  mapDataModule?.getBuildingById ??
  (
    (id) => {

      return buildings.find(
        (building) =>
          building.id === id
      ) || null;

    }
  );


const getModelsByBuildingId =
  mapDataModule?.getModelsByBuildingId ??
  (
    (buildingId) => {

      return models3D.filter(
        (model) =>
          model.buildingId ===
          buildingId
      );

    }
  );


const $ =
  (selector) =>
    document.querySelector(
      selector
    );


const $$ =
  (selector) =>
    [
      ...document.querySelectorAll(
        selector
      )
    ];


/* =========================================================
   STATE
========================================================= */

const state = {

  currentSlide:0,

  globalSelection:null,

  infoLocation:null,

  destination:null,

  clickedPosition:null,

  routeResult:null,

  cameraStream:null

};


/* =========================================================
   LOCATION DATABASE
========================================================= */

const locations =
  [];


/* BUILDINGS */

buildings.forEach(
  (building) => {

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


/* ROOMS */

rooms.forEach(
  (room) => {

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
        }` +
        `${
          room.floor
            ? `, lantai ${room.floor}`
            : ""
        }. ` +
        "Detail penanggung jawab, fungsi, dan letak spesifik ruangan akan dilengkapi kemudian."

    });

  }
);


/* =========================================================
   SEARCH
========================================================= */

function normalizeText(
  value
) {

  return String(
    value || ""
  )
    .toLowerCase()
    .trim();

}


function searchLocations(
  value
) {

  const query =
    normalizeText(
      value
    );


  if (!query) {
    return [];
  }


  return locations

    .filter(
      (location) =>

        normalizeText(
          `${location.name} ${location.parent}`
        )
          .includes(
            query
          )

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
) {

  container.innerHTML =
    "";


  if (
    !results.length
  ) {

    container.innerHTML = `
      <div class="search-empty">
        Lokasi tidak ditemukan.
      </div>
    `;


    container
      .classList
      .remove(
        "hidden"
      );


    return;

  }


  results.forEach(
    (location) => {

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
                ? ` • Lantai ${location.floor}`
                : ""
            }
          </small>

        </span>

        <span class="search-type">

          ${
            location.type ===
            "building"
              ? "Gedung"
              : "Ruangan"
          }

        </span>

      `;


      button.addEventListener(
        "click",
        () =>
          onSelect(
            location
          )
      );


      container.appendChild(
        button
      );

    }
  );


  container
    .classList
    .remove(
      "hidden"
    );

}


/* =========================================================
   PAGE & DRAWER
========================================================= */

function openDrawer() {

  $("#drawer")
    .classList
    .add(
      "open"
    );


  $("#drawerOverlay")
    .classList
    .add(
      "show"
    );


  document.body.style.overflow =
    "hidden";

}


function closeDrawer() {

  $("#drawer")
    .classList
    .remove(
      "open"
    );


  $("#drawerOverlay")
    .classList
    .remove(
      "show"
    );


  document.body.style.overflow =
    "";

}


function showPage(
  pageName
) {

  $$(".page")
    .forEach(
      (page) => {

        page
          .classList
          .remove(
            "active"
          );

      }
    );


  const target =
    $(
      `#${pageName}Page`
    );


  if (target) {

    target
      .classList
      .add(
        "active"
      );

  }


  $$(".header-link")
    .forEach(
      (button) => {

        button
          .classList
          .toggle(

            "active",

            button.dataset.page ===
              pageName

          );

      }
    );


  if (
    pageName !==
    "arNavigation"
  ) {

    stopNavigationCamera();

  }


  closeDrawer();


  window.scrollTo({

    top:0,

    behavior:"smooth"

  });

}


/* HEADER / DRAWER */

$("#hamburgerButton")
  ?.addEventListener(
    "click",
    openDrawer
  );


$("#closeDrawer")
  ?.addEventListener(
    "click",
    closeDrawer
  );


$("#drawerOverlay")
  ?.addEventListener(
    "click",
    closeDrawer
  );


$("#logoHome")
  ?.addEventListener(
    "click",
    () =>
      showPage(
        "home"
      )
  );


$$('[data-page]')
  .forEach(
    (button) => {

      button
        .addEventListener(
          "click",
          () =>
            showPage(
              button.dataset.page
            )
        );

    }
  );


/* =========================================================
   HOME SLIDER
   AUTO 20 DETIK
========================================================= */

const slides =
  $$(".hero-slide");


let sliderTimer;


function showSlide(
  index
) {

  if (
    !slides.length
  ) {
    return;
  }


  index =
    (
      index +
      slides.length
    ) %
    slides.length;


  state.currentSlide =
    index;


  slides.forEach(
    (
      slide,
      slideIndex
    ) => {

      slide
        .classList
        .toggle(

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

        dot
          .classList
          .toggle(

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


  if (
    slides.length <=
    1
  ) {
    return;
  }


  sliderTimer =
    setInterval(

      () =>
        showSlide(
          state.currentSlide + 1
        ),

      20000

    );

}


$("#nextSlide")
  ?.addEventListener(
    "click",
    () => {

      showSlide(
        state.currentSlide + 1
      );


      restartSlider();

    }
  );


$("#prevSlide")
  ?.addEventListener(
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
    (dot) => {

      dot
        .addEventListener(
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


/* =========================================================
   GLOBAL SEARCH
========================================================= */

$("#globalSearch")
  ?.addEventListener(
    "input",
    (event) => {

      const value =
        event.target.value;


      state.globalSelection =
        null;


      $("#globalSelected")
        ?.classList
        .add(
          "hidden"
        );


      if (
        !value
      ) {

        $("#globalSearchResults")
          ?.classList
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

        (location) => {

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


          $("#globalSelected")
            .classList
            .remove(
              "hidden"
            );

        }

      );

    }
  );


$("#clearGlobalSearch")
  ?.addEventListener(
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


      $("#globalSelected")
        .classList
        .add(
          "hidden"
        );

    }
  );


$("#globalInfoButton")
  ?.addEventListener(
    "click",
    () => {

      if (
        state.globalSelection
      ) {

        openInfo(
          state.globalSelection
        );

      }

    }
  );


$("#globalNavButton")
  ?.addEventListener(
    "click",
    () => {

      if (
        state.globalSelection
      ) {

        openNavigationWithDestination(
          state.globalSelection
        );

      }

    }
  );


/* =========================================================
   INFO MODAL
========================================================= */

function openInfo(
  location
) {

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
    location.description ||
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
    ?.classList
    .add(
      "hidden"
    );


  document.body.style.overflow =
    "";

}


$("#closeInfoModal")
  ?.addEventListener(
    "click",
    closeInfo
  );


$("#infoBackdrop")
  ?.addEventListener(
    "click",
    closeInfo
  );


$("#infoNavigationButton")
  ?.addEventListener(
    "click",
    () => {

      if (
        !state.infoLocation
      ) {
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
   3D & AR BUILDING SELECTORS
   REVISI 25
========================================================= */

function populateBuildingSelect(
  selectElement
) {

  if (
    !selectElement
  ) {
    return;
  }


  selectElement.innerHTML = `
    <option value="">
      -- Pilih Gedung --
    </option>
  `;


  buildings.forEach(
    (building) => {

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
  $("#viewerBuildingSelect")
);


populateBuildingSelect(
  $("#arBuildingSelect")
);


let active3DModelIndex =
  0;


let activeARModel =
  null;


/* =========================================================
   BUTTON LABEL
========================================================= */

function getModelButtonLabel(
  model,
  mode
) {

  const buildingModels =
    getModelsByBuildingId(
      model.buildingId
    );


  /*
    Biro & Perkuliahan:
    punya 2 tombol Indoor / Outdoor.

    Tiga gedung lain:
    satu tombol Objek.
  */

  if (
    buildingModels.length >
    1
  ) {

    return mode ===
      "ar"

      ? `Tampilkan AR ${model.label}`

      : `Tampilkan 3D ${model.label}`;

  }


  return mode ===
    "ar"

    ? "Tampilkan AR Objek"

    : "Tampilkan 3D Objek";

}


/* =========================================================
   CREATE MODEL CHOICE BUTTONS
========================================================= */

function renderModelChoiceButtons(
  buildingId,
  container,
  mode
) {

  if (
    !container
  ) {
    return;
  }


  container.innerHTML =
    "";


  if (
    !buildingId
  ) {
    return;
  }


  const buildingModels =
    getModelsByBuildingId(
      buildingId
    );


  buildingModels.forEach(
    (model) => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "button button-primary model-choice-button";


      button.textContent =
        getModelButtonLabel(
          model,
          mode
        );


      button.addEventListener(
        "click",
        () => {

          if (
            mode ===
            "ar"
          ) {

            openARModel(
              model.id
            );

          } else {

            open3DModel(
              model.id
            );

          }

        }
      );


      container.appendChild(
        button
      );

    }
  );

}


/* =========================================================
   3D SLIDER
========================================================= */

function show3DModelAt(
  index
) {

  if (
    !models3D.length
  ) {

    toast(
      "Database model 3D belum berhasil dimuat."
    );

    return;

  }


  const total =
    models3D.length;


  active3DModelIndex =
    (
      index +
      total
    ) %
    total;


  const model =
    models3D[
      active3DModelIndex
    ];


  const viewer =
    $("#mainModelViewer");


  const unavailable =
    $("#viewerUnavailable");


  $("#viewerTitle")
    .textContent =
    model.title;


  $("#viewerCounter")
    .textContent =
    `${active3DModelIndex + 1} / ${total}`;


  $("#viewerCard")
    .classList
    .remove(
      "hidden"
    );


  /* MODEL TERSEDIA */

  if (
    model.path
  ) {

    $("#viewerMessage")
      .textContent =
      "";


    unavailable
      .classList
      .add(
        "hidden"
      );


    viewer
      .classList
      .remove(
        "model-hidden"
      );


    viewer
      .setAttribute(
        "src",
        model.path
      );


  /* MODEL BELUM ADA */

  } else {

    viewer
      .removeAttribute(
        "src"
      );


    viewer
      .classList
      .add(
        "model-hidden"
      );


    unavailable
      .classList
      .remove(
        "hidden"
      );


    $("#viewerMessage")
      .textContent =
      `${model.title} belum tersedia.`;

  }

}


/* OPEN MODEL DIRECT */

function open3DModel(
  modelId
) {

  const index =
    models3D.findIndex(
      (model) =>
        model.id ===
        modelId
    );


  if (
    index <
    0
  ) {
    return;
  }


  show3DModelAt(
    index
  );


  requestAnimationFrame(
    () => {

      $("#viewerCard")
        ?.scrollIntoView({

          behavior:"smooth",

          block:"start"

        });

    }
  );

}


/* SELECT BUILDING */

$("#viewerBuildingSelect")
  ?.addEventListener(
    "change",
    (event) => {

      $("#viewerMessage")
        .textContent =
        "";


      $("#viewerCard")
        .classList
        .add(
          "hidden"
        );


      $("#mainModelViewer")
        .removeAttribute(
          "src"
        );


      $("#mainModelViewer")
        .classList
        .remove(
          "model-hidden"
        );


      $("#viewerUnavailable")
        .classList
        .add(
          "hidden"
        );


      renderModelChoiceButtons(

        event.target.value,

        $("#viewerModelActions"),

        "3d"

      );

    }
  );


/* PREVIOUS */

$("#previous3DModel")
  ?.addEventListener(
    "click",
    () => {

      show3DModelAt(
        active3DModelIndex - 1
      );

    }
  );


/* NEXT */

$("#next3DModel")
  ?.addEventListener(
    "click",
    () => {

      show3DModelAt(
        active3DModelIndex + 1
      );

    }
  );


/* =========================================================
   AR MARKERLESS
========================================================= */

function openARModel(
  modelId
) {

  const model =
    models3D.find(
      (item) =>
        item.id ===
        modelId
    );


  if (
    !model
  ) {
    return;
  }


  const viewer =
    $("#mainARViewer");


  if (
    !model.path
  ) {

    activeARModel =
      null;


    viewer
      .removeAttribute(
        "src"
      );


    $("#arMessage")
      .textContent =
      `${model.title} belum tersedia untuk AR.`;


    $("#arCard")
      .classList
      .add(
        "hidden"
      );


    return;

  }


  activeARModel =
    model;


  $("#arMessage")
    .textContent =
    "";


  viewer
    .setAttribute(
      "src",
      model.path
    );


  $("#mainARStatus")
    .textContent =
    `Siap menampilkan ${model.title}`;


  $("#arCard")
    .classList
    .remove(
      "hidden"
    );


  requestAnimationFrame(
    () => {

      $("#arCard")
        ?.scrollIntoView({

          behavior:"smooth",

          block:"start"

        });

    }
  );

}


$("#arBuildingSelect")
  ?.addEventListener(
    "change",
    (event) => {

      activeARModel =
        null;


      $("#mainARViewer")
        .removeAttribute(
          "src"
        );


      $("#arMessage")
        .textContent =
        "";


      $("#arCard")
        .classList
        .add(
          "hidden"
        );


      renderModelChoiceButtons(

        event.target.value,

        $("#arModelActions"),

        "ar"

      );

    }
  );


$("#launchMainAR")
  ?.addEventListener(
    "click",
    async () => {

      if (
        !activeARModel
      ) {

        toast(
          "Pilih model AR yang tersedia terlebih dahulu."
        );

        return;

      }


      const viewer =
        $("#mainARViewer");


      if (
        typeof viewer?.activateAR !==
        "function"
      ) {

        toast(
          "Fitur AR belum siap pada browser/perangkat ini."
        );

        return;

      }


      try {

        await viewer.activateAR();

      } catch (error) {

        console.error(
          error
        );


        toast(
          "AR utama belum dapat dibuka pada perangkat ini."
        );

      }

    }
  );


/* =========================================================
   ROUTING ENGINE
========================================================= */

function pointDistance(
  a,
  b
) {

  return Math.hypot(
    a.x - b.x,
    a.y - b.y
  );

}


function pointsEqual(
  a,
  b,
  epsilon = .5
) {

  return (
    pointDistance(
      a,
      b
    ) <= epsilon
  );

}


function polylineLength(
  points
) {

  let total =
    0;


  for (
    let i = 0;
    i < points.length - 1;
    i += 1
  ) {

    total +=
      pointDistance(
        points[i],
        points[i + 1]
      );

  }


  return total;

}


/* =========================================================
   ROUTING EDGE PREPARATION
========================================================= */

const routingEdges =
  routeEdges.map(
    (edge) => {

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


      for (
        let i = 0;
        i < points.length - 1;
        i += 1
      ) {

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

    }
  );


const edgeById =
  new Map(

    routingEdges.map(
      (edge) => [

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
    (nodeId) => {

      routeGraph[
        nodeId
      ] =
        [];

    }
  );


routingEdges.forEach(
  (edge) => {

    if (
      !routeGraph[
        edge.from
      ]
    ) {

      routeGraph[
        edge.from
      ] =
        [];

    }


    if (
      !routeGraph[
        edge.to
      ]
    ) {

      routeGraph[
        edge.to
      ] =
        [];

    }


    routeGraph[
      edge.from
    ]
      .push({

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


/* =========================================================
   PROJECT POINT TO SEGMENT
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
    abX * abX +
    abY * abY;


  let t =
    lengthSquared ===
    0

      ? 0

      :
      (
        apX * abX +
        apY * abY
      ) /
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


/* =========================================================
   SNAP POINT TO NETWORK
========================================================= */

function snapPointToNetwork(
  point
) {

  let best =
    null;


  routingEdges.forEach(
    (edge) => {

      for (
        let i = 0;
        i < edge.points.length - 1;
        i += 1
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
          pointDistance(
            a,
            b
          );


        const along =
          edge.cumulative[i] +
          segmentLength *
          projection.t;


        if (
          !best ||
          projection.distance <
          best.distance
        ) {

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
) {

  const distances =
    {};


  const previousNode =
    {};


  const previousEdge =
    {};


  const nodeIds =
    Object.keys(
      routeNodes
    );


  const unvisited =
    new Set(
      nodeIds
    );


  nodeIds.forEach(
    (nodeId) => {

      distances[nodeId] =
        Infinity;


      previousNode[nodeId] =
        null;


      previousEdge[nodeId] =
        null;

    }
  );


  if (
    !(startNode in distances) ||
    !(targetNode in distances)
  ) {

    return null;

  }


  distances[
    startNode
  ] =
    0;


  while (
    unvisited.size
  ) {

    let current =
      null;


    let smallest =
      Infinity;


    unvisited.forEach(
      (nodeId) => {

        if (
          distances[
            nodeId
          ] <
          smallest
        ) {

          smallest =
            distances[
              nodeId
            ];


          current =
            nodeId;

        }

      }
    );


    if (
      current ===
      null
    ) {
      break;
    }


    if (
      current ===
      targetNode
    ) {
      break;
    }


    unvisited.delete(
      current
    );


    (
      routeGraph[
        current
      ] || []
    )
      .forEach(
        (connection) => {

          if (
            !unvisited.has(
              connection.node
            )
          ) {
            return;
          }


          const candidate =
            distances[
              current
            ] +
            connection.weight;


          if (
            candidate <
            distances[
              connection.node
            ]
          ) {

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


  if (
    !Number.isFinite(
      distances[
        targetNode
      ]
    )
  ) {

    return null;

  }


  const nodePath =
    [];


  const edgePath =
    [];


  let cursor =
    targetNode;


  while (
    cursor
  ) {

    nodePath.unshift(
      cursor
    );


    if (
      cursor ===
      startNode
    ) {
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


  if (
    nodePath[0] !==
    startNode
  ) {

    return null;

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
   POLYLINE UTILITIES
========================================================= */

function dedupePolyline(
  points
) {

  const output =
    [];


  points.forEach(
    (point) => {

      if (
        !output.length ||
        !pointsEqual(
          output[
            output.length - 1
          ],
          point
        )
      ) {

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
) {

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


  if (
    endpointNode ===
    edge.from
  ) {

    result.push(
      points[i]
    );


    for (
      let j = i - 1;
      j >= 0;
      j -= 1
    ) {

      result.push(
        points[j]
      );

    }


  } else {

    result.push(
      points[i + 1]
    );


    for (
      let j = i + 2;
      j < points.length;
      j += 1
    ) {

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
) {

  return snapToEndpointPolyline(
    snap,
    endpointNode
  )
    .reverse();

}


function sameEdgePolyline(
  startSnap,
  targetSnap
) {

  const edge =
    startSnap.edge;


  const points =
    edge.points;


  const result = [

    {
      ...startSnap.point
    }

  ];


  if (
    startSnap.along <=
    targetSnap.along
  ) {

    for (
      let j =
        startSnap.segmentIndex + 1;

      j <=
        targetSnap.segmentIndex;

      j += 1
    ) {

      result.push(
        points[j]
      );

    }


  } else {

    for (
      let j =
        startSnap.segmentIndex;

      j >
        targetSnap.segmentIndex;

      j -= 1
    ) {

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


function middlePolyline(
  dijkstraResult
) {

  if (
    !dijkstraResult ||
    !dijkstraResult.edgePath.length
  ) {

    return [];

  }


  const output =
    [];


  dijkstraResult.edgePath
    .forEach(
      (
        edgeId,
        index
      ) => {

        const edge =
          edgeById.get(
            edgeId
          );


        if (
          !edge
        ) {
          return;
        }


        const fromNode =
          dijkstraResult
            .nodePath[
              index
            ];


        let points =
          edge.from ===
          fromNode

            ? edge.points

            : [
                ...edge.points
              ]
                .reverse();


        if (
          output.length
        ) {

          points =
            points.slice(
              1
            );

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


/* =========================================================
   ROUTE BETWEEN SNAPS
========================================================= */

function routeBetweenSnaps(
  startSnap,
  targetSnap
) {

  const candidates =
    [];


  if (
    startSnap.edge.id ===
    targetSnap.edge.id
  ) {

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
    (startNode) => {

      targetEndpoints.forEach(
        (targetNode) => {

          const middle =
            dijkstra(
              startNode,
              targetNode
            );


          if (
            !middle
          ) {
            return;
          }


          const startDistance =

            startNode ===
            startSnap.edge.from

              ? startSnap.distanceToFrom

              : startSnap.distanceToTo;


          const targetDistance =

            targetNode ===
            targetSnap.edge.from

              ? targetSnap.distanceToFrom

              : targetSnap.distanceToTo;


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
              startDistance +
              middle.distance +
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
    )[0] || null;

}


/* =========================================================
   BEST ENTRANCE
========================================================= */

function findBestEntranceRoute(
  clickedPosition,
  building
) {

  if (
    !building?.entrances?.length
  ) {

    return null;

  }


  const startSnap =
    snapPointToNetwork(
      clickedPosition
    );


  if (
    !startSnap
  ) {

    return null;

  }


  let best =
    null;


  building.entrances
    .forEach(
      (entrance) => {

        const targetSnap =
          snapPointToNetwork(
            entrance
          );


        if (
          !targetSnap
        ) {
          return;
        }


        const networkRoute =
          routeBetweenSnaps(
            startSnap,
            targetSnap
          );


        if (
          !networkRoute
        ) {
          return;
        }


        const totalDistance =

          pointDistance(
            clickedPosition,
            startSnap.point
          )

          +

          networkRoute.distance

          +

          pointDistance(
            targetSnap.point,
            entrance
          );


        const points =
          dedupePolyline([

            clickedPosition,

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
            totalDistance,

          points

        };


        if (
          !best ||
          candidate.distance <
          best.distance
        ) {

          best =
            candidate;

        }

      }
    );


  return best;

}


/* =========================================================
   NAVIGATION FLOW
========================================================= */

function getDestinationBuilding() {

  if (
    !state.destination
  ) {

    return null;

  }


  return getBuildingById(
    state.destination.buildingId
  );

}


function setElementPosition(
  element,
  point
) {

  if (
    !element ||
    !point
  ) {
    return;
  }


  element.style.left =
    `${
      (
        point.x /
        MAP_WIDTH
      ) *
      100
    }%`;


  element.style.top =
    `${
      (
        point.y /
        MAP_HEIGHT
      ) *
      100
    }%`;

}


function updateProgress(
  stage
) {

  const steps = [

    "stepTarget",

    "stepPosition",

    "stepRoute",

    "stepAR"

  ];


  steps.forEach(
    (
      id,
      index
    ) => {

      $(`#${id}`)
        ?.classList
        .toggle(

          "active",

          index <=
            stage

        );

    }
  );

}


function clearRouteOnly() {

  state.clickedPosition =
    null;


  state.routeResult =
    null;


  $("#activeRoute")
    ?.setAttribute(
      "points",
      ""
    );


  $("#userMarker")
    ?.classList
    .add(
      "hidden"
    );


  $("#entranceMarker")
    ?.classList
    .add(
      "hidden"
    );


  $("#resetPosition")
    ?.classList
    .add(
      "hidden"
    );


  $("#routeFoundBox")
    ?.classList
    .add(
      "hidden"
    );


  if (
    $("#positionStatus")
  ) {

    $("#positionStatus")
      .textContent =
      "Belum dipilih";

  }


  if (
    $("#routeStatus")
  ) {

    $("#routeStatus")
      .textContent =
      "Menunggu posisi";

  }


  if (
    $("#mapHeadingTitle")
  ) {

    $("#mapHeadingTitle")
      .textContent =
      "Tandai posisi Anda sekarang";

  }


  if (
    $("#mapInstruction")
  ) {

    $("#mapInstruction")
      .textContent =
      "Tap pada denah sesuai posisi Anda saat ini.";

  }


  updateProgress(
    state.destination
      ? 1
      : 0
  );

}


function resetNavigation() {

  state.destination =
    null;


  if (
    $("#navigationSearch")
  ) {

    $("#navigationSearch").value =
      "";

  }


  if (
    $("#navigationSearchResults")
  ) {

    $("#navigationSearchResults")
      .innerHTML = `
        <div class="search-empty">
          Ketik nama gedung atau ruangan tujuan.
        </div>
      `;

  }


  $("#selectedDestination")
    ?.classList
    .add(
      "hidden"
    );


  $("#mapSection")
    ?.classList
    .add(
      "hidden"
    );


  $("#destinationHighlight")
    ?.classList
    .add(
      "hidden"
    );


  clearRouteOnly();


  updateProgress(
    0
  );

}


function selectNavigationDestination(
  location
) {

  state.destination =
    location;


  $("#navigationSearch").value =
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
    .remove(
      "hidden"
    );


  const building =
    getDestinationBuilding();


  if (
    !building
  ) {

    toast(
      "Data gedung tujuan tidak ditemukan."
    );

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
    .remove(
      "hidden"
    );


  $("#mapSection")
    .classList
    .remove(
      "hidden"
    );


  clearRouteOnly();


  updateProgress(
    1
  );


  setTimeout(
    () => {

      $("#mapSection")
        ?.scrollIntoView({

          behavior:"smooth",

          block:"start"

        });

    },

    120
  );

}


function openNavigationWithDestination(
  location = null
) {

  showPage(
    "navigation"
  );


  resetNavigation();


  if (
    location
  ) {

    selectNavigationDestination(
      location
    );


  } else {

    setTimeout(
      () => {

        $("#navigationSearch")
          ?.focus();

      },

      180
    );

  }

}


/* =========================================================
   NAVIGATION SEARCH
========================================================= */

$("#navigationSearch")
  ?.addEventListener(
    "input",
    (event) => {

      const value =
        event.target.value;


      if (
        !value
      ) {

        $("#navigationSearchResults")
          .innerHTML = `
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

        $("#navigationSearchResults"),

        selectNavigationDestination

      );

    }
  );


/* =========================================================
   MAP POINTER
========================================================= */

$("#navigationMap")
  ?.addEventListener(
    "pointerdown",
    (event) => {

      const building =
        getDestinationBuilding();


      if (
        !building
      ) {

        toast(
          "Pilih tujuan terlebih dahulu."
        );

        return;

      }


      if (
        !routingEdges.length
      ) {

        toast(
          "Data jalur navigasi belum tersedia."
        );

        return;

      }


      const map =
        $("#navigationMap");


      const rect =
        map.getBoundingClientRect();


      const clicked = {

        x:
          (
            (
              event.clientX -
              rect.left
            ) /
            rect.width
          )
          *
          MAP_WIDTH,

        y:
          (
            (
              event.clientY -
              rect.top
            ) /
            rect.height
          )
          *
          MAP_HEIGHT

      };


      state.clickedPosition =
        clicked;


      setElementPosition(
        $("#userMarker"),
        clicked
      );


      $("#userMarker")
        .classList
        .remove(
          "hidden"
        );


      const routeResult =
        findBestEntranceRoute(
          clicked,
          building
        );


      if (
        !routeResult
      ) {

        toast(
          "Rute tidak ditemukan dari posisi tersebut."
        );

        return;

      }


      state.routeResult =
        routeResult;


      setElementPosition(
        $("#entranceMarker"),
        routeResult.entrance
      );


      $("#entranceLabel")
        .textContent =
        `Entrance ${building.shortName}`;


      $("#entranceMarker")
        .classList
        .remove(
          "hidden"
        );


      const pointsText =

        routeResult.points

          .map(
            (point) =>
              `${point.x.toFixed(1)},${point.y.toFixed(1)}`
          )

          .join(
            " "
          );


      $("#activeRoute")
        .setAttribute(
          "points",
          pointsText
        );


      $("#positionStatus")
        .textContent =
        "Posisi dipilih";


      $("#routeStatus")
        .textContent =
        "Rute Ditemukan";


      $("#mapHeadingTitle")
        .textContent =
        "Rute menuju tujuan";


      $("#mapInstruction")
        .textContent =
        `Rute aktif menuju entrance ${building.shortName}.`;


      $("#resetPosition")
        .classList
        .remove(
          "hidden"
        );


      $("#routeFoundBox")
        .classList
        .remove(
          "hidden"
        );


      updateProgress(
        2
      );

    }
  );


$("#resetPosition")
  ?.addEventListener(
    "click",
    clearRouteOnly
  );


/* =========================================================
   AR NAVIGATION
========================================================= */

function calculateInitialArrowRotation(
  points
) {

  if (
    !points ||
    points.length <
    2
  ) {

    return 0;

  }


  const start =
    points[0];


  let next =
    points[1];


  for (
    let i = 1;
    i < points.length;
    i += 1
  ) {

    if (
      pointDistance(
        start,
        points[i]
      ) >
      12
    ) {

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


async function startNavigationCamera() {

  const video =
    $("#navigationCamera");


  if (
    $("#cameraStatus")
  ) {

    $("#cameraStatus")
      .textContent =
      "Meminta izin kamera...";

  }


  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    if (
      $("#cameraStatus")
    ) {

      $("#cameraStatus")
        .textContent =
        "Browser tidak mendukung akses kamera.";

    }

    return;

  }


  try {

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


    $("#cameraStatus")
      .textContent =
      "Kamera aktif • HUD navigasi siap";


  } catch (error) {

    console.error(
      error
    );


    $("#cameraStatus")
      .textContent =
      "Kamera gagal dibuka. Periksa izin kamera browser.";

  }

}


function stopNavigationCamera() {

  if (
    state.cameraStream
  ) {

    state.cameraStream
      .getTracks()
      .forEach(
        (track) =>
          track.stop()
      );


    state.cameraStream =
      null;

  }


  const video =
    $("#navigationCamera");


  if (
    video
  ) {

    video.srcObject =
      null;

  }

}


$("#openARNavigation")
  ?.addEventListener(
    "click",
    async () => {

      if (
        !state.routeResult ||
        !state.destination
      ) {

        return;

      }


      const building =
        getDestinationBuilding();


      if (
        !building
      ) {
        return;
      }


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


      updateProgress(
        3
      );


      showPage(
        "arNavigation"
      );


      await startNavigationCamera();

    }
  );


$("#closeARNavigation")
  ?.addEventListener(
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
) {

  if (
    !container
  ) {
    return;
  }


  container.innerHTML =
    "";


  if (
    !roomList.length
  ) {

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
    (room) => {

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
            type="button">

            Informasi

          </button>

          <button
            class="room-nav-button"
            type="button">

            Petunjuk Arah

          </button>

        </div>

      `;


      const actions =
        item.querySelector(
          ".room-actions"
        );


      item
        .querySelector(
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


      const location =
        locations.find(
          (candidate) =>
            candidate.id ===
            room.id
        );


      item
        .querySelector(
          ".room-info-button"
        )
        ?.addEventListener(
          "click",
          () => {

            if (
              location
            ) {

              openInfo(
                location
              );

            }

          }
        );


      item
        .querySelector(
          ".room-nav-button"
        )
        ?.addEventListener(
          "click",
          () => {

            if (
              location
            ) {

              openNavigationWithDestination(
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


/* LAB FLOORS */

function renderLaboratory(
  buildingRooms,
  container
) {

  if (
    !container
  ) {
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


  [
    1,
    2,
    3
  ]
    .forEach(
      (floor) => {

        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.className =
          `floor-button${
            floor === 1
              ? " active"
              : ""
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
              .forEach(
                (item) => {

                  item
                    .classList
                    .remove(
                      "active"
                    );

                }
              );


            button
              .classList
              .add(
                "active"
              );


            renderRoomList(

              buildingRooms.filter(
                (room) =>
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


  renderRoomList(

    buildingRooms.filter(
      (room) =>
        room.floor ===
        1
    ),

    roomArea

  );

}


/* DIRECTORY BUILDINGS */

function renderDirectory() {

  const container =
    $("#directoryContainer");


  if (
    !container
  ) {
    return;
  }


  container.innerHTML =
    "";


  buildings.forEach(
    (
      building,
      index
    ) => {

      const buildingRooms =
        rooms.filter(
          (room) =>
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
          type="button">

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


      if (
        building.id ===
        "laboratorium-ft"
      ) {

        renderLaboratory(
          buildingRooms,
          content
        );


      } else {

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
   MAIN BUTTON BINDINGS
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


/* 3D */

$("#menu3D")
  ?.addEventListener(
    "click",
    openViewer
  );


$("#feature3D")
  ?.addEventListener(
    "click",
    openViewer
  );


$("#hero3DButton")
  ?.addEventListener(
    "click",
    openViewer
  );


/* AR */

$("#menuAR")
  ?.addEventListener(
    "click",
    openAR
  );


$("#featureAR")
  ?.addEventListener(
    "click",
    openAR
  );


/* NAVIGATION */

$("#menuNavigation")
  ?.addEventListener(
    "click",
    openNavigation
  );


$("#featureNav")
  ?.addEventListener(
    "click",
    openNavigation
  );


$("#heroNavigationButton")
  ?.addEventListener(
    "click",
    openNavigation
  );


$("#heroNavigationButton2")
  ?.addEventListener(
    "click",
    openNavigation
  );


/* DIRECTORY */

$("#menuDirectory")
  ?.addEventListener(
    "click",
    openDirectory
  );


$("#featureDirectory")
  ?.addEventListener(
    "click",
    openDirectory
  );


$("#heroDirectoryButton")
  ?.addEventListener(
    "click",
    openDirectory
  );


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function toast(
  message
) {

  const element =
    $("#toast");


  if (
    !element
  ) {
    return;
  }


  element.textContent =
    message;


  element
    .classList
    .add(
      "show"
    );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () => {

        element
          .classList
          .remove(
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
  (event) => {

    if (
      event.key !==
      "Escape"
    ) {
      return;
    }


    closeDrawer();


    if (
      !$("#infoModal")
        ?.classList
        .contains(
          "hidden"
        )
    ) {

      closeInfo();

    }


    if (
      $("#arNavigationPage")
        ?.classList
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
