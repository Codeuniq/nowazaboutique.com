(function() {
	'use strict';

	var tinyslider = function() {
		var el = document.querySelectorAll('.testimonial-slider');

		if (el.length > 0) {
			var slider = tns({
				container: '.testimonial-slider',
				items: 1,
				axis: "horizontal",
				controlsContainer: "#testimonial-nav",
				swipeAngle: false,
				speed: 700,
				nav: true,
				controls: true,
				autoplay: true,
				autoplayHoverPause: true,
				autoplayTimeout: 3500,
				autoplayButtonOutput: false
			});
		}
	};
	tinyslider();

	


	var sitePlusMinus = function() {

		var value,
    		quantity = document.getElementsByClassName('quantity-container');

		function createBindings(quantityContainer) {
	      var quantityAmount = quantityContainer.getElementsByClassName('quantity-amount')[0];
	      var increase = quantityContainer.getElementsByClassName('increase')[0];
	      var decrease = quantityContainer.getElementsByClassName('decrease')[0];
	      increase.addEventListener('click', function (e) { increaseValue(e, quantityAmount); });
	      decrease.addEventListener('click', function (e) { decreaseValue(e, quantityAmount); });
	    }

	    function init() {
	        for (var i = 0; i < quantity.length; i++ ) {
						createBindings(quantity[i]);
	        }
	    };

	    function increaseValue(event, quantityAmount) {
	        value = parseInt(quantityAmount.value, 10);

	        console.log(quantityAmount, quantityAmount.value);

	        value = isNaN(value) ? 0 : value;
	        value++;
	        quantityAmount.value = value;
	    }

	    function decreaseValue(event, quantityAmount) {
	        value = parseInt(quantityAmount.value, 10);

	        value = isNaN(value) ? 0 : value;
	        if (value > 0) value--;

	        quantityAmount.value = value;
	    }
	    
	    init();
		
	};
	sitePlusMinus();


const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("active");
});




const toggle = document.getElementById("currencyToggle");
const aed = toggle.querySelector(".aed");
const inr = toggle.querySelector(".inr");
const indicator = toggle.querySelector(".toggle-indicator");

toggle.addEventListener("click", () => {
    const isAED = aed.classList.contains("active");

    if (isAED) {
        // Switch to INR
        aed.classList.remove("active");
        inr.classList.add("active");
        indicator.style.left = "50%";
        updatePrices("INR");
    } else {
        // Switch to AED
        inr.classList.remove("active");
        aed.classList.add("active");
        indicator.style.left = "0";
        updatePrices("AED");
    }
});

function updatePrices(currency) {
    console.log("Prices updated to", currency); // Replace with your dynamic update logic
}

//CART SECTION
function openCart() {
	document.getElementById("cartModals").style.display = "flex";
}

function closeCart() {
	document.getElementById("cartModals").style.display = "none";
}

function removeItem(el) {
	el.closest(".cart-item").remove();
	updateTotal();
}


})()


