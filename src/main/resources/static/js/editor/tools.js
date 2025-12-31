// const tools = {

//     toolsMenu: null,

//     allTools: [
//         "backgrounds",
//         "lighters",
//         "pens",
//         "image",
//         "templates",
//         "text",
//         "effect",
//         "paper-type"
//     ],

//     toolActive: null,

//     init() {

//         toolsMenu = document.getElementById("editor-tools-menu")

//         try {
//             console.log(editor.currentProduct);

//             if(editor.currentProduct === "PEN" || editor.currentProduct === "LIGHTER") {
//                 //bgTool.init({allowUpload: false})
//             }
//             else {
//                 if(["BUSINESS_CARD", "POCKET_CALENDAR"].includes(editor.currentProduct)){
//                     templatesTool.init()
//                 }

//                 paperTypeTool.init()
//                 bgTool.init({allowUpload: true})
//             }

//             imageTool.init()
//             textTool.init()
//         }
//         catch (e) {
//             console.error(e)
//         }

//         for (const tool of tools.allTools) {
//             const button = document.getElementById("editor-" + tool + "-tool-button")

//             button?.addEventListener("click", () => {
//                 tools.setActiveTool(tool)
//             })
//         }
//     },

//     setActiveTool(newActiveTool) {
//         if (tools.toolActive === newActiveTool) {
//             return
//         }

//         tools.toolActive = newActiveTool
//         for (const tool of tools.allTools) {
//             const button = document.getElementById("editor-" + tool + "-tool-button")
//             const toolContainer = document.getElementById("editor-" + tool + "-tool")
//             if(!button || !toolContainer){
//                 continue
//             }

//             if (tool === newActiveTool) {
//                 button.classList.add("active")
//                 toolContainer.classList.add("active")
//             }
//             else {
//                 button.classList.remove("active")
//                 toolContainer?.classList.remove("active")
//             }
//         }

//         // onToolSelected()
//     }
// }
// // function onToolSelected() {

// // }

const tools = {
  toolsMenu: null,

  allTools: [
    "backgrounds",
    "calendarium",
    "lighters",
    "pens",
    "image",
    "templates",
    "text",
    "effect",
    "paper-type",
  ],

  toolActive: null,

  init() {
    this.toolsMenu = document.getElementById("editor-tools-menu");

    tools.handleResize();
    window.addEventListener("resize", () => tools.handleResize());
    window.addEventListener("load", () => tools.handleResize());

    try {
      console.log(editor.currentProduct);

      if (
        editor.currentProduct === "PEN" ||
        editor.currentProduct === "LIGHTER"
      ) {
        // bgTool.init({allowUpload: false});
      } else {
        if (
          ["BUSINESS_CARD", "POCKET_CALENDAR"].includes(editor.currentProduct)
        ) {
          templatesTool.init();
        }

        paperTypeTool.init();
        bgTool.init({ allowUpload: true });
      }

      imageTool.init();
      textTool.init();
    } catch (e) {
      console.error(e);
    }

    for (const tool of this.allTools) {
      const button = document.getElementById("editor-" + tool + "-tool-button");

      button?.addEventListener("click", () => {
        if(tool === "backgrounds" && editor.currentProduct === "POCKET_CALENDAR" && designRepo.selectedProductSide === 1) {
          this.setActiveTool("calendarium");
          return;
        }
        this.setActiveTool(tool);
      });
    }

    if (editor.currentProduct === "PEN" || editor.currentProduct === "LIGHTER") {
      this.setActiveTool("text");
    }
    else {
      this.setActiveTool("backgrounds");
    }
  },

  // setActiveTool(newActiveTool) {
  //   const toolParent = document.getElementById("tools-parent");
  //   const isMobile = window.matchMedia("(max-width: 768px)").matches;

  //   // If on mobile and the same tool is clicked, toggle the editor
  //   if (isMobile && this.toolActive === newActiveTool) {
  //     for (const tool of this.allTools) {
  //       const button = document.getElementById(`editor-${tool}-tool-button`);
  //       const toolContainer = document.getElementById(`editor-${tool}-tool`);
  //       if (button) button.classList.remove("active");
  //       if (toolContainer) toolContainer.classList.remove("active");
  //     }
  //     this.toolActive = null; // Reset the active tool state
  //     return;
  //   }

  //   // Prevent redundant updates
  //   if (this.toolActive === newActiveTool) {
  //     return;
  //   }

  //   // Update the active tool
  //   this.toolActive = newActiveTool;
  //   toolParent.classList.remove("active");

  //   // Iterate through tools and set or remove the 'active' class
  //   for (const tool of this.allTools) {
  //     const button = document.getElementById(`editor-${tool}-tool-button`);
  //     const toolContainer = document.getElementById(`editor-${tool}-tool`);

  //     if (!button || !toolContainer) continue;

  //     if (tool === newActiveTool) {
  //       button.classList.add("active");
  //       toolContainer.classList.add("active");
  //       toolParent.classList.add("active");
  //     } else {
  //       button.classList.remove("active");
  //       toolContainer.classList.remove("active");
  //     }
  //   }
  // },


  setActiveTool(newActiveTool) {
    const toolParent = document.getElementById("tools-parent");
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // If on mobile and the same tool is clicked, toggle the editor
    if (isMobile && this.toolActive === newActiveTool) {
      for (const tool of this.allTools) {
        const button = document.getElementById(`editor-${tool}-tool-button`);
        const toolContainer = document.getElementById(`editor-${tool}-tool`);
        if (button) button.classList.remove("active");
        if (toolContainer && toolContainer.classList.contains("active")) {
          toolContainer.classList.remove("active");
          toolContainer.classList.add("slideDown"); // Trigger slideDown animation
          setTimeout(() => toolContainer.classList.remove("slideDown"), 1200); // Remove after animation
          toolParent.classList.remove("active");
        }
      }
      this.toolActive = null; // Reset the active tool state
      return;
    }

    // Prevent redundant updates
    if (this.toolActive === newActiveTool) {
      return;
    }

    // Update the active tool
    const prevTool = this.toolActive;
    this.toolActive = newActiveTool;
    toolParent.classList.remove("active");

    if (newActiveTool === "calendarium" && editor.currentProduct === "POCKET_CALENDAR") {
      const calendariumTool = document.getElementById("editor-calendarium-tool");
      calendariumTool.classList.add("active");
    }

    // Iterate through tools and set or remove the 'active' class
    for (const tool of this.allTools) {
      const button = document.getElementById(`editor-${tool}-tool-button`);
      const toolContainer = document.getElementById(`editor-${tool}-tool`);

      if (tool === newActiveTool) {
        if (button) {
          button.classList.add("active");
        }
        console.log("Tool: ", tool, "Current product: ", editor.currentProduct)

        if (toolContainer) {
          toolContainer.classList.add("active");
        }
        toolParent.classList.add("active");
        continue;
      }

      if(button) {
        button.classList.remove("active");
      }
      if(toolContainer) {
        toolContainer.classList.remove("active");
      }
    }


    if (newActiveTool === "calendarium" && editor.currentProduct === "POCKET_CALENDAR") {
      const bgToolButton = document.getElementById(`editor-backgrounds-tool-button`);
      const bgToolContainer = document.getElementById(`editor-backgrounds-tool`);

      const calendariumTool = document.getElementById("editor-calendarium-tool");
      console.log("Calendarium tool: ", calendariumTool)
      console.log("Selected product side: ", designRepo.selectedProductSide)
      bgToolButton.classList.add("active");
      if (designRepo.selectedProductSide === 1) {
        bgToolContainer.classList.remove("active");
        calendariumTool.classList.add("active");
      }
      else {
        bgToolContainer.classList.add("active");
        calendariumTool.classList.remove("active");
      }
    }
  },

  handleResize() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;


  },
};

