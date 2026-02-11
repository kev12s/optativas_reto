document.addEventListener("DOMContentLoaded", () => {
  // Get shoe data from sessionStorage (set by main.js)
  const shoeData = sessionStorage.getItem('shoe');
  console.log("los datos " + shoeData);
  if (!shoeData) {
    document.getElementById("shoeName").textContent = "Shoe not found";
    document.getElementById("shoeDesc").textContent = "No shoe data in sessionStorage";
    return;
  }

  try {
    const shoe = JSON.parse(shoeData);
    
    // Show basic shoe info
    document.getElementById("shoeName").textContent = shoe.MODEL;
    document.getElementById("shoeDesc").textContent = shoe.BRAND;
    document.getElementById("shoePrice").textContent = `${shoe.PRICE} €`;



    //const stock = Number(Shoe.stock ?? 0);
   // document.getElementById("shoeStock").textContent =
     // stock > 0 ? `Only ${stock} units left!` : "Out of stock";

    const img = document.getElementById("shoeImg");
    img.src = "../assets/img/" + shoe.IMAGE_FILE;

    // Show available sizes from the stored shoe data
    const select = document.getElementById("shoeSizeSelect");
    select.innerHTML = "";

    // Fetch all sizes for this model
    fetchSizesForModel(shoe.MODEL);
    
  } catch (e) {
    document.getElementById("shoeName").textContent = "Error loading shoe data";
  }
});

async function fetchSizesForModel(modelName) {
  try {
    const cleanModel = modelName.trim();
    const encodedModel = encodeURIComponent(cleanModel)
      .replace(/\s+/g, '_')
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
    
    const response = await fetch(`../../api/getShoesByModel.php?model=${encodedModel}`);
    const json = await response.json();
    
    const select = document.getElementById("shoeSizeSelect");
    select.innerHTML = "";
    
    if (json.success && json.data) {
      // Get all unique sizes
      const allSizes = json.data.map(shoe => shoe.sizes[0]).filter((size, index, self) => 
        self.indexOf(size) === index
      );
      
      allSizes.forEach((size) => {
        const opt = document.createElement("option");
        opt.value = size;
        opt.textContent = `Size ${size}`;
        select.appendChild(opt);
      });
    } else {
      // Fallback: show current shoe size
      const opt = document.createElement("option");
      opt.value = shoe.SIZE;
      opt.textContent = `Size ${shoe.SIZE}`;
      select.appendChild(opt);
    }
  } catch (e) {
    console.error("Error fetching sizes:", e);
  }
}

// Add to cart functionality
document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("addToCartBtn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", async () => {
      const shoeData = sessionStorage.getItem('shoe');
      if (!shoeData) {
        alert("No shoe data available");
        return;
      }

      const shoe = JSON.parse(shoeData);
      const selectedSize = document.getElementById("shoeSizeSelect").value;
      
      // Get user profile code (you might need to get this from login/session)
      const profileCode = localStorage.getItem('profileCode') || sessionStorage.getItem('profileCode') || 1; // Default to 1 for testing
      
      if (!selectedSize) {
        alert("Please select a size");
        return;
      }

      try {
        const response = await fetch("../../api/insertOrder.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            profile_code: profileCode,
            shoe_id: shoe.ID,
            quantity: 1
          })
        });

        const result = await response.json();

        if (result.success) {
          alert("Order placed successfully! Order ID: " + result.order_id);
          // Optional: redirect to cart page
          // window.location.href = 'cart.html';
        } else {
          alert("Error: " + result.error);
        }
      } catch (e) {
        alert("Error placing order: " + e.message);
      }
    });
  }
});
