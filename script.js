const products = [
  { name: "Camiseta boxy cruda", category: "camisetas", price: "39 EUR", badge: "Nuevo", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=760&q=82", alt: "Camiseta blanca de algodon" },
  { name: "Sudadera graphite", category: "sudaderas", price: "72 EUR", badge: "Popular", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=760&q=82", alt: "Sudadera gris premium" },
  { name: "Pantalon wide black", category: "pantalones", price: "89 EUR", badge: "Edicion limitada", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=760&q=82", alt: "Pantalon negro de corte amplio" },
  { name: "Bolso nylon mini", category: "accesorios", price: "49 EUR", badge: "Nuevo", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=760&q=82", alt: "Bolso negro pequeno" },
  { name: "Camiseta washed mocha", category: "camisetas", price: "42 EUR", badge: "Popular", image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=760&q=82", alt: "Camiseta marron lavada" },
  { name: "Hoodie cream zip", category: "sudaderas", price: "79 EUR", badge: "Nuevo", image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=760&q=82", alt: "Sudadera clara con cremallera" },
  { name: "Denim recto vintage", category: "pantalones", price: "84 EUR", badge: "Popular", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=760&q=82", alt: "Pantalon vaquero recto" },
  { name: "Gorra studio cap", category: "accesorios", price: "32 EUR", badge: "Edicion limitada", image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=760&q=82", alt: "Gorra de moda urbana" }
];

const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress");
const toTop = document.querySelector("[data-top]");
const productGrid = document.querySelector("[data-products]");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const imageFallback = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 1200'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23eee3d7'/%3E%3Cstop offset='1' stop-color='%23cdb7a1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='900' height='1200' fill='url(%23g)'/%3E%3Ctext x='450' y='610' text-anchor='middle' fill='%236b5f55' font-family='Arial' font-size='42'%3ERove Studio%3C/text%3E%3C/svg%3E";
let ticking = false;

function updateScrollEffects() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${value}%`;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
  toTop.classList.toggle("is-visible", window.scrollY > 560);

  if (!prefersReducedMotion && window.innerWidth > 768) {
    parallaxItems.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const offset = (rect.top - window.innerHeight / 2) * -0.025;
      element.style.transform = `translate3d(0, ${offset}px, 0) scale(1.03)`;
    });
  }

  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}

function renderProducts(category = "todo") {
  const visible = category === "todo" ? products : products.filter((product) => product.category === category);
  productGrid.innerHTML = visible.map((product, index) => `
    <article class="product-card" style="animation-delay:${index * 55}ms">
      <div class="product-media">
        <span class="product-badge">${product.badge}</span>
        <img src="${product.image}" alt="${product.alt}" loading="lazy">
        <div class="product-overlay"><a href="#contacto">Consultar</a></div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.category}</p>
        <span class="product-price">${product.price}</span>
      </div>
    </article>
  `).join("");
  attachImageFallbacks(productGrid);
}

function setupReveal() {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

  revealItems.forEach((item) => observer.observe(item));
}

function attachImageFallbacks(scope = document) {
  scope.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.src = imageFallback;
      image.alt = image.alt || "Imagen editorial de Rove Studio";
    }, { once: true });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    renderProducts(button.dataset.filter);
  });
});

const contactForm = document.querySelector(".contact-form");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  const original = button.textContent;
  button.textContent = "Consulta preparada";
  button.classList.add("is-sent");
  setTimeout(() => {
    button.textContent = original;
    button.classList.remove("is-sent");
    event.currentTarget.reset();
  }, 1600);
});

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

attachImageFallbacks();
renderProducts();
setupReveal();
updateScrollEffects();
