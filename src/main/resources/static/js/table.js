const productInfoTable = {
  _selectedTab: 0,
  _selectTab(index) {
    if (index === productInfoTable._selectedTab || index > 3 || index < 0) {
      return
    }

    const tabs = document.getElementById("info-table-tabs")

    const buttons = tabs.children
    buttons[productInfoTable._selectedTab]?.classList.remove("selected")
    buttons[index].classList.add("selected")

    const tabsContentWrapper = document.getElementById("tabs-content-wrapper")
    const tabsContents = tabsContentWrapper.children
    tabsContents[productInfoTable._selectedTab]?.classList.remove("selected")
    tabsContents[index].classList.add("selected")

    productInfoTable._selectedTab = index
  },
  init() {
    const tabs = document.getElementById("info-table-tabs")

    const buttons = [...tabs.children]

    for (const index in buttons) {
      const button = buttons[index]
      button.addEventListener("click", () => {
        productInfoTable._selectTab(Number(index))
      })
    }

  }
}

window.addEventListener("load", () => {
  productInfoTable.init()
});
