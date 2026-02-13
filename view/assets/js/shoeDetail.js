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

    const img = document.getElementById("shoeImg");
    img.src = "../assets/img/" + shoe.IMAGE_FILE;

    // Show available sizes from the stored shoe data
    const select = document.getElementById("shoeSizeSelect");
    select.innerHTML = "";

    // Fetch all sizes for this model
    fetchSizesForModel(shoe.MODEL);
    
    // Add event listener to size select to update stock when size changes
    select.addEventListener("change", () => {
      updateStockForSelectedSize(shoe.MODEL);
    });
    
  } catch (e) {
    document.getElementById("shoeName").textContent = "Error loading shoe data";
  }
});

async function updateStockForSelectedSize(modelName) {
  const selectedSize = document.getElementById("shoeSizeSelect").value;
  
  if (!selectedSize) return;
  
  console.log(`Updating stock for model: ${modelName}, size: ${selectedSize}`);
  
  try {
    const response = await fetch(`../../api/GetShoeByModelAndSize.php?model=${encodeURIComponent(modelName)}&size=${selectedSize}`);
    const data = await response.json();
    
    console.log("Stock response:", data);
    
    if (data.status === "success" && data.data) {
      const stock = Number(data.data.STOCK ?? 0);
      document.getElementById("shoeStock").textContent = 
        stock > 0 ? `Only ${stock} units left!` : "Out of stock";
    } else {
      document.getElementById("shoeStock").textContent = "Out of stock";
    }
  } catch (e) {
    console.error("Error updating stock:", e);
    document.getElementById("shoeStock").textContent = "Error loading stock";
  }
}

async function fetchSizesForModel(modelName) {
  try {
    const cleanModel = modelName.trim();
    
    const response = await fetch(`../../api/GetSizesByModel.php?model=${encodeURIComponent(cleanModel)}`);
    const data = await response.json();
    const sizes = data.data; // [38, 39, 40, 41, 42]
    
    const select = document.getElementById("shoeSizeSelect");
    select.innerHTML = "";
    
    if (data.status === "success" && sizes) {
      // Cargar las tallas en el select
      sizes.forEach(size => {
        const opt = document.createElement("option");
        opt.value = size;
        opt.textContent = `Size ${size}`;
        select.appendChild(opt);
      });
      // Update stock after sizes are loaded
      setTimeout(() => {
        updateStockForSelectedSize(modelName);
      }, 100);
    } else {
      // Fallback: show current shoe size
      const shoeData = sessionStorage.getItem('shoe');
      if (shoeData) {
        const shoe = JSON.parse(shoeData);
        const opt = document.createElement("option");
        opt.value = shoe.SIZE;
        opt.textContent = `Size ${shoe.SIZE}`;
        select.appendChild(opt);
        setTimeout(() => {
          updateStockForSelectedSize(modelName);
        }, 100);
      }
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

        if (result.status === "success") {
          alert("Order placed successfully! Order ID: " + result.data.order_id);
          // Optional: redirect to cart page
          // window.location.href = 'cart.html';
        } else {
          alert("Error: " + result.message);
        }
      } catch (e) {
        alert("Error placing order: " + e.message);
      }
    });
  }
});
