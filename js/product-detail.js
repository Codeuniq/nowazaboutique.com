const API_BASE_URL = CONFIG.API_BASE_URL;
const code = new URLSearchParams(window.location.search).get('code');

// These are initialized AFTER the template is injected
let img = null;
let zoom = null;
let quantity = 1;

function load_item_details() {
	updateCartCount();

	$.ajax({
		url: `${API_BASE_URL}/api/method/frappe_ecommerce.apis.api.get_product_details?product_id=${code}`,
		type: "GET",
		dataType: "json",
		success: function (res) {
			const product_data = res.data || {};
			const similar_items = product_data.similar_items || [];
			const container = document.getElementById('product-page');
			if (!container) return;

			container.insertAdjacentHTML("beforeend", productDetailsTemplate(product_data));

			// Select elements AFTER HTML is injected
			img = document.getElementById('mainImage');
			zoom = document.getElementById('zoomView');

			// Init zoom and quantity buttons AFTER elements exist
			initZoom();
			initQtyButtons();
		},
		error: err => console.error("API Error", err)
	});
}

/* =======================
   QUANTITY FUNCTIONALITY
   ======================= */

function initQtyButtons() {
	const qtyInput = document.querySelector(".qty-input");
	const btnPlus = document.querySelector(".qty-btn.plus");
	const btnMinus = document.querySelector(".qty-btn.minus");

	if (!qtyInput || !btnPlus || !btnMinus) return;

	btnPlus.addEventListener("click", () => {
		qtyInput.value = parseInt(qtyInput.value) + 1;
	});

	btnMinus.addEventListener("click", () => {
		if (parseInt(qtyInput.value) > 1) {
			qtyInput.value = parseInt(qtyInput.value) - 1;
		}
	});
}

/* =======================
   IMAGE ZOOM FUNCTIONALITY
   ======================= */

function initZoom() {
	if (!img || !zoom) return;

	setZoom();

	img.addEventListener("mousemove", function (e) {
		zoom.style.display = "block";
		const rect = img.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		zoom.style.backgroundPosition = x + "% " + y + "%";
	});

	img.addEventListener("mouseleave", function () {
		zoom.style.display = "none";
	});
}

function setZoom() {
	if (!img || !zoom) return;
	zoom.style.backgroundImage = `url(${img.src})`;
}

// Change main image when clicking thumbnail
function changeImage(el) {
	if (!img) return;
	img.src = el.src;
	setZoom();
}

function showPrevImage() {
	const thumbs = document.querySelectorAll(".product-thumbs img");
	let currentIndex = Array.from(thumbs).findIndex(t => t.src === img.src);
	let prevIndex = currentIndex > 0 ? currentIndex - 1 : thumbs.length - 1;
	changeImage(thumbs[prevIndex]);
}

function showNextImage() {
	const thumbs = document.querySelectorAll(".product-thumbs img");
	let currentIndex = Array.from(thumbs).findIndex(t => t.src === img.src);
	let nextIndex = currentIndex < thumbs.length - 1 ? currentIndex + 1 : 0;
	changeImage(thumbs[nextIndex]);
}

/* =======================
   SIZE SELECTION
   ======================= */

let selectedSize = "N/A";

function selectSize(el, size) {
	document.querySelectorAll(".size-circle").forEach(s => s.classList.remove("active"));
	el.classList.add("active");
	selectedSize = size;
	document.getElementById("selectedSize").value = size;

	// Enable the button once a size is picked
	document.getElementById("addToCartBtn").disabled = false;
}

/* =======================
   CART FUNCTIONALITY
   ======================= */

function getCart() {
	return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
	localStorage.setItem("cart", JSON.stringify(cart));
}

function add_to_cart(el) {
	console.log("Adding to cart...");
	const product = el.closest(".product-info");
	if (!product) return;

	const item_code = product.querySelector("[data-item-code]")?.innerText || "Item Code";
	const item_name = product.querySelector(".product-title")?.innerText || "Item Name";
	const qty = document.querySelector(".qty-input")?.value || "1";
	const item_price = product.querySelector(".price")?.innerText?.trim() || "0.00";
	const item_size = document.getElementById("selectedSize")?.value || "N/A";
	const firstThumb = document.querySelector(".product-thumbs img");
	const item_image = firstThumb ? firstThumb.src : "";

	let cart = getCart();

	const item_data = {
		id: item_code,
		name: item_name,
		price: Number(item_price.replace(/[^\d.]/g, "")),
		image: item_image,
		qty: Number(qty),
		size: item_size
	};

	const existing = cart.find(item => item.id === item_data.id && item.size === item_data.size);

	if (existing) {
		existing.qty += Number(qty);
	} else {
		cart.push(item_data);
	}

	saveCart(cart);
	updateCartCount();
}

function open_cart_popup() {
	renderCart();
	document.getElementById("cartModal").style.display = "flex";
}

function closeCart() {
	document.getElementById("cartModal").style.display = "none";
}

function renderCart() {
	const cart = getCart();
	const container = document.querySelector(".cart-items");
	const totalEl = document.querySelector(".cart-footer .total strong");
	const checkoutBtn = document.getElementById("checkout");


	container.innerHTML = "";
	let total = 0;
	let whatsappText = "I'd like to place an order:%0A";

	if (!cart.length) {
		container.innerHTML = "<p style='text-align:center'>Cart is empty</p>";
		totalEl.innerHTML = "0.00";
		checkoutBtn.style.pointerEvents = "none";  // ← disable
		checkoutBtn.style.opacity = "0.4";          // ← dim it
		return;
	}
	// Re-enable when cart has items
	checkoutBtn.style.pointerEvents = "auto";
	checkoutBtn.style.opacity = "1";

	let html = "";
	cart.forEach((item, index) => {
		let item_total = item.price * item.qty;
		total += item_total;

		whatsappText += `*${item.id}* - *${item.name}* ( *${item.size}* ) x ${item.qty} - ${item_total.toFixed(2)} AED %0A`;

		html += `
			<div class="cart-item">
				<div class="cart-gallery">
					<img src="${item.image}" class="main-img">
				</div>
				<div class="item-info">
					<h4>${item.name}</h4>
					<h5 style="color: #000;">Size : ${item.size}</h5>
					<div class="price-qty">
						<p class="price">
							<img src="images/aed.webp" style="height:15px;margin-top:-4px;padding-right:2px;">
							<span>${item.price.toFixed(2)}</span>
						</p>
						<div class="qty modern-qty">
							<button onclick="updateQty('${item.id}', '${item.size}', -1)">-</button>
							<span class="qty-num">${item.qty}</span>
							<button onclick="updateQty('${item.id}', '${item.size}', 1)">+</button>
						</div>
					</div>
				</div>
				<span class="remove" onclick="removeItem(${index})">&times;</span>
			</div>
		`;
	});
	container.innerHTML = html;

	whatsappText += `%0ATotal: ${total.toFixed(2)} AED`;

	totalEl.innerHTML = `
		<img src="images/aed.webp" style="height:12px;margin-top:-4px;padding-right:2px;">
		${total.toFixed(2)}
	`;

	document.getElementById("checkout").href = `https://wa.me/+971566136798?text=${whatsappText}`;
}

function updateQty(id, size, change) {
	let cart = getCart();
	const item = cart.find(i => i.id === id && i.size === size);
	if (!item) return;
	item.qty += change;
	if (item.qty <= 0) cart = cart.filter(i => !(i.id === id && i.size === size));
	saveCart(cart);
	updateCartCount();
	renderCart();
}

function removeItem(index) {
	let cart = getCart();
	cart.splice(index, 1);
	saveCart(cart);
	updateCartCount();
	renderCart();
}

function updateCartCount() {
	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	const cartCountEl = document.getElementById("cartCount");

	const totalQty = cart.length;

	if (totalQty > 0) {
		cartCountEl.textContent = totalQty;
		cartCountEl.style.display = "flex";
	} else {
		cartCountEl.style.display = "none";
	}
}

/* =======================
   PRODUCT TEMPLATE
   ======================= */

function productDetailsTemplate(product) {
	const price = product.item_price || "0.00";
	const item_code = product.name || "";
	const item_name = product.item_name || "";
	const description = product.item_description || "No description available.";

	// Fix: wrap size value in quotes so it works for any string value
	const sizeOptions = product.sizes?.length
		? product.sizes.map(size => `
		<div class="size-circle ${size.qty === 0 ? 'disabled' : ''}"
			 onclick="selectSize(this, '${size.size}')">
		  ${size.size}
		</div>
	  `).join("")
		: '<span>No sizes available</span>';
	const images = product.images?.length
		? product.images
		: ["images/item_place_holder.png"];

	const thumbnails = images.map(imgSrc => `
		<img src="${imgSrc}" onclick="changeImage(this)">
	`).join("");

	const firstImage = images[0];

	return `
		<!-- PRODUCT IMAGES -->
		<div class="col-lg-6">
			<div class="product-gallery">
				<div class="product-thumbs">
					${thumbnails}
				</div>
				<div class="product-main-image">
					<img id="mainImage" src="${firstImage}">
				</div>
				<div class="zoom-view" id="zoomView"></div>
			</div>
		</div>

		<!-- PRODUCT INFO -->
		<div class="col-lg-6 product-info">
			<h2 data-item-code style="display:none;">${item_code}</h2>
			<h2 class="product-title">${item_name}</h2>

			<div class="details-title">DETAILS</div>
			<p class="desc">${description}</p>

			<p class="choose">Choose Size</p>
			<div class="sizes">${sizeOptions}</div>

			<input type="hidden" id="selectedSize" name="size" value="">

			<div class="buy-row">
				<div class="qty">
					<button onclick="changeQty(-1)">-</button>
					<span id="qty">1</span>
					<button onclick="changeQty(1)">+</button>
				</div>
			</div>
			<div class="buy-row">
				<button class="add-cart-btn" onclick="add_to_cart(this);" id="addToCartBtn" disabled>Add to Cart</button>
			</div>
			<div class="price">${price} <img src="images/aed.webp" style="height:17px; margin-left:5px; padding-right:2px;"/></div>
			<p class="tax">Taxes are included.</p>
		</div>
	`;
}

function changeQty(val) {
	quantity += val;
	if (quantity < 1) quantity = 1;
	document.getElementById("qty").innerText = quantity;
}

/* PRODUCT CARD TEMPLATE */
function productCardTemplate(product, index) {
	const price = product.item_price || "0.00";
	const item_code = product.name || "";
	const item_name = product.item_name || "";

	const images = product.images?.length
		? product.images
		: ["images/item_place_holder.png"];

	const imageSlides = images.map(img => `
	<img src="${img}" class="PRimg">
  `).join("");

	return `
	<div class="col-6 col-md-4 col-lg-2 mb-4 d-flex">
		<div class="product w-100">
			<div class="carousels" data-index="${index}">
				<div class="carousel_slider">
					<div class="content_inner_slider">
						${imageSlides}
					</div>
					
					<button class="prev_button PRBTN" onclick="slidePrev(${index})">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
								fill="currentColor" class="bi bi-caret-left-fill"
								viewBox="0 0 16 16">
								<path
								d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
							</svg>
					</button>
					<button class="next_button PRBTN" onclick="slideNext(${index})">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
									fill="currentColor" class="bi bi-caret-right-fill"
									viewBox="0 0 16 16">
									<path
									d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
							</svg>
							</button>
				</div>
			</div>
			<div class="p-2" style="display:flex; justify-content:space-between; align-items:center;">
				<div class="pricing">
					<p class="price">
						<span>
							<img src="images/aed.webp" style="height:12px; margin-top:-2px; padding-right:2px;" />
							${price}
						</span>
					</p>
				</div>
			</div>
			<div class="text p-2 pt-0" onclick="window.location.href='item-details.html?code=${item_code}'" style="cursor:pointer;">
				<h2 style="display:none;">${item_code}</h2>
				<h3>${item_name}</h3>
				<div class="d-flex margb">
					<div class="cat">
						<span>Palmera</span>
					</div>
					<div class="rating">
						<p class="text-right mb-0">
							<span class="fa fa-star starrat"></span>
							<span class="fa fa-star starrat"></span>
							<span class="fa fa-star starrat"></span>
							<span class="fa fa-star starrat"></span>
							<span class="fa fa-star starrat"></span>
						</p>
					</div>
				</div>
			</div >
		</div >
		`;
}