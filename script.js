const productCards = Array.from(document.querySelectorAll('.product-card'));
const orderSummaryEl = document.getElementById('order-summary');
const hiddenCommande = document.getElementById('hidden-commande');

function buildOrder() {
  let text = "";
  let total = 0;

  productCards.forEach(card => {
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const size = card.querySelector('.size').value;
    const qty = parseInt(card.querySelector('.qty').value);

    if(qty > 0){
      const subtotal = price * qty;
      total += subtotal;
      text += `${name} (Taille: ${size}) x${qty} — ${subtotal.toFixed(2)} €\n`;
    }
  });

  if(text === ""){
    orderSummaryEl.innerHTML = "<em>Aucun article sélectionné.</em>";
  } else {
    orderSummaryEl.innerHTML = `<pre>${text}\nTotal : ${total.toFixed(2)} €</pre>`;
  }

  hiddenCommande.value = text + `\nTotal : ${total.toFixed(2)} €`;
}

productCards.forEach(card=>{
  card.querySelector('.size').addEventListener('change', buildOrder);
  card.querySelector('.qty').addEventListener('change', buildOrder);
});

buildOrder();

function prepareAndSend(e){
  const hasItem = productCards.some(c => parseInt(c.querySelector('.qty').value) > 0);

  if(!hasItem){
    alert("Ajoute au moins un produit !");
    e.preventDefault();
    return false;
  }

  return true;
}
