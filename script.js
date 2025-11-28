/* 
  Projeto: Beauty Makeup
  Autora: Anna Karolyna – 2B
  Script: renderiza produtos, manipula carrinho (localStorage), acessibilidade e toasts.
*/

const PRODUCTS = [
  {
    id: "base-01",
    title: "Base Matte HD",
    desc: "Alta cobertura e acabamento aveludado.",
    price: 59.90,
    img: "https://i.imgur.com/Rw8wT8a.jpg"
  },
  {
    id: "batom-01",
    title: "Batom Vermelho Clássico",
    desc: "Cor intensa, longa duração.",
    price: 29.90,
    img: "https://i.imgur.com/ytY0kYb.jpg"
  },
  {
    id: "paleta-01",
    title: "Paleta Glam Shine",
    desc: "12 cores vibrantes para looks diurnos e noturnos.",
    price: 79.90,
    img: "https://i.imgur.com/X6HsIYd.jpg"
  }
];

// Selectors
const produtosEl = document.getElementById("produtos");
const cartCountEl = document.getElementById("cart-count");
const dialogCart = document.getElementById("dialog-cart");
const openCartBtn = document.getElementById("open-cart");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout");
const toastEl = document.getElementById("toast");

// Cart stored as map {id: quantity}
let cart = loadCart();

// --- Render produtos ---
function renderProducts() {
  produtosEl.innerHTML = "";
  PRODUCTS.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div class="price">R$ ${p.price.toFixed(2)}</div>
        <div class="actions">
          <button class="btn secondary" data-id="${p.id}">Ver</button>
          <button class="btn primary" data-id="${p.id}">Comprar</button>
        </div>
      </div>
    `;
    produtosEl.appendChild(card);
  });

  // Delegation: capturar cliques nos botões
  produtosEl.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      if (e.currentTarget.classList.contains("primary")) {
        addToCart(id);
      } else {
        showToast("Em breve: página do produto", 1800);
      }
    });
  });
}

// --- Cart management ---
function loadCart() {
  try {
    const raw = localStorage.getItem("bm_cart_v1");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveCart() {
  localStorage.setItem("bm_cart_v1", JSON.stringify(cart));
  updateCartUI();
}
function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart();
  showToast("Produto adicionado ao carrinho ✔");
}
function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
}
function clearCart() {
  cart = {};
  saveCart();
}
function getCartItems() {
  return Object.entries(cart).map(([id, qty]) => {
    const prod = PRODUCTS.find(p => p.id === id);
    return { ...prod, qty };
  });
}
function getCartTotal() {
  return getCartItems().reduce((sum, it) => sum + it.price * it.qty, 0);
}

// --- UI updates ---
function updateCartUI() {
  const items = getCartItems();
  cartCountEl.textContent = items.reduce((s, it) => s + it.qty, 0);
  cartTotalEl.textContent = getCartTotal().toFixed(2);

  cartItemsEl.innerHTML = items.length ? items.map(it => `
    <div class="cart-item" data-id="${it.id}">
      <img src="${it.img}" alt="${it.title}">
      <div class="meta">
        <b>${it.title}</b>
        <small>R$ ${it.price.toFixed(2)} • Qty: ${it.qty}</small>
      </div>
      <div class="actions">
        <button class="btn secondary" data-action="remove" aria-label="Remover ${it.title}">Remover</button>
      </div>
    </div>
  `).join("") : "<p>Seu carrinho está vazio.</p>";

  // attach remove handlers
  cartItemsEl.querySelectorAll("[data-action='remove']").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.closest(".cart-item").getAttribute("data-id");
      removeFromCart(id);
      showToast("Produto removido do carrinho");
    });
  });
}

// --- Dialog control ---
function openCart() {
  dialogCart.hidden = false;
  openCartBtn.setAttribute("aria-expanded", "true");
  // focus management
  const firstBtn = dialogCart.querySelector(".dialog-header button");
  firstBtn?.focus();
}
function closeCart() {
  dialogCart.hidden = true;
  openCartBtn.setAttribute("aria-expanded", "false");
  openCartBtn.focus();
}

// --- Toast ---
let toastTimer = null;
function showToast(message, time = 2000) {
  if (toastTimer) clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.hidden = false;
  toastTimer = setTimeout(() => {
    toastEl.hidden = true;
  }, time);
}

// --- Checkout (simples) ---
function checkout() {
  if (Object.keys(cart).length === 0) {
    showToast("Carrinho vazio — adicione itens antes de finalizar.");
    return;
  }
  // Simular finalização
  showToast(`Compra finalizada — Total R$ ${getCartTotal().toFixed(2)}. Obrigada!`);
  clearCart();
  closeCart();
}

// --- Event bindings ---
openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
clearCartBtn.addEventListener("click", () => {
  clearCart();
  showToast("Carrinho limpo");
});
checkoutBtn.addEventListener("click", checkout);

// fechar dialog com ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !dialogCart.hidden) closeCart();
});

// fechar clicando fora do painel
dialogCart.addEventListener("click", (e) => {
  if (e.target === dialogCart) closeCart();
});

// Inicialização
renderProducts();
updateCartUI();
