function newDragAndResize(element, renderElementsHandle) {
    const dragAndResize = {
        _boundary: null,
        boundedLeft(value) {
            return Math.max(value, dragAndResize._boundary?.left || 0)
        },
        boundedRight(value) {
            const canvasRect = renderElementsHandle.getCanvasRect()
    
            const rightBoundary = canvasRect.width - (dragAndResize._boundary?.right || 0)
            return Math.min(value, rightBoundary - renderElementsHandle._canvasBorderThickness * 2)
        },
        boundedTop(value) {
            return Math.max(value, dragAndResize._boundary?.top || 0)
        },
        boundedBottom(value) {
            const canvasRect = renderElementsHandle.getCanvasRect()
    
            const bottomBoundary = canvasRect.height - (dragAndResize._boundary?.bottom || 0)
            return Math.min(value, bottomBoundary - renderElementsHandle._canvasBorderThickness * 2)
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

                // Move all selected elements by the same delta
                if (renderElementsHandle.selectedElements.length > 0) {
                    // Calculate the proposed delta movement
                    const deltaX = posRelativeToCanvas.x - initialPositions.get(element.id).x
                    const deltaY = posRelativeToCanvas.y - initialPositions.get(element.id).y

                    let allowedDeltaX = deltaX
                    let allowedDeltaY = deltaY
                    
                    // Find the most restrictive boundaries among all elements
                    renderElementsHandle.selectedElements.forEach(selectedElement => {
                        const initialPos = initialPositions.get(selectedElement.id)
                        if (!initialPos) return

                        const rect = selectedElement.getBoundingClientRect()
                        
                        // Left boundary
                        const leftBoundary = dragAndResize._boundary?.left || 0
                        const leftDelta = leftBoundary - initialPos.x
                        if (deltaX < leftDelta) {
                            allowedDeltaX = Math.max(allowedDeltaX, leftDelta)
                        }

                        // Right boundary
                        const rightBoundary = canvasRect.width - (dragAndResize._boundary?.right || 0) - rect.width
                        const rightDelta = rightBoundary - initialPos.x
                        if (deltaX > rightDelta) {
                            allowedDeltaX = Math.min(allowedDeltaX, rightDelta)
                        }

                        // Top boundary
                        const topBoundary = dragAndResize._boundary?.top || 0
                        const topDelta = topBoundary - initialPos.y
                        if (deltaY < topDelta) {
                            allowedDeltaY = Math.max(allowedDeltaY, topDelta)
                        }

                        // Bottom boundary
                        const bottomBoundary = canvasRect.height - (dragAndResize._boundary?.bottom || 0) - rect.height
                        const bottomDelta = bottomBoundary - initialPos.y
                        if (deltaY > bottomDelta) {
                            allowedDeltaY = Math.min(allowedDeltaY, bottomDelta)
                        }
                    })

                    // Apply the constrained movement to all elements
                    renderElementsHandle.selectedElements.forEach(selectedElement => {
                        const initialPos = initialPositions.get(selectedElement.id)
                        if (!initialPos) return

                        const newX = initialPos.x + allowedDeltaX
                        const newY = initialPos.y + allowedDeltaY

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
                        // Get the final position in pixels
                        const finalLeft = parseFloat(selectedElement.style.left)
                        const finalTop = parseFloat(selectedElement.style.top)
                        
                        // Pass the final position to the editor
                        onMove({
                            x: finalLeft,
                            y: finalTop
                        }, selectedElement.id)
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
    
        _createResizeHandle({ type, onResize, enabled, fixedAspectRatio, sizeLimits }) {
            const handle = document.createElement("div")
            handle.className = "handle handle-" + type
    
            const lastDimensions = {
                current: {}
            }
    
            if (!enabled) {
                // Visible, but not interactive
                handle.classList.add("disabled")
                return handle
            }
    
            const initialRect = { current: null }
    
            function getInitialAspectRatio() {
                return initialRect.current?.width / initialRect.current?.height
            }

            function limitSize(sizeValue, sizeLimits) {
                const minSize = sizeLimits ? sizeLimits.min : 20
                const maxSize = sizeLimits?.max || Infinity

                return Math.min(maxSize, Math.max(minSize, sizeValue))
            }
    
            function moveListener(e) {
                const rect = element.getBoundingClientRect()
                const canvasRect = renderElementsHandle.getCanvasRect()

                
    
                if (type === "right") {
                    const width = limitWidth(e.clientX - rect.x + 2)
                    setWidth(width)
                }
                else if (type === "left") {
    
                    const boundedMousePos = dragAndResize.boundedLeft(e.clientX - canvasRect.x - 2) + canvasRect.x + 2
                    const width = limitWidth(initialRect.current.right - boundedMousePos, {ignoreWidthBoundaries: true})
    
                    lastDimensions.current.x = initialRect.current.right - width - canvasRect.x - 2
                    element.style.left = lastDimensions.current.x + "px"
    
                    setWidth(width)
                }
                else if (type === "top") {
                    const boundedMousePos = dragAndResize.boundedTop(e.clientY - canvasRect.y - 2) + canvasRect.y + 2
                    const height = limitHeight(initialRect.current.bottom - boundedMousePos, {ignoreHeightBoundaries: true})
    
                    lastDimensions.current.y = initialRect.current.bottom - height - canvasRect.y - 2
                    element.style.top = lastDimensions.current.y + "px"
    
                    setHeight(height)
                }
                else if (type === "bottom") {
                    const height = limitHeight(dragAndResize.boundedBottom(e.clientY - canvasRect.y) + canvasRect.y - rect.y + 2)
                    setHeight(height)
                }
    
            }

            function limitWidth(width, {ignoreHeightLimits, ignoreWidthBoundaries} = {}) {
                const rect = element.getBoundingClientRect()
                const canvasRect = renderElementsHandle.getCanvasRect()

                const x = rect.x - canvasRect.x

                const boundedRight = dragAndResize.boundedRight(x + width) - x
                const limitedWidth = limitSize(ignoreWidthBoundaries ? width : boundedRight, sizeLimits?.width)

                if(ignoreHeightLimits || !fixedAspectRatio) {
                    return limitedWidth
                }

                const height = limitedWidth / getInitialAspectRatio()
                const limitedHeight = limitHeight(height, {
                    ignoreWidthLimits: true
                })
                return limitedHeight * getInitialAspectRatio()
            }

            function limitHeight(height, {ignoreWidthLimits, ignoreHeightBoundaries} = {}) {
                const rect = element.getBoundingClientRect()
                const canvasRect = renderElementsHandle.getCanvasRect()

                const y = rect.y - canvasRect.y

                const boundedBottom = dragAndResize.boundedBottom(y + height) - y
                const limitedHeight = limitSize(ignoreHeightBoundaries ? height : boundedBottom, sizeLimits?.height)

                if(ignoreWidthLimits || !fixedAspectRatio) {
                    return limitedHeight
                }

                const width = limitedHeight * getInitialAspectRatio()
                const limitedWidth = limitWidth(width, {
                    ignoreHeightLimits: true
                })
                return limitedWidth / getInitialAspectRatio()
            }
    
            function setWidth(width) {
                lastDimensions.current.width = width
                element.style.width = width + "px"
    
                if (fixedAspectRatio) {
                    const height = width / getInitialAspectRatio()
                    lastDimensions.current.height = height
                    element.style.height = height + "px"
                }
            }
    
    
            function setHeight(height) {
                lastDimensions.current.height = height
                element.style.height = height + "px"
    
                if (fixedAspectRatio) {
                    const width = height * getInitialAspectRatio()
                    lastDimensions.current.width = width
                    element.style.width = width + "px"
                }
            }
    
            function mouseUpListener() {
                console.log("mouseUpListener: ", lastDimensions.current)
                onResize(lastDimensions.current)
    
                document.removeEventListener("mousemove", moveListener)
                document.removeEventListener("mouseup", mouseUpListener)
            }
    
            handle.addEventListener("mousedown", (e) => {
                console.log("Click handle")
                e.stopPropagation()
                e.preventDefault()
                initialRect.current = element.getBoundingClientRect()
    
                document.removeEventListener("mousemove", moveListener)
                document.removeEventListener("mouseup", mouseUpListener)
    
                document.addEventListener("mousemove", moveListener)
                document.addEventListener("mouseup", mouseUpListener)
            })
    
            return handle
        },
    
        enableResize({enableVerticalResize, onResize, fixedAspectRatio, sizeLimits}) {
            element.append(dragAndResize._createResizeHandle({ type: "top", onResize, enabled: enableVerticalResize, fixedAspectRatio, sizeLimits }))
            element.append(dragAndResize._createResizeHandle({ type: "bottom", onResize, enabled: enableVerticalResize, fixedAspectRatio, sizeLimits }))
            element.append(dragAndResize._createResizeHandle({ type: "left", onResize, enabled: true, fixedAspectRatio, sizeLimits }))
            element.append(dragAndResize._createResizeHandle({ type: "right", onResize, enabled: true, fixedAspectRatio, sizeLimits }))
        },

        setBoundary(boundary) {
            dragAndResize._boundary = boundary
        }
    }


    return dragAndResize
}