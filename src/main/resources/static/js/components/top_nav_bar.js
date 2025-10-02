const topNavBar = {
    initSlidingMenu() {
        const menuButton = document.getElementById("sliding-menu-button");
        const menu = document.getElementById("sliding-menu");
        const backdrop = document.getElementById("sliding-menu-backdrop");
        backdrop.style.display = "none";

        menuButton.addEventListener("click", () => {
            backdrop.style.display = "block";

            setTimeout(() => {
                menu.classList.add("open");
                backdrop.classList.add("visible");
            });
        });
    },

    initCloseSideBAr() {
        const closeBtn = document.getElementById('close-btn');
        const menu = document.getElementById("sliding-menu");
        const backdrop = document.getElementById("sliding-menu-backdrop");

        closeBtn.addEventListener('click', () => {
            setTimeout(() => {
                menu.classList.remove("open");
                setTimeout(() => {
                    backdrop.classList.remove("visible");
                    backdrop.style.display = "none";
                }, 300);
            });
        });
    },

    _initAdminLink() {
        const token = auth.getToken();
        const parsedToken = auth.parseToken(token);

        if (parsedToken?.role === "ADMIN") {
            const adminLink = document.getElementById("top-nav-bar-admin-link");
            adminLink.style.display = null;
        }
    },

    // Handle clicks anywhere in the document and close the sidebar if the click is outside
    _initClickAnywhere() {
        document.addEventListener('click', (e) => {
            const menu = document.getElementById("sliding-menu");
            const backdrop = document.getElementById("sliding-menu-backdrop");
            // Check if the clicked target is outside the menu or backdrop and not the menu button
            if (menu.contains(e.target) || backdrop.contains(e.target)) {
            setTimeout(() => {
                menu.classList.remove("open");
                setTimeout(() => {
                    backdrop.classList.remove("visible");
                    backdrop.style.display = "none";
                }, 300);
            });
            }
        });
    },

    init() {
        const profileLink = document.getElementById("top-nav-bar-profile-link");
        const token = auth.getToken();

        if (token) {
            profileLink.href = "/профил";
        } else {
            profileLink.href = "/влизане";
        }

        this._initClickAnywhere();
        this.initSlidingMenu();
        this._initAdminLink();
        this.initCloseSideBAr();
    }
}

window.addEventListener("load", () => {
    topNavBar.init();
});
