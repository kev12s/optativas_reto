document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const shoeId = params.get("shoe_id");

  if (!shoeId) {
    document.getElementById("shoeName").textContent = "Shoe not found";
    document.getElementById("shoeDesc").textContent = "No shoe_id in URL";
    return;
  }

  try {
    const response = await fetch(`../../api/GetShoe.php?shoe_id=${shoeId}`);
    const json = await response.json();

    if (json.status === "success" && json.data) {
      paintShoe(json.data);
    } else {
      document.getElementById("shoeName").textContent = "Shoe not found";
    }
  } catch (e) {
    document.getElementById("shoeName").textContent = "Server error";
  }
});

function paintShoe(shoe) {
  document.getElementById("shoeName").textContent = shoe.model;
  document.getElementById("shoeDesc").textContent = shoe.description;
  document.getElementById("shoePrice").textContent = `${shoe.price} €`;

  const stock = Number(shoe.stock ?? 0);
  document.getElementById("shoeStock").textContent =
    stock > 0 ? `Only ${stock} units left!` : "Out of stock";

  const img = document.getElementById("shoeImg");
  img.src = "../assets/img/" + shoe.image_file;

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
