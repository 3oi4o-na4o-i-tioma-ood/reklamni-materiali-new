const mmPerInch = 25.4;

const editor = {
  getElements() {
    console.log("getElements. Side:", designRepo.selectedProductSide, "side:", designRepo.productSides[designRepo.selectedProductSide]);
    return designRepo.productSides[designRepo.selectedProductSide].elements;
  },
  setElements(elements) {
    console.trace("setElements. Side:", designRepo.selectedProductSide, "elements:", elements);
    designRepo.productSides[designRepo.selectedProductSide].elements = elements;
  },
  getImageUrl({ bgPath, bgImageId, modelColorId }) {
    if (bgPath) {
      return API.getImageUrlForEditor(editor.currentProduct, bgPath);
    }

    if (bgImageId) {
      return API.getEditorImageUrl(bgImageId);
    }

    if (modelColorId) {
      return API.getModelImage(modelColorId);
    }

    return null;
  },
  setBg({ bgPath, bgImageId, modelColorId }) {
    const bgUrl = editor.getImageUrl({ bgPath, bgImageId, modelColorId });

    designRepo.productSides[designRepo.selectedProductSide].bgUrl = bgUrl;
    designRepo.productSides[designRepo.selectedProductSide].bgPath = bgPath;
    designRepo.productSides[designRepo.selectedProductSide].bgImageId =
      bgImageId;

    renderElements.renderBG(bgUrl);
    bgTool.setCurrentBackground(bgUrl);
  },
  selectSide(index /* 0 - front; 1 - back */) {
    if (index !== 0 && index !== 1) {
      console.error("Nah. You can't choose side ", index);
      return;
    }

    if (index === 1 && !designRepo.productSides[1]) {
      designRepo.productSides[1] = {
        elements: editor._getInitialElements(),
        bgUrl: designRepo.productSides[0].bgUrl,
        bgPath: designRepo.productSides[0].bgPath,
        bgImageId: designRepo.productSides[0].bgImageId,
      };
    }

    editor.unselectElements();

    designRepo.selectedProductSide = index;

    renderElements.clear();

    const imgElements = editor
      .getElements()
      .filter((el) => el.type === "image");
    const textElements = editor
      .getElements()
      .filter((el) => el.type === "text");

    textTool.clearElements();
    textTool.renderElements(textElements);
    imageTool.renderImagesList(imgElements);

    const bgUrl = designRepo.productSides[designRepo.selectedProductSide].bgUrl;

    renderElements.renderBG(bgUrl);
    bgTool.setCurrentBackground(bgUrl);

    renderElements.renderTextElements(textElements);

    imgElements.forEach((imgEl) => {
      renderElements.renderImgElement(imgEl);
    });
  },

  // scale: 1,
  canvasPxPerProductMM: 0,
  currentProduct: null,
  selectedElementId: null,
  getSelectedElement() {
    return editor
      .getElements()
      .find((el) => el.id === editor.selectedElementId);
  },
  getCurrentProductDescription() {
    return products.find((p) => p.name === editor.currentProduct);
  },
  getCanvas() {
    return document.getElementById("editor-canvas");
  },
  getCanvasRect() {
    return editor.getCanvas().getBoundingClientRect();
  },
  getBoundaryInMM() {
    switch (editor.currentProduct) {
      case "BUSINESS_CARD":
      case "POCKET_CALENDAR": {
        return {
          left: 7,
          right: 7,
          top: 7,
          bottom: 7,
        };
      }
      case "PEN": {
        return {
          left: 30,
          right: 20,
          top: 13,
          bottom: 13,
        };
      }
      default: {
        return {
          left: 7,
          right: 7,
          top: 7,
          bottom: 7,
        };
      }
    }
  },
  getBoundaryInPx() {
    const inMM = editor.getBoundaryInMM();

    return {
      left: inMM.left * editor.canvasPxPerProductMM,
      right: inMM.right * editor.canvasPxPerProductMM,
      top: inMM.top * editor.canvasPxPerProductMM,
      bottom: inMM.bottom * editor.canvasPxPerProductMM,
    };
  },
  onResize(entries) {
    const canvasRect = editor.getCanvasRect();
    const productDescription = editor.getCurrentProductDescription();
    editor.canvasPxPerProductMM =
      canvasRect.width / productDescription.sizeMM.width;

    renderElements.rerenderElements(
      editor.getElements(),
      editor.canvasPxPerProductMM
    );
    renderElements.setBoundary(editor.getBoundaryInPx());

    const overlayedArea = document.getElementById("editor-overlayed-area");
    const overlayedAreaHeight = overlayedArea.getBoundingClientRect().height;

    const tools = document.querySelectorAll(".editor-tool");

    tools.forEach((tool) => {
      tool.style.height = overlayedAreaHeight + 30 + "px";
    });
  },
  updateElementTextOrDeleteElement(text) {
    if (!text?.length) {
      textTool.onDeleteElement(editor.selectedElementId);
      return;
    }

    editor.updateElement(editor.selectedElementId, {
      text: text,
    });
  },
  resizeObserver: null,
  updateElement(id, update) {
    console.log("updateElement: ", update);
    if (update.hasOwnProperty("text")) {
      update = {
        ...update,
        hasChanged: true,
      };
      textTool.updateElementText(id, update.text);
    }

    console.log("updateElement: ", id, update);

    editor.setElements(
      editor.getElements().map((el) => {
        if (el.id !== id) {
          return el;
        }

        console.log("Found element to update: ", el, update);

        return {
          ...el,
          ...update,
        };
      })
    );

    const element = editor.getElements().find((el) => el.id === id);
    renderElements.rerenderElement(
      element,
      editor.canvasPxPerProductMM,
      editor.getCanvas()
    );
  },
  removeElement(id) {
    editor.setElements(editor.getElements().filter((el) => el.id !== id));
    const canvas = editor.getCanvas();

    const element = canvas.querySelector(`#${id}`);

    element.remove();

    if (id === editor.selectedElementId) {
      editor.selectedElementId = null;
      renderElements.setElementSelected(null);
    }
  },
  onElementResize(id, dimensions, element) {
    const elementProps = editor.getElements().find((el) => el.id === id);

    function scaleProperty(value, defaultValue) {
      const scaled = value / editor.canvasPxPerProductMM;
      return isNaN(scaled) ? defaultValue : scaled;
    }

    editor.updateElement(id, {
      size: {
        w: scaleProperty(dimensions.width, elementProps.size.width),
        h: scaleProperty(dimensions.height, elementProps.size.height),
      },
      position: {
        x: scaleProperty(dimensions.x, elementProps.position.x),
        y: scaleProperty(dimensions.y, elementProps.position.y),
      },
    });
  },
  onElementMove(id, position, element) {
    editor.updateElement(id, {
      position: {
        x: position.x / editor.canvasPxPerProductMM,
        y: position.y / editor.canvasPxPerProductMM,
      },
    });
  },
  onElementSelectedFromCanvas(elementProps) {
    editor.selectedElementId = elementProps?.id || null;

    const selectedTextId =
      elementProps?.type === "text" ? elementProps.id : null;
    const selectedImageId =
      elementProps?.type === "image" ? elementProps.id : null;
    textTool.onElementSelected(selectedTextId, false);
    imageTool.setSelectedImage(selectedImageId);

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) {
      if (elementProps?.type === "text") {
        tools.setActiveTool("text");
      } else if (elementProps?.type === "image") {
        tools.setActiveTool("image");
      }
    }
  },
  setSelectedElement(id, edit) {
    editor.selectedElementId = id;
    renderElements.setElementSelected(id);

    const props = editor.getElements().find((el) => el.id === id);

    switch (props?.type) {
      case "text": {
        textTool.onElementSelected(id, edit);
        break;
      }
      case "image": {
        imageTool.setSelectedImage(id);
        break;
      }
    }
  },
  initBackFaceButtons() {
    const face = document.getElementById("button-select-product-face");
    const back = document.getElementById("button-select-product-back");

    if (!face || !back) {
      return;
    }

    face.addEventListener("click", () => {
      face.classList.add("active");
      face.classList.remove("secondary");

      back.classList.remove("active");
      back.classList.add("secondary");

      editor.selectSide(0);
    });

    back.addEventListener("click", () => {
      back.classList.add("active");
      back.classList.remove("secondary");

      face.classList.remove("active");
      face.classList.add("secondary");

      editor.selectSide(1);
    });
  },

  unselectElements() {
    renderElements.setElementSelected(null);
    textTool.onElementSelected(null);
    imageTool.setSelectedImage(null);

    editor.onElementSelectedFromCanvas(null);
  },
  initElementsBlur() {
    //document.addEventListener("click", editor.unselectElements);
    const canvas = document.getElementById("editor-canvas");

    canvas.addEventListener("click", (e) => e.stopPropagation());

    canvas.addEventListener("mousedown", editor.unselectElements);
  },
  getBgFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const bg = urlParams.get("bg");
    const modelColorId = urlParams.get("modelColorId");
    //console.log("modelColorId: ", modelColorId, bg)

    if (bg) {
      editor.setBg({
        bgPath: bg,
      });
    }

    if (modelColorId && editor.currentProduct !== "WORK_CALENDAR") {
      console.log(modelColorId);
      editor.setBg({
        modelColorId,
      });
    }
  },
  _getInitialElements() {
    if (["BUSINESS_CARD", "POCKET_CALENDAR"].includes(editor.currentProduct)) {
      return templatesTool.updateElements(
        initialEditorTextElements.common,
        templates[0]
      );
    }

    if (initialEditorTextElements[editor.currentProduct]) {
      return initialEditorTextElements[editor.currentProduct];
    }

    return [];
  },
  async init(product_name) {
    editor.currentProduct = product_name;
    designRepo.modelColorId =
      new URLSearchParams(window.location.search).get("modelColorId") || null;
    editor.onResize();
    renderElements.setBoundary(editor.getBoundaryInPx());

    editor.setElements(editor._getInitialElements());

    editor.getBgFromUrl();

    tools.init();

    editor.selectSide(0);

    renderElements.resizeListeners.push(editor.onElementResize);
    renderElements.moveListeners.push(editor.onElementMove);
    renderElements.onElementSelected = editor.onElementSelectedFromCanvas;

    editor.initBackFaceButtons();

    editorPreviewPopups.init();
    designRepo.initAutoSave();

    editor.initElementsBlur();

    const productDescription = editor.getCurrentProductDescription();

    const bgWrapper = document.getElementById("editor-bg-wrapper");

    bgWrapper.style.aspectRatio =
      productDescription.sizeMM.width / productDescription.sizeMM.height;

    editor.resizeObserver = new ResizeObserver(editor.onResize);
    const canvas = document.getElementById("editor-canvas");
    editor.resizeObserver.observe(canvas);

    designRepo._savedEditorData = designRepo.getDesignData();

    await designRepo.loadSavedDesign();
    saveToFavorite.init();
    effectsTool.update();
    paperTypeTool.update();
  },
};
