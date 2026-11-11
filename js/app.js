
/* =========================================
   01. PRODUCT DATABASE
========================================= */

const products = [
    {
        id: 1,
        name: "Aero Run Pro",
        category: "Running",
        price: 89.99,
        rating: "★ 4.9",
        tag: "BEST SELLER",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 2,
        name: "Training Essential",
        category: "Fitness",
        price: 39.99,
        rating: "★ 4.8",
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 3,
        name: "Trail Explorer",
        category: "Outdoor",
        price: 119.99,
        rating: "★ 4.9",
        tag: "POPULAR",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 4,
        name: "Urban Sport",
        category: "Running",
        price: 64.99,
        rating: "★ 4.7",
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 5,
        name: "Power Training",
        category: "Fitness",
        price: 49.99,
        rating: "★ 4.8",
        tag: "TRENDING",
        image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 6,
        name: "Mountain Pack",
        category: "Outdoor",
        price: 79.99,
        rating: "★ 4.6",
        tag: "ESSENTIAL",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 7,
        name: "Speed Motion",
        category: "Running",
        price: 99.99,
        rating: "★ 4.9",
        tag: "LIMITED",
        image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 8,
        name: "Active Training",
        category: "Fitness",
        price: 34.99,
        rating: "★ 4.7",
        tag: "ESSENTIAL",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&q=85"
    }
];


/* =========================================
   02. APPLICATION STATE
========================================= */

let cart = JSON.parse(localStorage.getItem("decathlon-cart")) || [];

let favorites = JSON.parse(
    localStorage.getItem("decathlon-favorites")
) || [];

let currentFilter = "All";
let searchQuery = "";


/* =========================================
   03. DOM ELEMENTS
========================================= */

const productGrid = document.getElementById("productGrid");
const productTotal = document.getElementById("productTotal");
const emptyState = document.getElementById("emptyState");

const cartDrawer = document.getElementById("cartDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");

const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


/* =========================================
   04. UTILITIES
========================================= */

function saveData() {
    localStorage.setItem("decathlon-cart", JSON.stringify(cart));

    localStorage.setItem(
        "decathlon-favorites",
        JSON.stringify(favorites)
    );
}

function formatPrice(price) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR"
    }).format(price);
}

let toastTimeout;

function showToast(message) {
    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================================
   05. PRODUCT RENDERING
========================================= */

function renderProducts() {

    let filteredProducts = products.filter(product => {

        const matchesCategory =
            currentFilter === "All" ||
            product.category === currentFilter;

        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery) ||
            product.category.toLowerCase().includes(searchQuery);

        return matchesCategory && matchesSearch;
    });

    productGrid.innerHTML = "";

    productTotal.textContent =
        `${filteredProducts.length} produits`;

    emptyState.hidden = filteredProducts.length !== 0;

    filteredProducts.forEach((product, index) => {

        const isFavorite = favorites.includes(product.id);

        const card = document.createElement("article");

        card.className = "product-card";

        card.style.animationDelay = `${index * 60}ms`;

        card.innerHTML = `
            <div class="product-visual">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                <span class="product-tag">
                    ${product.tag}
                </span>

                <button
                    class="favorite-btn ${isFavorite ? "selected" : ""}"
                    data-favorite="${product.id}"
                    aria-label="Ajouter aux favoris"
                    aria-pressed="${isFavorite}"
                >
                    <i data-lucide="heart"></i>
                </button>

                <button
                    class="quick-add"
                    data-add="${product.id}"
                >
                    + AJOUTER AU PANIER
                </button>

            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>${product.name}</h3>

                <div class="product-bottom">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <span class="product-rating">
                        ${product.rating}
                    </span>

                </div>

            </div>
        `;

        productGrid.appendChild(card);
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}


/* =========================================
   06. FILTERS
========================================= */

document.getElementById("filters").addEventListener("click", event => {

    const button = event.target.closest("[data-filter]");

    if (!button) return;

    currentFilter = button.dataset.filter;

    document.querySelectorAll(".filter").forEach(filter => {
        filter.classList.remove("active");
    });

    button.classList.add("active");

    renderProducts();
});


/* =========================================
   07. SEARCH
========================================= */

document.getElementById("searchToggle").addEventListener("click", () => {

    searchPanel.classList.toggle("open");

    if (searchPanel.classList.contains("open")) {
        searchInput.focus();
    }
});

document.getElementById("closeSearch").addEventListener("click", () => {
    searchPanel.classList.remove("open");
});

searchInput.addEventListener("input", event => {

    searchQuery = event.target.value.trim().toLowerCase();

    renderProducts();

});


/* =========================================
   08. CART
========================================= */

function addToCart(id) {

    const product = products.find(item => item.id === id);

    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveData();
    updateCart();

    showToast(`${product.name} ajouté au panier`);
}

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    saveData();
    updateCart();

}

function updateCart() {

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const total = cart.reduce((sum, item) => {

        const product = products.find(p => p.id === item.id);

        return sum + (product.price * item.quantity);

    }, 0);

    document.getElementById("cartCount").textContent = count;

    document.getElementById("drawerCount").textContent = `(${count})`;

    document.getElementById("cartTotal").textContent =
        formatPrice(total);

    const cartItems = document.getElementById("cartItems");

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="cart-empty">
                <p>Ton panier est encore vide.</p>
                <p>Il est temps de trouver ton prochain équipement !</p>
            </div>
        `;

        return;
    }

    cartItems.innerHTML = cart.map(item => {

        const product = products.find(p => p.id === item.id);

        return `
            <div class="cart-item">

                <img src="${product.image}" alt="${product.name}">

                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <p>
                        ${formatPrice(product.price)}
                        × ${item.quantity}
                    </p>
                </div>

                <button
                    class="remove-item"
                    data-remove="${product.id}"
                >
                    Supprimer
                </button>

            </div>
        `;

    }).join("");

}

function openCart() {
    cartDrawer.classList.add("open");
    drawerBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartDrawer.classList.remove("open");
    drawerBackdrop.classList.remove("open");
    document.body.style.overflow = "";
}

document.getElementById("cartToggle").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeCart);

drawerBackdrop.addEventListener("click", closeCart);


/* =========================================
   09. FAVORITES
========================================= */

function toggleFavorite(id) {

    if (favorites.includes(id)) {

        favorites = favorites.filter(item => item !== id);

        showToast("Retiré des favoris");

    } else {

        favorites.push(id);

        showToast("Ajouté aux favoris");

    }

    saveData();
    updateFavorites();
    renderProducts();
}

function updateFavorites() {

    document.getElementById("favoriteCount").textContent =
        favorites.length;
}

document.getElementById("favoritesToggle").addEventListener("click", () => {

    if (favorites.length === 0) {
        showToast("Aucun produit dans tes favoris");
        return;
    }

    currentFilter = "All";
    searchQuery = "";

    searchInput.value = "";

    document.querySelectorAll(".filter").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === "All"
        );
    });

    productGrid.innerHTML = "";

    const favoriteProducts = products.filter(product =>
        favorites.includes(product.id)
    );

    favoriteProducts.forEach(product => {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-visual">

                <img src="${product.image}" alt="${product.name}">

                <button
                    class="favorite-btn selected"
                    data-favorite="${product.id}"
                    aria-label="Retirer des favoris"
                >
                    <i data-lucide="heart"></i>
                </button>

                <button
                    class="quick-add"
                    data-add="${product.id}"
                >
                    + AJOUTER AU PANIER
                </button>

            </div>

            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>
                <span class="product-price">${formatPrice(product.price)}</span>
            </div>
        `;

        productGrid.appendChild(card);

    });

    productTotal.textContent = `${favoriteProducts.length} favoris`;

    emptyState.hidden = favoriteProducts.length !== 0;

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });

    lucide.createIcons();
});


/* =========================================
   10. GLOBAL CLICK HANDLER
========================================= */

document.addEventListener("click", event => {

    const addButton = event.target.closest("[data-add]");

    const favoriteButton = event.target.closest("[data-favorite]");

    const removeButton = event.target.closest("[data-remove]");

    if (addButton) {
        addToCart(Number(addButton.dataset.add));
    }

    if (favoriteButton) {
        toggleFavorite(Number(favoriteButton.dataset.favorite));
    }

    if (removeButton) {
        removeFromCart(Number(removeButton.dataset.remove));
    }

});


/* =========================================
   11. MOBILE MENU
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("open");

});

navLinks.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
    });

});


/* =========================================
   12. NEWSLETTER
========================================= */

document.getElementById("newsletterForm").addEventListener("submit", event => {

    event.preventDefault();

    const email = document.getElementById("newsletterEmail");

    if (!email.checkValidity()) {
        email.reportValidity();
        return;
    }

    showToast("Merci ! Inscription de démonstration réussie.");

    email.value = "";

});


/* =========================================
   13. CHECKOUT DEMO
========================================= */

document.getElementById("checkoutBtn").addEventListener("click", () => {

    if (cart.length === 0) {
        showToast("Ton panier est vide");
        return;
    }

    showToast("Le paiement sera disponible dans une prochaine version.");

});


/* =========================================
   14. SCROLL EFFECTS
========================================= */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    header.classList.toggle("scrolled", window.scrollY > 30);

}, { passive: true });


const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.15
});

document.querySelectorAll(
    ".section-heading, .category-card, .experience-content, .newsletter"
).forEach(element => {

    element.classList.add("reveal");

    observer.observe(element);

});


/* =========================================
   15. GSAP HERO ANIMATION
========================================= */

function initAnimations() {

    if (!window.gsap) return;

    const timeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    timeline
        .from(".hero-content .eyebrow", {
            opacity: 0,
            y: 20,
            duration: 0.6
        })
        .from(".hero h1", {
            opacity: 0,
            y: 70,
            duration: 1
        }, "-=0.2")
        .from(".hero-content > p", {
            opacity: 0,
            y: 20,
            duration: 0.7
        }, "-=0.5")
        .from(".hero-buttons", {
            opacity: 0,
            y: 20,
            duration: 0.6
        }, "-=0.4");

}

function waitForGSAP() {

    if (window.gsap) {
        initAnimations();
        return;
    }

    setTimeout(waitForGSAP, 100);
}


/* =========================================
   16. INITIALIZATION
========================================= */

function init() {

    renderProducts();

    updateCart();

    updateFavorites();

    if (window.lucide) {
        lucide.createIcons();
    }

    waitForGSAP();

}

init();
document.querySelectorAll("[data-category]").forEach(card => {
    card.addEventListener("click", () => {
        currentFilter = card.dataset.category;

        document.querySelectorAll(".filter").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.filter === currentFilter
            );
        });

        renderProducts();
    });
});