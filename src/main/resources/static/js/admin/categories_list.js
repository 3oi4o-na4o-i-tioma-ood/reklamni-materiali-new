function createCategoriesList(productType, containerId = null) {

    const categoriesList = {
        _containerId: null,
        _productType: null,
        _openedCategoryPath: [],
        _categories: [],
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
                        parentPath: categoriesList._openedCategoryPath.map(cat => cat.url).join('/'),
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
                const parentPath = categoriesList._openedCategoryPath
                    .map((category) => category.url)
                    .join("/");
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
                alert("losho");
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
        },
        async _pushCategory(category) {
            categoriesList._openedCategoryPath.push(category);

            categoriesList._renderCategoriesList(category.children || []);

            if (!category.children?.length) {
            }

            const categoryPathContainer = categoriesList._getContainer().querySelector(
                "#category-path-container"
            );

            const path = categoriesList._openedCategoryPath.flatMap((category, i) => {
                const button = document.createElement("button");
                button.innerText = category.name;
                button.addEventListener("click", () => {
                    categoriesList._openedCategoryPath.splice(i);
                    categoriesList._pushCategory(category);
                });
                return [" / ", button];
            });

            categoryPathContainer.innerText = "";

            categoryPathContainer.append(...path);
        },

        async CreateCategory(name, productType) {
            const searchParams = new URLSearchParams();

            searchParams.set("pathName", name);
            searchParams.set("name", name);

            searchParams.set("productType", productType);
            searchParams.set("path", name);

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
            const add_category_value = categoriesList._getContainer().querySelector("#create-category-value");

            add_category_button?.addEventListener("click", async (e) => {
                await this.CreateCategory(add_category_value.value, categoriesList._productType);
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