

function showPrevImage(){
  const thumbs = document.querySelectorAll(".product-thumbs img");
  let currentIndex = Array.from(thumbs).findIndex(t => t.src === img.src);
  let prevIndex = currentIndex > 0 ? currentIndex - 1 : thumbs.length - 1;
  changeImage(thumbs[prevIndex]);
}

function showNextImage(){
  const thumbs = document.querySelectorAll(".product-thumbs img");
  let currentIndex = Array.from(thumbs).findIndex(t => t.src === img.src);
  let nextIndex = currentIndex < thumbs.length - 1 ? currentIndex + 1 : 0;
  changeImage(thumbs[nextIndex]);
}
const qtyInput = document.querySelector(".qty-input");
const btnPlus = document.querySelector(".qty-btn.plus");
const btnMinus = document.querySelector(".qty-btn.minus");

btnPlus.addEventListener("click", () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
});

btnMinus.addEventListener("click", () => {
    if(parseInt(qtyInput.value) > 1){
        qtyInput.value = parseInt(qtyInput.value) - 1;
    }
});


function open_cart_popup() {
	renderCart();
	document.getElementById("cartModal").style.display = "flex";
}

function closeCart() {
	document.getElementById("cartModal").style.display = "none";
}


/* =======================
   IMAGE ZOOM FUNCTIONALITY
   ======================= */
const img = document.getElementById("mainImage"); // Main product image
const zoom = document.getElementById("zoomView"); // Zoom view div

// Initialize zoom background
function setZoom() {
    zoom.style.backgroundImage = `url(${img.src})`;
    zoom.style.backgroundSize = "200%"; // Zoom level (200%)
}

// Call once on load
setZoom();

// Mousemove: show zoom and update background position
img.addEventListener("mousemove", function (e) {
    zoom.style.display = "block"; // Show zoom
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    zoom.style.backgroundPosition = `${x}% ${y}%`;
});

// Mouse leave: hide zoom
img.addEventListener("mouseleave", function () {
    zoom.style.display = "none";
});

// Change main image when clicking thumbnail
function changeImage(el) {
    img.src = el.src;
    setZoom(); // Update zoom background
}

/* =======================
   QUANTITY FUNCTIONALITY
   ======================= */
let quantity = 1;

function changeQty(val) {
    quantity += val;
    if (quantity < 1) quantity = 1; // Prevent quantity < 1
    document.getElementById("qty").innerText = quantity;
}