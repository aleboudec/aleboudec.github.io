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
 * ✅ VIDER LE PANIER
 *************************/
function clearCart() {
  console.log("🧹 clearCart appelée");
  if (!confirm("Vider complètement le panier ?")) return;

  cart = [];
  saveCart();
  renderCart();
}

const btn = document.getElementById("clearCartBtn");

console.log("BTN =", btn);

if (btn) {
  btn.addEventListener("click", function () {
    alert("🧨 CLIC DÉTECTÉ");
    console.log("CLIC OK");
  });
} else {
  console.log("❌ bouton introuvable");
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

document.getElementById("clearCartBtn").addEventListener("click", clearCart);

/*************************
 * 🚀 INITIALISATION
 *************************/
renderCart();

tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#2F4A40',
            accent: '#5EC19E',
            highlight: '#A7E6C4',
            contrast: '#FFFFFF'
          },
          boxShadow: {
            soft: '0 4px 12px rgba(0,0,0,0.08)',
            card: '0 8px 20px rgba(0,0,0,0.12)',
            hover: '0 12px 24px rgba(0,0,0,0.15)'
          },
          borderRadius: {
            xl2: '1.25rem'
          },
          animation: {
            'fade-in': 'fadeIn 0.6s ease-out forwards',
            'pulse-once': 'pulse 1.5s ease-out 1'
          },
          keyframes: {
            fadeIn: {
              '0%': { opacity: '0', transform: 'translateY(12px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' }
            }
          }
        }
      }
    }
