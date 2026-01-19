const productCards = Array.from(document.querySelectorAll('.product-card'));
const orderSummaryEl = document.getElementById('order-summary');
const hiddenCommande = document.getElementById('hidden-commande');

function buildCommandeText() {
  let text = "🛒 NOUVELLE COMMANDE – SAINT MARC BASKET\n\n";
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    text += `• ${item.name} (Taille : ${item.size}) × ${item.quantity} = ${subtotal}€\n`;
  });

  text += `\n💰 TOTAL : ${total}€`;
  text += `\n📦 Retrait : Au club`;

  return text;
}

function buildOrder() {
  let text = "🛒 NOUVELLE COMMANDE – SAINT MARC BASKET\n\n";
  let total = 0;
  let hasItem = false;

  productCards.forEach(card => {
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const size = card.querySelector('.size').value;
    const qty = parseInt(card.querySelector('.qty').value);

    if (qty > 0) {
      hasItem = true;
      const subtotal = price * qty;
      total += subtotal;
      text += `• ${name} (Taille : ${size}) × ${qty} = ${subtotal.toFixed(2)} €\n`;
    }
  });

  if (!hasItem) {
    orderSummaryEl.innerHTML = "<em>Aucun article sélectionné.</em>";
    hiddenCommande.value = "";
    return;
  }

  text += `\n💰 TOTAL : ${total.toFixed(2)} €`;
  text += `\n📦 Retrait : Au club`;

  orderSummaryEl.innerHTML = `<pre>${text}</pre>`;
  hiddenCommande.value = text;
}

// Mise à jour auto
productCards.forEach(card => {
  card.querySelector('.size').addEventListener('change', buildOrder);
  card.querySelector('.qty').addEventListener('change', buildOrder);
});

buildOrder();

// ✅ Validation formulaire
function prepareAndSend(e) {
  const hasItem = productCards.some(
    c => parseInt(c.querySelector('.qty').value) > 0
  );

  if (!hasItem) {
    e.preventDefault();
    alert("🛒 Ajoute au moins un produit avant de commander !");
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    return false;
  }

  return true;
}
