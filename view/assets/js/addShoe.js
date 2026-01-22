document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addShoeForm");
  const msg = document.getElementById("formMsg");

  const brand = document.getElementById("brand");
  const model = document.getElementById("model");
  const size = document.getElementById("size");
  const color = document.getElementById("color");
  const origin = document.getElementById("origin");
  const manufactureDate = document.getElementById("manufacture_date");
  const stock = document.getElementById("stock");
  const price = document.getElementById("price");
  const exclusive = document.getElementById("exclusive");

  function setMsg(text, ok = false) {
    msg.textContent = text;
    msg.style.color = ok ? "green" : "#b00020";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("");

    const payload = {
      brand: brand.value,
      model: model.value,
      size: size.value,
      color: color.value,
      origin: origin.value,
      manufacture_date: manufactureDate.value || null,
      stock: stock.value === "" ? null : stock.value,
      price: price.value,
      exclusive: exclusive.checked ? "TRUE" : "FALSE",
      reserved: "FALSE"
    };

    try {
      const res = await fetch("../../api/addShoe.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setMsg("Shoe añadido correctamente", true);
        form.reset();
      } else {
        setMsg(data.error || "Error al añadir");
      }
    } catch (err) {
      setMsg("Error de red o servidor");
    }
  });
});
