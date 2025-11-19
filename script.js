// Récupère les cartes produits et met à jour le récapitulatif en direct
const productCards = Array.from(document.querySelectorAll('.product-card'));
const orderSummaryEl = document.getElementById('order-summary');
const hiddenCommande = document.getElementById('hidden-commande');

function buildOrder() {
  const lines = [];
  let total = 0;
  productCards.forEach(card => {
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const size = card.querySelector('.size').value;
    const qty = parseInt(card.querySelector('.qty').value, 10);
    if (qty > 0) {
      lines.push(`${name} — Taille: ${size} — Qté: ${qty} — Prix unitaire: ${price.toFixed(2)} € — Sous-total: ${(price * qty).toFixed(2)} €`);
      total += price * qty;
    }
  });
  if (lines.length === 0) {
    orderSummaryEl.innerHTML = "<em>Aucun article sélectionné.</em>";
  } else {
    orderSummaryEl.innerHTML = `<strong>Récapitulatif :</strong><br>${lines.join('<br>')}<br><strong>Total: ${total.toFixed(2)} €</strong>`;
  }
  // Met à jour le champ caché qui sera envoyé par le formulaire
  hiddenCommande.value = lines.length ? lines.join(' | ') + ` | Total: ${total.toFixed(2)} €` : 'Aucun article';
}

// Attache les écouteurs pour recalculer quand l'utilisateur change taille/quantité
productCards.forEach(card => {
  card.querySelector('.size').addEventListener('change', buildOrder);
  card.querySelector('.qty').addEventListener('change', buildOrder);
});

// Initialise l'aperçu
buildOrder();

/**
 * Prépare et envoie le formulaire.
 * On vérifie qu'au moins 1 article est sélectionné.
 */
function prepareAndSend(ev) {
  // vérification minimale
  const hasItem = productCards.some(card => parseInt(card.querySelector('.qty').value, 10) > 0);
  if (!hasItem) {
    alert("Veuillez sélectionner au moins 1 article (quantité > 0) avant d'envoyer la commande.");
    ev.preventDefault();
    return false;
  }

  // Optionnel: affichage de confirmation avant envoi
  const confirmation = confirm("Vous êtes sûr(e) de vouloir envoyer cette commande ? Un e-mail sera envoyé à l'organisateur.");
  if (!confirmation) {
    ev.preventDefault();
    return false;
  }

  // Le formulaire soumettra automatiquement à Formsubmit (action dans index.html)
  return true;
}
