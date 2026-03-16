// Mobile Menu Toggle
// const menuBtn = document.getElementById("menuBtn");
// const navbar = document.getElementById("navbar");

// menuBtn.addEventListener("click", () => {
//     navbar.classList.toggle("active");
// });

// Slider
const slides = document.querySelector(".slides");
const slide = document.querySelectorAll(".slide");

let index = 0;

function autoSlide() {
    index++;
    if (index >= slide.length) {
        index = 0;
    }
    slides.style.transform = `translateX(${-index * 100}%)`;
}

setInterval(autoSlide, 4000);


var swiper = new Swiper(".trending-slider", {

    slidesPerView: 4,
    spaceBetween: 25,
    loop: true,

    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter:true 
    },

    breakpoints: {

        0: {
            slidesPerView: 1
        },

        600: {
            slidesPerView: 2
        },

        900: {
            slidesPerView: 3
        },

        1200: {
            slidesPerView: 4
        }

    }

});



const button = document.getElementById("wa_button");
const popup = document.getElementById("wa_popup");

button.addEventListener("click", function(){

if(popup.style.display === "block"){
popup.style.display = "none";
}
else{
popup.style.display = "block";
}

});