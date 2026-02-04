function sendWhatsApp() {
  const company = document.getElementById("company").value;
  const cargo = document.getElementById("cargo").value;
  const pickup = document.getElementById("pickup").value;
  const delivery = document.getElementById("delivery").value;
  const weight = document.getElementById("weight").value;
  const phone = document.getElementById("phone").value;

  const message =
  `Transport Quote Request - Business Use%0A%0A` +
  `Company: ${company}%0A` +
  `Cargo Type: ${cargo}%0A` +
  `Pickup Location: ${pickup}%0A` +
  `Delivery Location: ${delivery}%0A` +
  `Load / Container: ${weight}%0A` +
  `Contact Number: ${phone}`;


  const whatsappURL = `https://wa.me/8801733818617?text=${message}`;

  window.open(whatsappURL, "_blank");
}

function setLang(lang) {
  const elements = document.querySelectorAll("[data-en]");

  elements.forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });
}

