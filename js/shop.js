// Example JS if you want custom tab control later

document.addEventListener("DOMContentLoaded", function(){

console.log("Product Tabs Loaded");

});

const img = document.getElementById("mainImage");
const result = document.getElementById("zoomResult");

result.style.backgroundImage = `url(${img.src})`;
result.style.backgroundSize = "200%";

img.addEventListener("mousemove", function(e){

result.style.display = "block";

let rect = img.getBoundingClientRect();

let x = ((e.clientX - rect.left) / rect.width) * 100;
let y = ((e.clientY - rect.top) / rect.height) * 100;

result.style.backgroundPosition = x + "% " + y + "%";

});

img.addEventListener("mouseleave", function(){
result.style.display = "none";
});
