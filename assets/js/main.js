function sendWhatsApp() {
  const company = document.getElementById("company").value;
  const cargo = document.getElementById("cargo").value;
  const pickup = document.getElementById("pickup").value;
  const delivery = document.getElementById("delivery").value;
  const weight = document.getElementById("weight").value;
  const phone = document.getElementById("phone").value;

  const message =
    `Business Transport Quote Request:%0A%0A` +
    `Company: ${company}%0A` +
    `Cargo: ${cargo}%0A` +
    `Pickup: ${pickup}%0A` +
    `Delivery: ${delivery}%0A` +
    `Load: ${weight}%0A` +
    `Contact: ${phone}`;

  const whatsappURL = `https://wa.me/8801733818617?text=${message}`;

  window.open(whatsappURL, "_blank");
}
