const API_BASE_URL = CONFIG.API_BASE_URL

/* LOAD PRODUCTS */
function load_website_data() {
	// Iniatial page load
	$.ajax({
		url: `${API_BASE_URL}/api/method/frappe_ecommerce.apis.api.get_website_data`,
		type: "GET",
		dataType: "json",
		success: function (res) {
			const website_data = res.data || [];
			const featured_items = website_data.featured_items || [];
			const model_faces = website_data.model_faces || [];
			const new_items = website_data.new_items || [];

			const featured_container = document.getElementById('features_products');
			if (!featured_container) return;
			featured_items.forEach((product) => {
				featured_container.insertAdjacentHTML(
					"beforeend",
					featuredProductCard(product)
				);
			});

			const model_face_container = document.getElementById('model_faces');
			if (!model_face_container) return;
			model_faces.forEach((product) => {
				model_face_container.insertAdjacentHTML(
					"beforeend",
					modelFaceCard(product)
				);
			});

			const new_items_container = document.getElementById('new_items');
			if (!new_items_container) return;
			new_items.forEach((item_img) => {
				new_items_container.insertAdjacentHTML(
					"beforeend",
					`
					<div class="item">
                        <img src="${item_img}">
                    </div>
					`
				);
			});
		},
		error: err => console.error("API Error", err)
	});
}

function featuredProductCard(product) {
	const product_price = product.product_price || "0.00";
	const offer_price = product.offer_price || "0.00";
	const item_code = product.product || "";
	const item_name = product.product_name || "";
	const featured_image = product.featured_image || "images/item_place_holder.png";

	return `
		<div class="swiper-slide" onclick="window.location.href='product-details.html?code=${encodeURIComponent(item_code)}'" style="cursor: pointer;">
			<div class="product-card">
				<div class="product-img">
					<img src="${featured_image}" alt="${item_name}">
				</div>
				<div class="product-info">
					<h3>${item_name}</h3>
					<div class="price">
						<span class="old">${product_price} AED</span>
						<span class="new">${offer_price} AED</span>
					</div>
				</div>
			</div>
		</div>
	`
}

function modelFaceCard(product) {
	const product_image = product.product_image || "images/item_place_holder.png";
	const model_name = product.model_name || "Model";
	const description = product.description || "No Description";
	return `
		<div class="fusionCard">
			<img src="${product_image}" alt="${model_name}">
			<h4>${model_name}</h4>
			<p>${description}</p>
		</div>
	`
}