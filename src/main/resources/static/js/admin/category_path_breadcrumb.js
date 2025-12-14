const categoryPathBreadcrumb = {
    _defaultTargets: ["#category-path-container", "#topbar-category-path"],
    _normalize(pathInput) {
        if (!pathInput) {
            return [];
        }

        // Accept both string paths ("a/b/c") and arrays of { label, path }
        if (Array.isArray(pathInput)) {
            return pathInput
                .map((item, index) => {
                    if (typeof item === "string") {
                        const normalizedPath = pathInput.slice(0, index + 1).join("/");
                        return {
                            label: item,
                            path: normalizedPath,
                        };
                    }

                    return {
                        label: item.label || item.name || item.path || "",
                        path: item.path || item.url || "",
                    };
                })
                .filter((item) => item.label);
        }

        const parts = String(pathInput)
            .split("/")
            .map((p) => p.trim())
            .filter(Boolean);

        let current = [];
        return parts.map((part) => {
            current.push(part);
            return {
                label: decodeURIComponent(part),
                path: current.join("/"),
            };
        });
    },
    _defaultNavigate(path) {
        const url = new URL(window.location.href);

        if (path) {
            url.searchParams.set("categoryPath", path);
        } else {
            url.searchParams.delete("categoryPath");
        }

        window.location.href = url.toString();
    },
    render(pathInput, options = {}) {
        const segments = this._normalize(pathInput);
        const {
            targetSelectors = this._defaultTargets,
            onNavigate = this._defaultNavigate,
            clickable = true,
        } = options;

        const targets = targetSelectors
            .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
            .filter(Boolean);

        targets.forEach((target) => {
            target.innerHTML = "";

            if (!segments.length) {
                target.style.display = "none";
                return;
            }

            target.style.display = "";

            const fragments = [];
            segments.forEach((segment, index) => {
                if (index > 0) {
                    fragments.push(document.createTextNode(" / "));
                }

                const element = document.createElement(clickable ? "button" : "span");
                if (clickable) {
                    element.type = "button";
                }
                element.classList.add("category-path-button");
                if (clickable) {
                    element.classList.add("link-button");
                    element.addEventListener("click", (e) => {
                        e.preventDefault();
                        onNavigate(segment.path, e);
                    });
                }
                element.innerText = segment.label;

                fragments.push(element);
            });

            target.append(...fragments);
        });
    },
};
