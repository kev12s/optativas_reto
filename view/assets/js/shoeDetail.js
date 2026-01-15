console.log("✅ shoeDetail.js cargado");
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const shoeId = params.get("shoe_id"); // o "id_shoe" si así lo mandáis

  if (!shoeId) {
    showError("Shoe not found", "No shoe_id in URL. Example: ?shoe_id=3");
    return;
  }

  try {
    const data = await getShoeById(shoeId);

    if (data.status === "success" && data.data) {
      paintShoe(data.data);
    } else {
      showError("Shoe not found", data.message || "Unknown error");
    }
  } catch (error) {
    console.error(error);
    showError("Error", "Could not load shoe data");
  }
});

async function getShoeById(shoeId) {
  const response = await fetch(
    `../../api/GetShoe.php?shoe_id=${encodeURIComponent(shoeId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );

  const rawText = await response.text();

  let data;
  try {
    data = JSON.parse(rawText);
  } catch (jsonError) {
    throw new Error("Respuesta no es JSON válida: " + rawText);
  }

  return data;
}

function paintShoe(shoe) {
  document.getElementById("shoeName").textContent = shoe.model ?? "-";
  document.getElementById("shoeDesc").textContent = shoe.description ?? "-";
  document.getElementById("shoePrice").textContent = `${shoe.price ?? "-"} €`;

  const stock = Number(shoe.stock ?? 0);
  document.getElementById("shoeStock").textContent =
    stock > 0 ? `Only ${stock} units left!` : "Out of stock";

  const img = document.getElementById("shoeImg");

    // Si no existe el elemento img, no hace nada
    if (!img) {
    // Imagen desactivada, no molesta
    } else {
   // ocultamos la imagen de momento
    img.style.display = "none";
    }

  const select = document.getElementById("shoeSizeSelect");
  select.innerHTML = "";

  const sizes = shoe.sizes ?? [];
  sizes.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    select.appendChild(opt);
  });
}

function showError(title, msg) {
  document.getElementById("shoeName").textContent = title;
  document.getElementById("shoeDesc").textContent = msg;
}
