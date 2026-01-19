/*************************
 * 🛒 DONNÉES PANIER
 *************************/
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/*************************
 * 🧠 OUTILS
 *************************/
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/*************************
 * ➕ AJOUT AU PANIER
 *************************/
function addToCart(name, size, price) {
  const existingItem = cart.find(
    item => item.name === name && item.size === size
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      size,
      price,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
}

/*************************
 * ❌ SUPPRESSION ARTICLE
 *************************/
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

/*************************
 * 🎨 AFFICHAGE PANIER
 *************************/
function renderCart() {
  const cartEl = document.getElementById("cart");
  const totalDisplay = document.getElementById("totalDisplay");

  if (cart.length === 0) {
    cartEl.innerHTML = `<p class="text-gray-500">Panier vide</p>`;
    totalDisplay.textContent = "0€";
    return;
  }

  let total = 0;

  cartEl.innerHTML = cart
    .map((item, index) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      return `
        <div class="flex justify-between items-center py-2 border-b">
          <div>
            <p class="font-medium">${item.name}</p>
            <p class="text-sm text-gray-500">
              Taille ${item.size} × ${item.quantity}
            </p>
          </div>
          <div class="text-right">
            <p class="font-bold">${subtotal}€</p>
            <button
              onclick="removeFromCart(${index})"
              class="text-xs text-red-600 hover:underline"
            >
              Supprimer
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  totalDisplay.textContent = `${total}€`;
}

/*************************
 * ✉️ TEXTE COMMANDE (EMAIL)
 *************************/
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

/*************************
 * ✅ VALIDATION FORMULAIRE
 *************************/
document.getElementById("orderForm").addEventListener("submit", function (e) {
  if (cart.length === 0) {
    e.preventDefault();
    alert("🛒 Ajoute au moins un produit avant de commander !");
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    return;
  }

  document.getElementById("hiddenCommande").value = buildCommandeText();
});

/*************************
 * 🚀 INITIALISATION
 *************************/
renderCart();
