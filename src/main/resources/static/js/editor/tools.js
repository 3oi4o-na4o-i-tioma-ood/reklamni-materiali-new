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
        this.setActiveTool(tool);
      });
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

    // Iterate through tools and set or remove the 'active' class
    for (const tool of this.allTools) {
      const button = document.getElementById(`editor-${tool}-tool-button`);
      const toolContainer = document.getElementById(`editor-${tool}-tool`);

      if (button && button.classList.contains("active")) {
        button.classList.remove("active");
      }

      if (!button || !toolContainer) continue;

      if (tool === newActiveTool) {
        button.classList.add("active");
        toolContainer.classList.remove("slideDown");
        toolContainer.classList.add("active");
        toolContainer.classList.add("slideUp"); // Trigger slideUp animation
        setTimeout(() => toolContainer.classList.remove("slideUp"), 1200); // Remove after animation
        toolParent.classList.add("active");
      } else if (tool === prevTool) {
        toolContainer.classList.remove("active");
        toolContainer.classList.add("slideDown"); // Trigger slideDown animation
        setTimeout(() => toolContainer.classList.remove("slideDown"), 1200); // Remove after animation
      } else {
        button.classList.remove("active");
        toolContainer.classList.remove("active");
      }
    }
  },

  handleResize() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      this.setActiveTool(null); // No tool active by default on mobile
    } else {
      // Ensure the first tool is always active on desktop
      if (this.allTools && this.allTools.length > 0) {
        this.setActiveTool(this.allTools[0]);
      }
    }

    // Add listener for viewport changes
    window.matchMedia("(max-width: 768px)").addEventListener("change", (e) => {
      if (e.matches) {
        // Switched to mobile view
        this.setActiveTool(null);
      } else {
        // Switched to desktop view, ensure the first tool is active
        if (this.allTools && this.allTools.length > 0) {
          this.setActiveTool(this.allTools[0]);
        }
      }
    });
  },
};

