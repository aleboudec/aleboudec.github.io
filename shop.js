// === DONNÉES PRODUITS ===
const products = [
  {
    id: 1,
    name: "Surmaillot",
    price: 35.90,
    img: "surmaillot.png",
    sizes: ["S", "M", "L", "XL", "XXL"],
    new: true
  },
  {
    id: 2,
    name: "Jogging",
    price: 19.90,
    img: "jogging.png",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 3,
    name: "Veste Zippée",
    price: 22.90,
    img: "veste.png",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 4,
    name: "Sweat à Capuche",
    price: 24.90,
    img: "sweat.png",
    sizes: ["S", "M", "L", "XL", "XXL"]
  }
];

// === ÉLÉMENTS DOM ===
const productGrid = document.getElementById("productGrid");
const cartList = document.getElementById("cartList");
const floatingCart = document.getElementById("floatingCart");
const cartItemCount = document.getElementById("cartItemCount");
const totalDisplay = document.getElementById("total");
const orderSummary = document.getElementById("orderSummary");
const orderTotal = document.getElementById("orderTotal");

// === PANIER (avec localStorage) ===
let cart = JSON.parse(localStorage.getItem('smbCart')) || [];

// === AFFICHAGE DES PRODUITS ===
products.forEach(product => {
  const card = document.createElement("div");
  card.className = "product-card bg-white rounded-xl2 shadow-card p-4 fade delay-2 relative";

  card.innerHTML = `
    ${product.new ? '<span class="badge">Nouveau</span>' : ''}
    <img src="${product.img}" loading="lazy" class="w-full h-48 sm:h-56 object-contain mb-4"
         onerror="this.src='https://via.placeholder.com/300/2F4A40/FFFFFF?text=${encodeURIComponent(product.name)}'">
    <h4 class="font-semibold text-lg mb-1">${product.name}</h4>
    <p class="text-primary font-bold mb-3">${product.price.toFixed(2)}€</p>

    <div class="flex items-center gap-2 mb-3">
      <label class="text-sm">Quantité :</label>
      <input type="number" id="quantity-${product.id}" min="1" value="1"
             class="w-16 border rounded-xl2 px-2 py-1 text-center">
    </div>

    <label class="text-sm block mb-2">Taille :</label>
    <select id="size-${product.id}" class="border rounded-xl2 px-3 py-2 w-full mb-4">
      ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
    </select>

    <button onclick="addToCart(${product.id})"
            class="w-full bg-accent text-white py-2 rounded-xl2 hover:bg-highlight transition-colors product-card-button">
      Ajouter au panier
    </button>
  `;

  productGrid.appendChild(card);
});

// === GESTION DU PANIER ===
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const size = document.getElementById(`size-${id}`).value;
  const quantity = parseInt(document.getElementById(`quantity-${id}`).value);

  // Vérification de la quantité
  if (quantity <= 0) {
    alert("La quantité doit être supérieure à 0");
    return;
  }

  // Arrondir le prix à 2 décimales
  const roundedPrice = parseFloat(product.price.toFixed(2));

  // Vérifier si le produit existe déjà dans le panier avec la même taille
  const existingItem = cart.find(item => item.id === id && item.size === size);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, price: roundedPrice, size, quantity });
  }

  updateCart();

  // Animation du bouton
  const button = event.target;
  button.textContent = "Ajouté !";
  button.classList.add("bg-highlight", "animate-pulse-once");
  setTimeout(() => {
    button.textContent = "Ajouter au panier";
    button.classList.remove("bg-highlight");
  }, 1500);

  // Afficher le panier flottant
  floatingCart.classList.remove("translate-y-2", "opacity-0", "invisible");
  setTimeout(() => {
    floatingCart.classList.add("translate-y-0", "opacity-100", "visible");
  }, 10);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  // Sauvegarder dans localStorage
  localStorage.setItem('smbCart', JSON.stringify(cart));

  // Mettre à jour le compteur
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartItemCount.textContent = totalItems;
  cartItemCount.classList.toggle('hidden', totalItems === 0);

  // Cas du panier vide
  if (cart.length === 0) {
    cartList.innerHTML = '<p class="text-gray-500 text-sm">Aucun article</p>';
    orderSummary.innerHTML = '<p class="text-gray-500">Votre panier est vide</p>';
    totalDisplay.textContent = "0.00€";
    orderTotal.textContent = "0.00€";
    floatingCart.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => {
      floatingCart.classList.add("invisible");
    }, 300);
    return;
  }

  // Calcul du total général
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Liste dans le panier flottant
  cartList.innerHTML = cart.map((item, index) => {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    return `
      <div class="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
        <div>
          <p class="font-medium">${item.name}</p>
          <p class="text-sm text-gray-500">${item.size} × ${item.quantity}</p>
        </div>
        <div class="text-right">
          <p class="font-medium">${itemTotal}€</p>
          <button onclick="removeFromCart(${index})" class="text-xs text-red-500 hover:text-red-700">×</button>
        </div>
      </div>
    `;
  }).join('');

  // Récapitulatif dans le formulaire
  orderSummary.innerHTML = cart.map(item => {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    return `
      <div class="flex justify-between py-1">
        <span>${item.name} (${item.size}) × ${item.quantity}</span>
        <span>${itemTotal}€</span>
      </div>
    `;
  }).join('');

  // Mise à jour des totaux (avec 2 décimales)
  totalDisplay.textContent = `${total.toFixed(2)}€`;
  orderTotal.textContent = `${total.toFixed(2)}€`;
}

// === VALIDATION DU FORMULAIRE ===
document.getElementById("orderForm").addEventListener("submit", function(e) {
  if (cart.length === 0) {
    e.preventDefault();
    alert("Votre panier est vide ! Ajoutez des articles avant de commander.");
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  document.getElementById("hiddenCommande").value = buildCommandeText();
});

// === ANIMATIONS AU SCROLL ===
const fadeElements = document.querySelectorAll('.fade');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in');
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));

// === INITIALISATION ===
document.addEventListener('DOMContentLoaded', function() {
  if (!totalDisplay || !orderTotal) {
    console.error("Éléments du panier non trouvés ! Vérifiez les IDs dans le HTML.");
    return;
  }
  updateCart();
});

// === GESTION DU PANIER FLOTTANT ===
document.addEventListener('click', function(e) {
  if (!floatingCart.contains(e.target) && !e.target.closest('.product-card-button')) {
    floatingCart.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => {
      floatingCart.classList.add("invisible");
    }, 300);
  }
});

function clearCart() {
  cart = [];
  localStorage.removeItem('smbCart');
  updateCart();
}

const clearCartBtn = document.getElementById("clearCartBtn");
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", clearCart);
}

// Fonction pour construire le texte de la commande (à adapter selon tes besoins)
function buildCommandeText() {
  return cart.map(item =>
    `${item.name} (${item.size}) × ${item.quantity} - ${(item.price * item.quantity).toFixed(2)}€`
  ).join('\n');
}
