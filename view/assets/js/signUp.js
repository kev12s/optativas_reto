document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("signupForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const pswd1 = document.getElementById("pswd1").value;
      const pswd2 = document.getElementById("pswd2").value;
      const parrafo = document.getElementById("mensaje");

      if (pswd1 !== pswd2) {
        parrafo.innerText = "Las contraseñas no coinciden.";
        parrafo.style.color = "red";
        return;
      }

      try {
        const response = await fetch("../../api/AddUser.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({ username, pswd1 }),
        });

        const rawText = await response.text();

        let data;
        try {
          data = JSON.parse(rawText);
        } catch (jsonError) {
          throw new Error("Respuesta no es JSON válida: " + rawText);
        }

        if (data.status === "success") {
          parrafo.innerText = data.message;
          parrafo.style.color = "green";

          // localStorage.setItem("actualProfile", JSON.stringify(data.data));

          // Ir a la página principal 
          window.location.href = "main.html";
          console.log("Datos recibidos:", data.data);
        } else {
          parrafo.innerText =data.message;
          parrafo.style.color = "red";
          console.error("Respuesta del servidor:", data);
        }
      } catch (error) {
        parrafo.innerText = "Error";
        parrafo.style.color = "red";
      }
    });
});
