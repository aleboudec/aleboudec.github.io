/**
 * 🏀 SAINT MARC BASKETBALL - BOUTIQUE EN LIGNE
 * --------------------------------------------
 * Gestion du panier, des commandes et des animations.
 * @author [Ton Nom]
 * @version 1.0.0
 */

/*************************
 * 🛒 DONNÉES DU PANIER
 *************************/
const CART_KEY = "smbCart"; // Clé unique pour éviter les conflits avec d'autres sites
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

/*************************
 * 🔄 FONCTIONS CORE PANIER
 *************************/
/**
 * Sauvegarde le panier dans localStorage.
 */
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Ajoute un produit au panier.
 * @param {string} name - Nom du produit
 * @param {string} size - Taille sélectionnée
 * @param {number} price - Prix unitaire
 */
function addToCart(name, size, price) {
  const existingItem = cart.find(item => item.name === name && item.size === size);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, size, price, quantity: 1 });
  }
  saveCart();
  updateCart();
}

/**
 * Supprime un article du panier.
 * @param {number} index - Index de l'article à supprimer
 */
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

/**
 * Vide entièrement le panier (avec confirmation).
 */
function clearCart() {
  if (confirm("Vider complètement le panier ?")) {
    cart = [];
    saveCart();
    updateCart();
  }
}

/*************************
 * 🎨 AFFICHAGE DU PANIER
 *************************/
/**
 * Met à jour l'affichage du panier (flottant + récapitulatif).
 */
function updateCart() {
  const cartList = document.getElementById("cart");
  const cartSummary = document.getElementById("orderSummary");
  const totalDisplay = document.getElementById("totalDisplay");
  const orderTotal = document.getElementById("orderTotal");

  // --- Affichage du panier flottant ---
  if (cart.length === 0) {
    cartList.innerHTML = `<p class="text-gray-500">Panier vide</p>`;
  } else {
    cartList.innerHTML = cart.map((item, index) => `
      <div class="flex justify-between items-start py-2 border-b border-gray-100">
        <div>
          <p class="font-medium">${item.name}</p>
          <p class="text-sm text-gray-500">${item.size} × ${item.quantity}</p>
        </div>
        <div class="text-right">
          <p class="font-medium">${item.price * item.quantity}€</p>
          <button onclick="removeFromCart(${index})" class="text-xs text-red-500 hover:text-red-700">×</button>
        </div>
      </div>
    `).join('');
  }

  // --- Récapitulatif dans le formulaire ---
  if (cartSummary) {
    cartSummary.innerHTML = cart.map(item => `
      <div class="flex justify-between py-1">
        <span>${item.name} (${item.size}) × ${item.quantity}</span>
        <span>${item.price * item.quantity}€</span>
      </div>
    `).join('');
  }

  // --- Calcul du total ---
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (totalDisplay) totalDisplay.textContent = `${total}€`;
  if (orderTotal) orderTotal.textContent = `${total}€`;
}

/*************************
 * ✉️ GESTION DES COMMANDES
 *************************/
/**
 * Génère le texte de la commande pour l'email.
 * @returns {string} Texte formaté pour l'email
 */
function buildCommandeText() {
  let text = "🛒 NOUVELLE COMMANDE – SAINT MARC BASKET\n\n";
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    text += `• ${item.name} (${item.size}) × ${item.quantity} = ${subtotal}€\n`;
  });

  text += `\n💰 TOTAL : ${total}€`;
  text += `\n📦 Retrait : Au club`;
  return text;
}

/**
 * Valide le formulaire avant envoi.
 */
function setupFormValidation() {
  const form = document.getElementById("orderForm");
  if (form) {
    form.addEventListener("submit", function(e) {
      if (cart.length === 0) {
        e.preventDefault();
        alert("Votre panier est vide ! Ajoutez des articles avant de commander.");
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
      } else {
        document.getElementById("hiddenCommande").value = buildCommandeText();
      }
    });
  }
}

/*************************
 * 🖱️ ÉCOUTEURS D'ÉVÉNEMENTS
 *************************/
function setupEventListeners() {
  // --- Bouton "Vider le panier" ---
  const clearCartBtn = document.getElementById("clearCartBtn");
  if (clearCartBtn) clearCartBtn.addEventListener("click", clearCart);

  // --- Animations au scroll ---
  const fadeElements = document.querySelectorAll('.fade');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('animate-fade-in');
    });
  }, { threshold: 0.1 });
  fadeElements.forEach(el => observer.observe(el));
}

/*************************
 * 🚀 INITIALISATION
 *************************/
function init() {
  updateCart();          // Met à jour le panier au chargement
  setupFormValidation(); // Configure la validation du formulaire
  setupEventListeners(); // Active les écouteurs d'événements
}

// Lancement de l'application
init();
