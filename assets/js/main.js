/*WHATSAPP QUOTE FUNCTION*/

function sendWhatsApp() {
  const companyEl = document.getElementById("company");
  const cargoEl = document.getElementById("cargo");
  const pickupEl = document.getElementById("pickup");
  const deliveryEl = document.getElementById("delivery");
  const weightEl = document.getElementById("weight");
  const phoneEl = document.getElementById("phone");

  // Safety check (prevents JS errors)
  if (!companyEl || !cargoEl || !pickupEl || !deliveryEl || !weightEl || !phoneEl) {
    alert("Form error. Please refresh the page.");
    return;
  }

  const company = companyEl.value.trim();
  const cargo = cargoEl.value.trim();
  const pickup = pickupEl.value.trim();
  const delivery = deliveryEl.value.trim();
  const weight = weightEl.value.trim();
  const phone = phoneEl.value.trim();

  if (!company || !cargo || !pickup || !delivery || !weight || !phone) {
    alert("Please fill in all fields.");
    return;
  }

  const message =
`Transport Quote Request - Business Use

Company: ${company}
Cargo Type: ${cargo}
Pickup Location: ${pickup}
Delivery Location: ${delivery}
Load / Container: ${weight}
Contact Number: ${phone}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/8801733818617?text=${encodedMessage}`;

  window.open(whatsappURL, "_blank");
}

/*LANGUAGE TOGGLE (PERSISTENT)*/

function setLang(lang) {
  if (!["en", "bn"].includes(lang)) return;

  localStorage.setItem("site_lang", lang);

  document.querySelectorAll("[data-en]").forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.textContent = text;
  });
}

/*APPLY SAVED LANGUAGE ON LOAD*/

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("site_lang") || "en";
  setLang(savedLang);
});
