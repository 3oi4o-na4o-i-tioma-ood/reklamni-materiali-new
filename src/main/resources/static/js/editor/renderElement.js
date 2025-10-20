function newRenderElements(editorId) {
  const renderElements = {
    // (id: string, {x, y, width, height}, element: HTMLElement) => void
    resizeListeners: [],

    // (id: string, {x, y}, element: HTMLElement) => void
    moveListeners: [],
    onElementSelected: null,
    _editorId: editorId || "editor-canvas",
    _boundary: null,
    _canvasBorderThickness: 2,

    getCanvas() {
      return document.getElementById(renderElements._editorId);
    },
    getCanvasRect() {
      return renderElements.getCanvas().getBoundingClientRect();
    },
    setElementSelected(id) {
      if(id === null) {
        renderElements.selectedElements = [];
      }
      
      if (editor.selectedElementId === id) {
        return;
      }

      const elements = document.querySelectorAll(
        `#${renderElements._editorId} .element`
      );

      console.log(
        "Select new element. Was: ",
        editor.selectedElementId,
        "now: ",
        id
      );

      // Unselect currently selected element
      if (editor.selectedElementId && renderElements.selectedElements.length === 0) {
        const selectedElement = document.getElementById(
          editor.selectedElementId
        );
        const textarea = selectedElement.querySelector("textarea");

        if (textarea) {
          selectedElement?.classList.remove("edited");
          textarea.blur();

          editor.updateElementTextOrDeleteElement(textarea.value);
        }
      }

      // Only remove selection from other elements if not in multi-select mode
      if (renderElements.selectedElements.length === 0) {
        for (const element of elements) {
          if (element.id === id) {
            element.classList.add("selected");
          } else {
            element.classList.remove("selected");
          }
        }
      } else {
        // In multi-select mode, only add selection to the new element
        const element = document.getElementById(id);
        if (element) {
          element.classList.add("selected");
        }
      }
    },

    isDragging: false,
    selectionBox: null,
    startX: 0,
    startY: 0,
    selectedElements: [],

    initMultiSelect() {
      const editorContainer = document.getElementById(renderElements._editorId);

      editorContainer.addEventListener("mousedown", (event) => {
        renderElements.isDragging = true;
        renderElements.startX = event.clientX;
        renderElements.startY = event.clientY;

        // Create the selection box
        renderElements.selectionBox = document.createElement("div");
        renderElements.selectionBox.classList.add("selection-box");
        renderElements.selectionBox.style.left = `${renderElements.startX}px`;
        renderElements.selectionBox.style.top = `${renderElements.startY}px`;
        editorContainer.appendChild(renderElements.selectionBox);
      });

      document.addEventListener("mousemove", (event) => {
        if (renderElements.isDragging && renderElements.selectionBox) {
          const currentX = event.clientX;
          const currentY = event.clientY;

          // Calculate the selection box dimensions
          const width = Math.abs(currentX - renderElements.startX);
          const height = Math.abs(currentY - renderElements.startY);

          renderElements.selectionBox.style.width = `${width}px`;
          renderElements.selectionBox.style.height = `${height}px`;

          // Adjust position based on drag direction
          renderElements.selectionBox.style.left = `${Math.min(
            renderElements.startX,
            currentX
          )}px`;
          renderElements.selectionBox.style.top = `${Math.min(
            renderElements.startY,
            currentY
          )}px`;

          // Highlight elements within the selection box
          this.selectElementsInArea(renderElements.selectionBox);
        }
      });

      document.addEventListener("mouseup", () => {
        if (renderElements.isDragging) {
          renderElements.isDragging = false;

          // Remove the selection box
          if (renderElements.selectionBox) {
            renderElements.selectionBox.remove();
            renderElements.selectionBox = null;
          }
        }
      });
    },

    selectElementsInArea(box) {
      const elements = document.querySelectorAll(
        `#${renderElements._editorId} .element`
      );

      const boxRect = box.getBoundingClientRect();

      for (const element of elements) {
        const elementRect = element.getBoundingClientRect();

        // Check if the element overlaps with the selection box
        const isOverlapping =
          elementRect.left < boxRect.right &&
          elementRect.right > boxRect.left &&
          elementRect.top < boxRect.bottom &&
          elementRect.bottom > boxRect.top;

        const textSection = document.getElementById("text-format-section");

        if (isOverlapping) {
          element.classList.add("selected");
          if (!renderElements.selectedElements.includes(element)) {
            renderElements.selectedElements.push(element);
            document
              .getElementById(`editor-text-tool-edit-${element.id}`)
              .classList.add("selected");
          }

          if (!textSection.classList.contains("active")) {
            textSection.classList.add("active");
          }
        } else {
          element.classList.remove("selected");
          const index = renderElements.selectedElements.indexOf(element);
          if (index !== -1) {
            document
              .getElementById(`editor-text-tool-edit-${element.id}`)
              .classList.remove("selected");
            renderElements.selectedElements.splice(index, 1);
          }

          if (textSection.classList.contains("active")) {
            textSection.classList.remove("active");
          }
        }
      }

      tools.setActiveTool("text");
      renderElements.selectedElements.forEach((element) => {
        editor.setSelectedElement(element.id, false);
        textTool.onElementSelected(element.id, false);
        document
          .getElementById("editor-text-tool-edit-" + element.id)
          .classList.add("selected");
      });

      // Assuming `renderElements.selectedElements` contains selected elements
      if (renderElements.selectedElements.length > 0) {
        const boundingBox = document.getElementById("canvas-boundary");

        this.enableConstrainedDragForSelectedElements({
          selectedElements: renderElements.selectedElements.map((element) => ({
            element,
          })),
          boundingBox,
        });
      }
    },

    setElementDimensions(element, elementProps) {
      element.style.left =
        elementProps.position.x * editor.canvasPxPerProductMM + "px";
      element.style.top =
        elementProps.position.y * editor.canvasPxPerProductMM + "px";
      element.style.width = elementProps.size.w
        ? elementProps.size.w * editor.canvasPxPerProductMM - 1 + "px"
        : null;
      element.style.height = elementProps.size.h
        ? elementProps.size.h * editor.canvasPxPerProductMM + "px"
        : null;
    },

    _onElementResize({ id, dimensions, element }) {
      renderElements.resizeListeners.forEach((listener) => {
        try {
          listener(id, dimensions, element);
        } catch (e) {
          console.log("Error when calling resize listener: ", e);
        }
      });
    },

    createBasicEditorElement(
      elementProps,
      { enableVerticalResize, fixedAspectRatio, sizeLimits } = {}
    ) {
      const div = document.createElement("div");
      renderElements.setElementDimensions(div, elementProps);

      div.className = "element";
      div.id = elementProps.id;

      const dragAndResizeHandle = newDragAndResize(div, renderElements);

      dragAndResizeHandle.enableResize({
        enableVerticalResize,
        onResize(dimensions) {
          renderElements._onElementResize({
            id: elementProps.id,
            dimensions: {...dimensions, width: dimensions.width + 1},
            element: div,
          });
        },
        fixedAspectRatio,
        sizeLimits,
      });

      dragAndResizeHandle.enableDrag({
        onMove(position, elementId) {
          renderElements.moveListeners.forEach((listener) => {
            try {
              // Use the provided elementId if available, otherwise use the default element's id
              const id = elementId || elementProps.id;
              const targetElement = document.getElementById(id);
              listener(id, position, targetElement);
            } catch (e) {
              console.log("Error when calling move listener: ", e);
            }
          });
        },
      });

      div.addEventListener("mousedown", (e) => {
        // Only clear selection if not part of multi-select
        if (renderElements.selectedElements.length === 0) {
          renderElements.setElementSelected(elementProps?.id);
          renderElements.onElementSelected?.(elementProps);
          renderElements.selectedElements = [];
        } else if (!renderElements.selectedElements.includes(div)) {
          // If clicking an unselected element while having multi-selection,
          // clear multi-selection and select just this element
          renderElements.setElementSelected(elementProps?.id);
          renderElements.onElementSelected?.(elementProps);
          renderElements.selectedElements = [];
        }
      });

      return {
        element: div,
        dragAndResizeHandle,
      };
    },

    applyTextElementProps(elementProps, element) {
      element ??= renderElements
        .getCanvas()
        .querySelector(`#${elementProps.id}`);

      const textarea = element.querySelector("textarea");
      const textareaSizer = element.querySelector(".textarea-sizer");
      const styledElements = [textarea, textareaSizer];

      styledElements.forEach(element => {
        element.style.fontWeight = elementProps.bold ? "bold" : "normal";
        element.style.fontSize =
          elementProps.fontSize * editor.canvasPxPerProductMM + "px";
        element.style.textDecoration = elementProps.underline
          ? "underline"
          : "none";
        element.style.fontStyle = elementProps.italic ? "italic" : "normal";
        element.style.fontFamily = elementProps.fontFamily || "Arial";
        element.style.color = elementProps.color;
        element.style.textAlign = elementProps.alignment;
        element.style.height = "auto";
      });

      if (textarea) {
        textarea.value = elementProps.text;
        textareaSizer.innerText = textarea.value + ".";
      }
    },

    computeWrappedText(elementProps) {
      try {
        const widthPx = (elementProps?.size?.w || 0) * editor.canvasPxPerProductMM;
        if (!widthPx || !elementProps?.text?.length) {
          return elementProps?.text || "";
        }

        const sizer = document.createElement("div");
        sizer.style.position = "fixed";
        sizer.style.left = "-10000px";
        sizer.style.top = "0";
        sizer.style.visibility = "hidden";
        sizer.style.whiteSpace = "pre-wrap";
        sizer.style.wordBreak = "break-word";
        sizer.style.overflowWrap = "anywhere";
        sizer.style.width = widthPx + "px";
        sizer.style.fontFamily = `'${elementProps.fontFamily}'` || "Arial";
        sizer.style.fontSize =
          (elementProps.fontSize || 0) * editor.canvasPxPerProductMM + "px";
        sizer.style.fontWeight = elementProps.bold ? "bold" : "normal";
        sizer.style.fontStyle = elementProps.italic ? "italic" : "normal";
        sizer.style.letterSpacing = "normal";
        sizer.style.lineHeight = "normal";

        const textNode = document.createTextNode(elementProps.text);
        sizer.append(textNode);
        document.body.appendChild(sizer);

        const range = document.createRange();
        const result = [];
        let currentLine = [];
        let lastTop = null;

        for (let i = 0; i < textNode.length; i++) {
          range.setStart(textNode, i);
          range.setEnd(textNode, i + 1);
          const rects = range.getClientRects();
          if (!rects || rects.length === 0) {
            currentLine.push(textNode.data[i]);
            continue;
          }
          const top = Math.round(rects[0].top);
          if (lastTop === null) {
            lastTop = top;
          }
          if (top !== lastTop) {
            result.push(currentLine.join(""));
            currentLine = [textNode.data[i]];
            lastTop = top;
          } else {
            currentLine.push(textNode.data[i]);
          }
        }
        if (currentLine.length > 0) {
          result.push(currentLine.join(""));
        }

        document.body.removeChild(sizer);
        return result.join("\n");
      } catch (e) {
        console.warn("Failed to compute wrapped text, fallback to original.", e);
        return elementProps?.text || "";
      }
    },

    renderTextElement(props) {
      const canvas = renderElements.getCanvas();

      const { element, dragAndResizeHandle } =
        renderElements.createBasicEditorElement(props);
      dragAndResizeHandle.setBoundary(renderElements._boundary);

      const textarea = document.createElement("textarea");
      textarea.className = "text";
      const textareaSizer = document.createElement("div");
      textareaSizer.className = "textarea-sizer";
      element.append(textarea);
      element.append(textareaSizer);
      textarea.rows = 1;

      textarea.addEventListener("input", () => {
        textareaSizer.innerText = textarea.value + ".";
      });

      function createEditButton() {
        const editButton = document.createElement("button");

        editButton.addEventListener("click", () => {
          element.classList.add("edited");
          textarea.focus();
        });

        editButton.addEventListener("mousedown", e => {
          // Prevent drag when clicking
          e.stopPropagation()
        })

        editButton.classList.add("action-button", "icon-button", "edit");
        const editIcon = document.createElement("img");
        editIcon.src = "/images/common/edit_contrast.svg";
        editButton.append(editIcon);
        return editButton
      }

      const editButton = createEditButton()

      function createSaveButton() {
        const saveButton = document.createElement("button");
        saveButton.addEventListener("click", () => {
          element.classList.remove("edited");
          textarea.blur();
          
          editor.updateElementTextOrDeleteElement(textarea.value);
        });
        saveButton.classList.add("action-button", "icon-button", "save");
        const saveIcon = document.createElement("img");
        saveIcon.src = "/images/common/tick_contrast.svg";
        saveButton.append(saveIcon);
      
        return saveButton
      }

      const saveButton = createSaveButton()

      element.append(editButton, saveButton);

      element.classList.add("tooltip")

      const tooltipContentWrapper = document.createElement("div")
      tooltipContentWrapper.classList.add("content-wrapper")

      const tooltipContent = document.createElement("div")
      tooltipContent.classList.add("content")
      tooltipContent.innerText = "Натиснете моливчето за да редактирате текста"
      tooltipContentWrapper.append(tooltipContent)

      element.append(tooltipContentWrapper)

      renderElements.applyTextElementProps(props, element);

      element.classList.add("text-element");

      canvas.append(element);
    },

    renderTextElements(textElements) {
      for (const textElement of textElements) {
        renderElements.renderTextElement(textElement);
      }
    },

    renderImgElement(elementProps, { imageSrc, maxInitialDimensionMM } = {}) {
      imageSrc = imageSrc || null;
      maxInitialDimensionMM = maxInitialDimensionMM || Infinity;

      const canvas = renderElements.getCanvas();

      const { element } = renderElements.createBasicEditorElement(
        elementProps,
        { enableVerticalResize: true, fixedAspectRatio: true }
      );
      // renderElements.setElementDimensions(div, imgElement)
      element.classList.add("img-element");

      const img = document.createElement("img");
      img.src = imageSrc || API.getEditorImageUrl(elementProps.name);

      img.addEventListener("load", () => {
        // Automatically calculate the other dimension if not set

        const aspectRatio = img.naturalWidth / img.naturalHeight;

        let sizeUpdate = null;
        if (!elementProps.size.h && elementProps.size.w) {
          sizeUpdate = {
            height: elementProps.size.w / aspectRatio,
          };

          if (sizeUpdate.height > maxInitialDimensionMM) {
            const scale = maxInitialDimensionMM / sizeUpdate.height;
            sizeUpdate.height *= scale;
            sizeUpdate.width = elementProps.size.w * scale;
          }
        }

        if (!elementProps.size.w && elementProps.size.h) {
          sizeUpdate = {
            width: elementProps.size.h * aspectRatio,
          };

          if (sizeUpdate.width > maxInitialDimensionMM) {
            const scale = maxInitialDimensionMM / sizeUpdate.width;
            sizeUpdate.width *= scale;
            sizeUpdate.height = elementProps.size.h * scale;
          }
        }

        if (sizeUpdate) {
          const dimensions = {
            width: elementProps.size.w,
            height: elementProps.size.h,
            ...sizeUpdate,
          };

          dimensions.width *= editor.canvasPxPerProductMM;
          dimensions.height *= editor.canvasPxPerProductMM;

          renderElements._onElementResize({
            id: elementProps.id,
            element,
            dimensions,
          });
        }
      });

      element.append(img);

      canvas.append(element);

      return element;
    },

    setBoundary({ left, right, top, bottom }) {
      const boundary = document.getElementById("canvas-boundary");

      boundary.style.left = left + "px";
      boundary.style.top = top + "px";

      boundary.style.right = right + "px";
      boundary.style.bottom = bottom + "px";

      renderElements._boundary = { left, right, top, bottom };
    },

    renderBG(url) {
      const bg = document.getElementById("editor-canvas-bg");
      bg.src = url || "";
      bg.style.visibility = url ? "visible" : "hidden";

      const remove_button = document.getElementById("remove-background");
      if (url) {
        remove_button.style.backgroundColor = "white";
        remove_button.style.cursor = "pointer";
        remove_button.style.borderColor = "green";

        remove_button.addEventListener("click", () => {
          editor.setBg({
            bgPath: null,
          });
          remove_button.style.backgroundColor = "#eee";
          remove_button.style.cursor = "not-allowed";
          remove_button.style.borderColor = "#c3c3c3";
        });
      } else {
        remove_button.style.backgroundColor = "#eee";
        remove_button.style.cursor = "not-allowed";
        remove_button.style.borderColor = "#c3c3c3";
      }
    },

    removeRenderBG() {
      const bg = document.getElementById("editor-canvas-bg");
      bg.src = "";
      bg.style.visibility = "hidden";

      const current_bg = document.getElementById("bg-tool-current-bg");
      current_bg.src = "";
      current_bg.style.visibility = "hidden";

      const remove_button = document.getElementById("remove-background");
      remove_button.style.display = "none";
    },

    rerenderElement(elementProps, canvasPxPerProductMM, canvas) {
      try {
        const element = canvas.querySelector(`#${elementProps.id}`);

        renderElements.setElementDimensions(element, elementProps);

        if (elementProps.hasOwnProperty("text")) {
          renderElements.applyTextElementProps(elementProps, element);
        }
      } catch (e) {
        console.error("Failed to rerender element: ", e);
      }
    },

    rerenderElements(elements, canvasPxPerProductMM) {
      const canvas = renderElements.getCanvas();

      for (const elementProps of elements) {
        renderElements.rerenderElement(
          elementProps,
          canvasPxPerProductMM,
          canvas
        );
      }
    },

    clear() {
      const canvas = renderElements.getCanvas();
      const elements = canvas.querySelectorAll(".element");

      elements.forEach((el) => el.remove());
    },

    enableConstrainedDragForSelectedElements({
      selectedElements,
      boundingBox,
    }) {
      let relativeMousePos = { x: 0, y: 0 };
      let elementOffsets = [];

      function moveListener(e) {
        e.stopPropagation();
        e.preventDefault();

        const boundingRect = boundingBox.getBoundingClientRect();

        // Calculate new mouse position relative to the bounding box
        const mousePos = {
          x: e.clientX - boundingRect.left,
          y: e.clientY - boundingRect.top,
        };

        // Move all selected elements while respecting the bounding box
        selectedElements.forEach(({ element, offsetX, offsetY }) => {
          const newLeft = Math.max(
            0,
            Math.min(
              boundingRect.width - element.offsetWidth,
              mousePos.x + offsetX
            )
          );
          const newTop = Math.max(
            0,
            Math.min(
              boundingRect.height - element.offsetHeight,
              mousePos.y + offsetY
            )
          );

          element.style.left = `${newLeft}px`;
          element.style.top = `${newTop}px`;
        });
      }

      function mouseUpListener() {
        document.removeEventListener("mousemove", moveListener);
        document.removeEventListener("mouseup", mouseUpListener);
        elementOffsets = [];
      }

      boundingBox.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return; // Only handle left-clicks

        e.preventDefault();
        e.stopPropagation();

        const boundingRect = boundingBox.getBoundingClientRect();

        // Capture initial mouse position relative to the bounding box
        relativeMousePos = {
          x: e.clientX - boundingRect.left,
          y: e.clientY - boundingRect.top,
        };

        // Calculate offsets for all selected elements
        elementOffsets = selectedElements.map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            element,
            offsetX: rect.left - boundingRect.left - relativeMousePos.x,
            offsetY: rect.top - boundingRect.top - relativeMousePos.y,
          };
        });

        // Attach event listeners for drag behavior
        document.addEventListener("mousemove", moveListener);
        document.addEventListener("mouseup", mouseUpListener);
      });
    },

    enableDrag({onMove}) {
        const relativeMousePos = { current: null }
        const lastRelativeItemPos = { current: null }
        const initialPositions = new Map()

        function moveListener(e) {
            e.stopPropagation()
            e.preventDefault()
            const canvasRect = renderElementsHandle.getCanvasRect()
            const rect = element.getBoundingClientRect()

            const absPos = {
                x: e.clientX - relativeMousePos.current.x,
                y: e.clientY - relativeMousePos.current.y
            }
            const posRelativeToCanvas = {
                x: absPos.x - canvasRect.x - 1,
                y: absPos.y - canvasRect.y - 1
            }

            lastRelativeItemPos.current = lastRelativeItemPos.current || {}

            // Calculate the delta movement from initial position
            const deltaX = posRelativeToCanvas.x - initialPositions.get(element.id).x
            const deltaY = posRelativeToCanvas.y - initialPositions.get(element.id).y

            // If we have multiple elements selected, move them all together
            if (renderElementsHandle.selectedElements.length > 0) {
                renderElementsHandle.selectedElements.forEach(selectedElement => {
                    const initialPos = initialPositions.get(selectedElement.id)
                    if (!initialPos) return

                    const newX = dragAndResize.boundedRight(dragAndResize.boundedLeft(initialPos.x + deltaX))
                    const newY = dragAndResize.boundedBottom(dragAndResize.boundedTop(initialPos.y + deltaY))
                    
                    selectedElement.style.left = newX + "px"
                    selectedElement.style.top = newY + "px"

                    if (selectedElement === element) {
                        lastRelativeItemPos.current = { x: newX, y: newY }
                    }
                })
            } else {
                const leftRightBounded = dragAndResize.boundedRight(dragAndResize.boundedLeft(posRelativeToCanvas.x) + rect.width) - rect.width
                lastRelativeItemPos.current.x = leftRightBounded
                element.style.left = lastRelativeItemPos.current.x + "px"

                const topBottomBounded = dragAndResize.boundedBottom(dragAndResize.boundedTop(posRelativeToCanvas.y) + rect.height) - rect.height
                lastRelativeItemPos.current.y = topBottomBounded
                element.style.top = lastRelativeItemPos.current.y + "px"
            }
        }

        function mouseUpListener() {
            if (renderElementsHandle.selectedElements.length > 0) {
                renderElementsHandle.selectedElements.forEach(selectedElement => {
                    const rect = selectedElement.getBoundingClientRect()
                    const canvasRect = renderElementsHandle.getCanvasRect()
                    onMove({
                        x: rect.x - canvasRect.x - 2,
                        y: rect.y - canvasRect.y - 2
                    })
                })
            } else {
                onMove(lastRelativeItemPos.current)
            }

            document.removeEventListener("mousemove", moveListener)
            document.removeEventListener("mouseup", mouseUpListener)
            initialPositions.clear()
        }

        element.addEventListener("mousedown", (e) => {
            if (e.button !== 0) {
                return
            }

            e.stopPropagation()

            if (element.classList.contains("edited")) {
                return
            }

            e.preventDefault()

            if (!element.classList.contains("selected")) {
                return
            }

            const rect = element.getBoundingClientRect()
            const canvasRect = renderElementsHandle.getCanvasRect()

            // Store initial positions of all selected elements
            if (renderElementsHandle.selectedElements.length > 0) {
                renderElementsHandle.selectedElements.forEach(selectedElement => {
                    const selectedRect = selectedElement.getBoundingClientRect()
                    initialPositions.set(selectedElement.id, {
                        x: selectedRect.x - canvasRect.x - 2,
                        y: selectedRect.y - canvasRect.y - 2
                    })
                })
            }

            lastRelativeItemPos.current = {
                x: rect.x - canvasRect.x - 2,
                y: rect.y - canvasRect.y - 2
            }
            initialPositions.set(element.id, {...lastRelativeItemPos.current})

            relativeMousePos.current = {
                x: e.clientX - rect.x,
                y: e.clientY - rect.y
            }

            document.removeEventListener("mousemove", moveListener)
            document.removeEventListener("mouseup", mouseUpListener)

            document.addEventListener("mousemove", moveListener)
            document.addEventListener("mouseup", mouseUpListener)
        })
    },
  };

  return renderElements;
}

const renderElements = newRenderElements();

window.onload = () => {
  renderElements.initMultiSelect();
};
