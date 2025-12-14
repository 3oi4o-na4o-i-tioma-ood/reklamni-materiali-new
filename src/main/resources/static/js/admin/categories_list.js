function createCategoriesList(productType, containerId = null) {

    const categoriesList = {
        _containerId: null,
        _productType: null,
        _openedCategoryPath: [],
        _categories: [],
        _deletePopupId: "delete-category-popup",
        _deleteMessageEl: null,
        _deletePathEl: null,
        _deleteConfirmButton: null,
        async init(productType, containerId = null) {
            this._productType = productType;
            this._containerId = containerId;

            this.initCreateCategory();

            await categoriesList._fetchCategories();

            categoriesList._renderCategoriesList(categoriesList._categories);
        },
        _getContainer() {
            if (!categoriesList._containerId) {
                return document
            }

            return document.querySelector(`#${categoriesList._containerId}`);
        },

        async _moveCategory(index, shouldMoveUp) {
            try {
                // Get all items
                const allItems = categoriesList._getContainer().querySelectorAll('#categories-list li');
                const totalItems = allItems.length;
                // Create reversed priorities (higher numbers at top)
                const currentPriorities = Array.from(allItems).map((_, idx) => totalItems - idx);

                // Swap priorities with the item above
                const temp = currentPriorities[index];
                if (shouldMoveUp) {
                    currentPriorities[index] = currentPriorities[index - 1];
                    currentPriorities[index - 1] = temp;
                } else {
                    currentPriorities[index] = currentPriorities[index + 1];
                    currentPriorities[index + 1] = temp;
                }

                // Send request to update priorities
                const response = await fetch(`${backendUrl}/admin/categories/priority`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem("JWT")
                    },
                    body: JSON.stringify({
                        productType: categoriesList._productType,
                        parentPath: categoriesList._getCategoryPath(),
                        newPriorities: currentPriorities
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to update priority');
                }

                // Refresh the categories list
                await categoriesList._fetchCategories();
                categoriesList._renderCategoriesList(categoriesList._categories);
            } catch (error) {
                console.error('Error updating priority:', error);
            }
        },
        _getCategoryPath() {
            return categoriesList._openedCategoryPath.map(cat => cat.url).join('/');
        },
        _ensureDeletePopup() {
            let popupElement = document.getElementById(categoriesList._deletePopupId);
            if (!popupElement) {
                popupElement = document.createElement("div");
                popupElement.id = categoriesList._deletePopupId;
                popupElement.classList.add("popup");
                popupElement.innerHTML = `
                    <div class="content">
                        <div class="header">
                            <span>Изтриване на категория</span>
                            <button type="button" class="icon-button close-button" aria-label="Затвори">&#215;</button>
                        </div>
                        <div class="popup-body">
                            <p class="delete-popup-text" id="delete-category-message"></p>
                            <div class="delete-popup-path" id="delete-category-path"></div>
                            <div class="delete-popup-actions">
                                <button type="button" class="button primary" id="delete-category-confirm-button">Да</button>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(popupElement);
                popup.init(categoriesList._deletePopupId);
            }

            categoriesList._deleteMessageEl = popupElement.querySelector("#delete-category-message");
            categoriesList._deletePathEl = popupElement.querySelector("#delete-category-path");
            categoriesList._deleteConfirmButton = popupElement.querySelector("#delete-category-confirm-button");
        },
        _openDeletePopup({ message, path, onConfirm }) {
            categoriesList._ensureDeletePopup();

            if (categoriesList._deleteMessageEl) {
                categoriesList._deleteMessageEl.innerText = message;
            }
            if (categoriesList._deletePathEl) {
                categoriesList._deletePathEl.innerText = path || "/";
            }
            if (categoriesList._deleteConfirmButton) {
                categoriesList._deleteConfirmButton.onclick = async () => {
                    popup.close(categoriesList._deletePopupId);
                    await onConfirm();
                };
            }

            popup.open(categoriesList._deletePopupId);
        },
        async _deleteCategory(fullPath) {
            const searchParams = new URLSearchParams();
            searchParams.set("productType", categoriesList._productType);
            searchParams.set("path", fullPath || "");
            searchParams.set("force", "true");

            const response = await fetch(`${backendUrl}/admin/categories?${searchParams.toString()}`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("JWT"),
                },
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => "");
                const err = new Error(`HTTP error! Status: ${response.status}`);
                err.responseText = errorText;
                throw err;
            }
        },
        _createCategoryItem(category, index) {
            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.alignItems = "center";
            li.style.gap = "10px";

            // Create arrows container
            const arrowsContainer = document.createElement("div");
            arrowsContainer.style.display = "flex";
            arrowsContainer.style.flexDirection = "column";
            arrowsContainer.style.gap = "2px";


            // Create up arrow button
            const upArrow = document.createElement("button");
            upArrow.classList.add("button", "secondary");
            upArrow.innerHTML = "↑";
            upArrow.style.padding = "0 4px";
            upArrow.style.cursor = "pointer";
            upArrow.style.background = "none";
            upArrow.style.marginLeft = "10px";
            upArrow.disabled = index === 0; // Disable up arrow for first item
            upArrow.addEventListener("click", () => {
                categoriesList._moveCategory(index, true);
            });

            // Create down arrow button
            const downArrow = document.createElement("button");
            downArrow.classList.add("button", "secondary");
            downArrow.innerHTML = "↓";
            downArrow.style.padding = "0 4px";
            downArrow.style.cursor = "pointer";
            downArrow.style.background = "none";
            downArrow.style.marginLeft = "10px";
            const allItems = categoriesList._getContainer().querySelectorAll('#categories-list li');
            downArrow.disabled = index === allItems.length - 1; // Disable down arrow for last item
            downArrow.addEventListener("click", () => {
                categoriesList._moveCategory(index, false);
            });

            arrowsContainer.appendChild(upArrow);
            arrowsContainer.appendChild(downArrow);
            li.appendChild(arrowsContainer);

            let mainButton;
            if (category.children?.length) {
                mainButton = document.createElement("button");
                mainButton.addEventListener("click", () => {
                    categoriesList._pushCategory(category);
                });
            } else {
                mainButton = document.createElement("a");
                const parentPath = categoriesList._getCategoryPath();
                const path = (parentPath ? parentPath + "/" : "") + category.url;
                const productDescription = products.find(p => p.name === categoriesList._productType);
                mainButton.href =
                    `/админ/${productDescription.url}/редактиране-на-категория?categoryPath=${path}`;
            }
            mainButton.classList.add("main-button");

            const folderIcon = document.createElement("img");
            folderIcon.src = "/images/admin/folder.svg";
            folderIcon.alt = "folder";
            mainButton.append(folderIcon, category.name);

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("icon-button");

            const deleteIcon = document.createElement("img");
            deleteIcon.src = "/images/common/delete.svg";
            deleteIcon.alt = "delete";
            deleteButton.append(deleteIcon);

            deleteButton.addEventListener("click", () => {
                const parentPath = categoriesList._getCategoryPath();
                const fullPath = [parentPath, category.url].filter(Boolean).join("/");

                categoriesList._openDeletePopup({
                    message: "Сигурни ли сте, че искате да изтриете тази категория? Всички подкатегории и изображения в нея ще бъдат изтрити.",
                    path: fullPath || "/",
                    onConfirm: async () => {
                        try {
                            await categoriesList._deleteCategory(fullPath);
                            await categoriesList._fetchCategories();

                            // Re-open the parent path after deletion
                            categoriesList._openPath(parentPath);

                            const snackbar = document.getElementById("snackbar");
                            if (snackbar) {
                                snackbar.innerHTML = "Категорията е изтрита успешно!";
                                snackbar.classList.add("visible");
                                setTimeout(() => {
                                    snackbar.classList.remove("visible");
                                }, 3000);
                            }
                        } catch (error) {
                            console.error("Error deleting category:", error);
                            const snackbar = document.getElementById("snackbar");
                            const message = error?.responseText || "Възникна грешка при изтриването.";
                            if (snackbar) {
                                snackbar.innerHTML = message;
                                snackbar.classList.add("visible");
                                setTimeout(() => {
                                    snackbar.classList.remove("visible");
                                }, 4000);
                            } else {
                                alert(message);
                            }
                        }
                    }
                });
            });

            li.append(mainButton, deleteButton);

            return li;
        },
        _renderCategoriesList(categories) {
            const categoriesListElement = categoriesList._getContainer().querySelector(`#categories-list`);
            if (!categoriesListElement) {
                console.error('Categories list element not found');
                return;
            }

            // Ensure categories is an array
            const categoriesToRender = Array.isArray(categories) ? categories : [];

            const listItems = categoriesToRender.map((category, index) =>
                categoriesList._createCategoryItem(category, index)
            );

            categoriesListElement.innerText = "";
            categoriesListElement.append(...listItems);

            categoriesList._renderPath();
        },
        _renderPath() {
            const categoryPathContainer = categoriesList._getContainer().querySelector(
                "#category-path-container"
            );
            const targets = ["#category-path-container", "#topbar-category-path"];

            console.log(categoriesList._openedCategoryPath);
            const segments = categoriesList._openedCategoryPath.map((category, index) => ({
                label: category.name,
                path: categoriesList._openedCategoryPath
                    .slice(0, index + 1)
                    .map((cat) => cat.url)
                    .join("/"),
            }));

            if (typeof categoryPathBreadcrumb !== "undefined") {
                console.log("Categories list segments:", segments);
                categoryPathBreadcrumb.render(segments, {
                    targetSelectors: targets,
                    onNavigate: (path) => {
                        categoriesList._openPath(path);
                    },
                });
                return;
            }

            if (!categoryPathContainer) {
                return;
            }

            const path = segments.flatMap((segment, i) => {
                const button = document.createElement("button");
                button.innerText = segment.label;
                button.addEventListener("click", () => {
                    categoriesList._openedCategoryPath.splice(i + 1);
                    categoriesList._pushCategory(categoriesList._openedCategoryPath[i]);
                });
                return [" / ", button];
            });

            categoryPathContainer.innerText = "";
            categoryPathContainer.append(...path);
        },
        _openPath(path) {
            const parts = (path || "").split("/").filter(Boolean);
            let currentChildren = categoriesList._categories;
            categoriesList._openedCategoryPath = [];

            for (const part of parts) {
                const found = currentChildren.find((c) => c.url === part);
                if (!found) {
                    break;
                }
                categoriesList._openedCategoryPath.push(found);
                currentChildren = found.children || [];
            }

            categoriesList._renderCategoriesList(currentChildren || []);
        },
        async _pushCategory(category) {
            categoriesList._openedCategoryPath.push(category);

            categoriesList._renderCategoriesList(category.children || []);
        },

        async createCategory(displayName, pathName, productType) {
            const searchParams = new URLSearchParams();

            const selectedPath = categoriesList._getCategoryPath();

            searchParams.set("pathName", pathName);
            searchParams.set("name", displayName);

            searchParams.set("productType", productType);
            searchParams.set("path", selectedPath || '/');

            await fetch(`${backendUrl}/admin/categories?${searchParams.toString()}`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("JWT"),
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const snackbar = document.getElementById("snackbar");
                    snackbar.innerHTML = "категорията е създадена успешно!";
                    snackbar.classList.add("visible");

                    setTimeout(() => {
                        snackbar.classList.remove("visible");
                    }, 3000);

                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error deleting the category picture:", error);

                    alert("Error creating category");
                });
        },

        initCreateCategory() {
            const add_category_button = categoriesList._getContainer().querySelector("#create-category");
            const addCategoryDisplayName = categoriesList._getContainer().querySelector("#create-category-display-name");
            const addCategoryPathName = categoriesList._getContainer().querySelector("#create-category-path-name");

            add_category_button?.addEventListener("click", async (e) => {
                await this.createCategory(addCategoryDisplayName.value, addCategoryPathName.value, categoriesList._productType);
            });
        },

        async _fetchCategories() {
            try {
                const response = await API.getCategories(categoriesList._productType);
                console.log('Categories response:', response); // Debug log

                // Ensure we have an array to work with
                categoriesList._categories = Array.isArray(response) ? response : [];

                if (!Array.isArray(response)) {
                    console.error('Expected array of categories, got:', typeof response);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                categoriesList._categories = [];
            }
        },
    }

    categoriesList.init(productType, containerId);

    return categoriesList;
}