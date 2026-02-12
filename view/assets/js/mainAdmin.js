document.addEventListener("DOMContentLoaded", async () => {
  /******************************************************************************************************
   *****************************************VARIABLE DECLARATION*****************************************
   ******************************************************************************************************/

  //Loading the current user from localstorage, can be admin or user this is checked later
  //let profile = JSON.parse(localStorage.getItem("actualProfile")); //HACER UN PHP NUEVO QUE COJA EL USUARIO ENTERO CON $SESSION Y GUARDARLO AQUI EN LA PROFILE 

  let profile = null;
  let role = null; // 'user' | 'admin'
  try {
    // Try to get user session
    let respUser = await fetch(`../../api/GetUser.php`, {
      method: "GET",
      credentials: "include",
    });
    if (respUser.ok) {
      const dataUser = await respUser.json();
      if (dataUser && dataUser.data) {
        profile = dataUser.data;
      }
    }
  } catch (e) {
    // ignore 
  }

  if (!profile) {
    try {
      let respAdmin = await fetch(`../../api/GetAdmin.php`, {
        method: "GET",
        credentials: "include",
      });
      if (respAdmin.ok) {
        const dataAdmin = await respAdmin.json();
        if (dataAdmin && dataAdmin.data) {
          profile = dataAdmin.data;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  console.log(profile);
  
  // Define gridContainer before calling loadShoes
  const gridContainer = document.getElementById('grid-container');
  loadShoes(gridContainer);
  console.log("zapas cargadas");
  
  /* ----------HOME---------- */
  const homeBtn = document.getElementById("adjustData");

  /* ----------USER POPUP---------- */
  const modifyUserPopup = document.getElementById("modifyUserPopupAdmin");
  const changePwdBtn = document.getElementById("changePwdBtn");
  const saveBtnUser = document.getElementById("saveBtnUser");

  /*----------SNEAKER CHECK POPUP----------*/

const checkSneakerBtn = document.getElementById("checkSneakers");
const sneakerPopUp = document.getElementById("checkSneakerPopUp");
const sneakerList = document.getElementById("sneakerList");
const sneakerDetail = document.getElementById("sneakerDetail");

  /* ----------ADMIN POPUP---------- */
  const modifyAdminPopup = document.getElementById("modifyAdminPopup");
  const changePwdBtnAdmin = document.getElementById("changePwdBtnAdmin");
  const adminTableModal = document.getElementById("adminTableModal");
  const modifyAdminBtn = document.getElementById("modifySelfButton");
  const saveBtnAdmin = document.getElementById("saveBtnAdmin");

  /* ----------SHARED ELEMENTS---------- */
  const changePwdModal = document.getElementById("changePasswordModal");
  const deleteBtn = document.getElementById("deleteBtn");
  const closePasswordSpan =
    document.getElementsByClassName("closePasswordSpan")[0];
  const logoutIcon = document.getElementsByClassName("logoutIcon")[0];

  /*.......load shoes to the grid.......*/
  
  

  /******************************************************************************************************
   ****************************************BUTTON FUNCTIONALITIES****************************************
   ******************************************************************************************************/

  /* ----------HOME---------- */
  //Opens a popup depending on if the profile is a user or admin
  homeBtn.onclick = function () {
    if (["CARD_NO"] in profile) {
      document.getElementById("message").innerHTML = "";
      openModifyUserPopup(profile);
    } else if (["CURRENT_ACCOUNT"] in profile) {
      refreshAdminTable();
      adminTableModal.style.display = "block";
      //Hide delete button in user popups as admin can delete directly from table, no need for 2 buttons for the same thing
      deleteBtn.style.display = "none";
    }
  };

  /* ----------USER POPUP---------- */
  changePwdBtn.onclick = function () {
    changePwdModal.style.display = "block";
    resetPasswordModal();
  };

  saveBtnUser.onclick = function () {
    modifyUser(profile);
  };

  /*----------SNEAKER CHECK POPUP----------*/
 if (checkSneakerBtn) {
    checkSneakerBtn.onclick = function () {
        openSneakerCheckModal();
    };
}

  // ----------ADMIN POPUP----------
  closeAdminSpan.onclick = function () {
    adminTableModal.style.display = "none";
  };

  changePwdBtnAdmin.onclick = function () {
    changePwdModal.style.display = "block";
    resetPasswordModal();
  };

  modifyAdminBtn.onclick = function () {
    openModifyAdminPopup(profile);
  };

  saveBtnAdmin.onclick = function () {
    modifyAdmin(profile);
  };
//----------

/* ----------ADMIN POPUP---------- */
// Cerrar modal de tabla de usuarios
const closeAdminSpan = document.querySelector(".adminTableModal .close");
if (closeAdminSpan) {
  closeAdminSpan.onclick = function () {
    adminTableModal.style.display = "none";
  };
}


// Cerrar modales de modificación
const closeModals = function() {
  // Cerrar todos los modales cuando se hace clic en cualquier botón close
  document.querySelectorAll(".close").forEach(closeBtn => {
    closeBtn.addEventListener("click", function() {
      const modal = this.closest(".modifyUserPopupAdmin, .modifyAdminPopup, .adminTableModal, .checkSneakerPopUp");
      if (modal) {
        modal.style.display = "none";
      }
    });
  });
};

// Inicializar cierre de modales
closeModals();
  /* ----------SHARED ELEMENTS---------- */
  deleteBtn.onclick = function () {
    delete_user(profile["PROFILE_CODE"]);
  };

  closePasswordSpan.onclick = function () {
    changePwdModal.style.display = "none";
  };

  logoutIcon.onclick = function () {
    logout();
  };


  //If a popup is clicked outside of the actual area, automatically close the popup
window.onclick = function (event) {
  if (event.target == adminTableModal) {
    adminTableModal.style.display = "none";
  } else if (event.target == modifyUserPopup) {
    modifyUserPopup.style.display = "none";
  } else if (event.target == modifyAdminPopup) {
    modifyAdminPopup.style.display = "none";
  } else if (event.target == changePwdModal) {
    changePwdModal.style.display = "none";
  } else if (event.target == sneakerPopUp) {
    sneakerPopUp.style.display = "none";
  }
  
  // Additional: Close admin modal when clicking outside (for admin page)
  const adminModal = document.getElementById('adminTableModal');
  if (adminModal && event.target === adminModal) {
    adminModal.style.display = 'none';
  } else if (event.target == sneakerPopUp) {
    sneakerPopUp.style.display = "none";
}
}; 

  //Change password popup functionality, inside this initial on document loaded method as it relies on the
  //form existing even though it isnt shown to be able to listen to it, if it isnt inside this on document
  //loaded method an error occurs as it tries to listen to the form before it is loaded
  document
    .getElementById("changePasswordForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      document.getElementById("messageOldPassword").innerHTML = "";
      document.getElementById("messageWrongPassword").innerHTML = "";
      document.getElementById("message").innerHTML = "";

      let actualProfile;

      /*if (["CARD_NO"] in profile) {
        actualProfile = JSON.parse(localStorage.getItem("actualUser"));
      } else if (["CURRENT_ACCOUNT"] in profile) {
        actualProfile = await response.data;
      }*/

      //HABRIA QUE CAMBIAR PARA QUE EL SERVER COMPRUEBE LA CONTRSEAÑAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
      actualProfile = profile;

      const profile_code = actualProfile["PROFILE_CODE"];
      const userPassword = actualProfile["PSWD"];
      const password = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword =
        document.getElementById("confirmNewPassword").value;

      let hasErrors = false;

      if (userPassword != password) {
        document.getElementById("messageOldPassword").innerHTML =
          "That is not your current password";
        hasErrors = true;
        console.log("CURRENT PASSWORD: ", userPassword);
        console.log("INPUT: ", password);
      }

      if (userPassword == newPassword) {
        document.getElementById("messageWrongPassword").innerHTML =
          "Password used before, try another one";
        hasErrors = true;
      }

      if (newPassword != confirmPassword) {
        document.getElementById("messageWrongPassword").innerHTML =
          "The passwords are not the same";
        hasErrors = true;
      }

      if (!hasErrors) {
        try {
          const response = await fetch("../../api/ModifyPassword.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              profile_code: profile_code,
              password: newPassword,
            }),
          });

          const data = await response.json();

          if (data.status == "success") {
            console.log("Code: " + data.code);
            actualProfile.PSWD = newPassword;
            document.getElementById("messageSuccessPassword").innerHTML = data.message;
            /*if (["CARD_NO"] in profile) {
              console.log("IS A USER");
              localStorage.setItem("actualUser", JSON.stringify(actualProfile));
            } else if (["CURRENT_ACCOUNT"] in profile) {
              console.log("IS AN ADMIN");
              localStorage.setItem(
                "actualProfile",
                JSON.stringify(actualProfile)
              );
            }*/

            setTimeout(() => {
              document.getElementById("messageSuccessPassword").innerHTML = ""; // clean the modified message
              document.getElementById("changePasswordForm").reset(); // clean all the fields
            }, 3000);
          } else {
            console.log("Code: " + data.code);
            document.getElementById("messageSuccessPassword").innerHTML = data.message;
            document.getElementById("messageSuccessPassword").style.color = "red";
          }
        } catch (error) {
          //DEBUG console.log(error);
        }
      }
    });
});

/******************************************************************************************************
 ***********************************************METHODS************************************************
 ******************************************************************************************************/

 /* ----------LOGOUT---------- */
async function logout() {
  try{
    let response = await fetch(`../../api/Logout.php`, {
      method: "GET",
      credentials: "include",
    });
  }catch(error){
    
  }

  if (response.ok){
    window.location.href = "../view/html/login.html";
    conseole.log("logout correcto");
  }else{
    console.log("Error: " + response.message);
  }
}
/* ----------HOME---------- */
function openModifyUserPopup(actualProfile) /*this profile can be admin or user*/ {
  document.getElementById("message").innerHTML = "";
  //localStorage.setItem("actualUser", JSON.stringify(actualProfile));

  const usuario = {
    profile_code: actualProfile.PROFILE_CODE,
    password: actualProfile.PSWD,
    email: actualProfile.EMAIL,
    username: actualProfile.USER_NAME,
    telephone: actualProfile.TELEPHONE,
    name: actualProfile.NAME_,
    surname: actualProfile.SURNAME,
    gender: actualProfile.GENDER,
    card_no: actualProfile.CARD_NO,
  };

  document.getElementById("usernameUser").value = usuario.username;
  console.log("este es el usuario", usuario);
  //if the profile has an atribute, it has them all, because all are mandatory
  if (usuario.email) {
    document.getElementById("emailUser").value = usuario.email;
    document.getElementById("phoneUser").value = usuario.telephone;
    document.getElementById("firstNameUser").value = usuario.name;
    document.getElementById("lastNameUser").value = usuario.surname;
    document.getElementById("genderUser").value = usuario.gender;
    document.getElementById("cardNumberUser").value = usuario.card_no;
  }

  let modifyUserPopup = document.getElementById("modifyUserPopupAdmin");
  modifyUserPopup.style.display = "flex";
}

/* ----------USER POPUP---------- */
async function modifyUser(actualProfile) {
  const usuario = {
    profile_code: actualProfile.PROFILE_CODE,
    password: actualProfile.PSWD,
    email: actualProfile.EMAIL,
    username: actualProfile.USER_NAME,
    telephone: actualProfile.TELEPHONE,
    name: actualProfile.NAME_,
    surname: actualProfile.SURNAME,
    gender: actualProfile.GENDER,
    card_no: actualProfile.CARD_NO,
  };

  const profile_code = usuario.profile_code;
  const name = document.getElementById("firstNameUser").value;
  const surname = document.getElementById("lastNameUser").value;
  const email = document.getElementById("emailUser").value;
  const username = document.getElementById("usernameUser").value;
  const telephone = document.getElementById("phoneUser").value.replace(/\s/g, "");
  const gender = document.getElementById("genderUser").value;
  const card_no = document.getElementById("cardNumberUser").value;

  const messageBox = document.getElementById("message");
  messageBox.innerHTML = "";
  messageBox.style.color = "red";

  if (!name || !surname || !email || !username || !telephone || !gender || !card_no) {
    messageBox.innerHTML = "You must fill all the fields";
    return;
  }

  function hasChanges() {
    return (
      name !== usuario.name ||
      surname !== usuario.surname ||
      email !== usuario.email ||
      username !== usuario.username ||
      telephone !== usuario.telephone ||
      gender !== usuario.gender ||
      card_no !== usuario.card_no
    );
  }

  if (!hasChanges()) {
    messageBox.innerHTML = "No changes detected";
    return;
  }

  try {
    const response = await fetch(
      `../../api/ModifyUser.php?profile_code=${encodeURIComponent(profile_code)}&name=${encodeURIComponent(name)}&surname=${encodeURIComponent(surname)}&email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&telephone=${encodeURIComponent(telephone)}&gender=${encodeURIComponent(gender)}&card_no=${encodeURIComponent(card_no)}`
    );

    const data = await response.json();

    if (data.status === "success") {
      messageBox.innerHTML = data.message;
      messageBox.style.color = "green";

      actualProfile.NAME_ = name;
      actualProfile.SURNAME = surname;
      actualProfile.EMAIL = email;
      actualProfile.USER_NAME = username;
      actualProfile.TELEPHONE = telephone;
      actualProfile.CARD_NO = card_no;
      actualProfile.GENDER = gender;

      if ("CURRENT_ACCOUNT" in actualProfile) {
        refreshAdminTable();
      }

      return;
    }

    if (data.code === 422 && data.errors) {
      let html = "<ul>";
      for (const field in data.errors) {
        html += `<li>${data.errors[field]}</li>`;
      }
      html += "</ul>";
      messageBox.innerHTML = html;
      return;
    }

    messageBox.innerHTML = data.message || "Unknown error";
  } catch (error) {
    messageBox.innerHTML = "Network/Server error";
  }
}


/* ----------ADMIN POPUP---------- */
async function get_all_users() {
  const response = await fetch("../../api/GetAllUsers.php");
  const data = await response.json();

  return data["data"];
}

async function delete_user_admin(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  const response = await fetch(
    `../../api/DeleteUser.php?id=${encodeURIComponent(id)}`
  );

  const data = await response.json();

  if (data.error) {
    //DEBUG console.log("Error deleting user: ", data.error);
  } else {
    //DEBUG console.log("User deleted.");
    row = document.getElementById(`user${id}`);
    if (row) row.remove();
  }
}

async function refreshAdminTable() {
  let table = document.getElementById("adminTable");
  table.innerHTML = `<tr class="adminTableHead">
              <th>Username</th>
              <th>Card Number</th>
              <th></th>
            </tr>`;
  let users = await get_all_users();

  if (users) {
    users.forEach((user) => {
      const profile_id = user["PROFILE_CODE"];
      let row = adminTable.insertRow(1);
      row.className = "adminTableData";
      row.id = `user${profile_id}`;
      let username = row.insertCell(0);
      username.id = `${profile_id}Username`;
      let cardNo = row.insertCell(1);
      cardNo.id = `${profile_id}CardNo`;
      let buttons = row.insertCell(2);

      username.innerHTML = user["USER_NAME"];
      cardNo.innerHTML = user["CARD_NO"];
      buttons.innerHTML = `<div class="center-flex-div">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-small"
                  onclick='openModifyUserPopup(${JSON.stringify(user)})'
                >
                  <path
                    d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"
                  />
                  <path
                    d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"
                  />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#ff5457"
                  class="size-small"
                  onclick="delete_user_admin(${user.PROFILE_CODE})" 
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>`;
    });
  } else {
    let row = adminTable.insertRow(1);
    row.className = "adminTableData";
    let username = row.insertCell(0);
    let accountNum = row.insertCell(1);
    let buttons = row.insertCell(2);

    accountNum.innerHTML = "No users available.";
  }
}

// PRUEBA SNEAKER POPUP INICIO


// PRUEBA SNEAKER POPUP FIN

function openModifyAdminPopup(actualProfile) {
  document.getElementById("messageAdmin").innerHTML = "";
  //const actualProfile = JSON.parse(localStorage.getItem("actualProfile"));
  let modifyAdminPopup = document.getElementById("modifyAdminPopup");

  const usuario = {
    profile_code: actualProfile.PROFILE_CODE,
    password: actualProfile.PSWD,
    email: actualProfile.EMAIL,
    username: actualProfile.USER_NAME,
    telephone: actualProfile.TELEPHONE,
    name: actualProfile.NAME_,
    surname: actualProfile.SURNAME,
    current_account: actualProfile.CURRENT_ACCOUNT,
  };

  //DEBUG console.log("User username: ", usuario.username);

  document.getElementById("usernameAdmin").value = usuario.username;
  document.getElementById("emailAdmin").value = usuario.email;
  document.getElementById("phoneAdmin").value = usuario.telephone;
  document.getElementById("firstNameAdmin").value = usuario.name;
  document.getElementById("lastNameAdmin").value = usuario.surname;
  document.getElementById("profileCodeAdmin").value = usuario.profile_code;
  document.getElementById("currentAccountAdmin").value =
    usuario.current_account;

  modifyAdminPopup.style.display = "flex";
}

async function modifyAdmin(actualProfile) {
  const usuario = {
    profile_code: actualProfile.PROFILE_CODE,
    password: actualProfile.PSWD,
    email: actualProfile.EMAIL,
    username: actualProfile.USER_NAME,
    telephone: actualProfile.TELEPHONE,
    name: actualProfile.NAME_,
    surname: actualProfile.SURNAME,
    current_account: actualProfile.CURRENT_ACCOUNT,
  };

  const profile_code = usuario.profile_code;
  const name = document.getElementById("firstNameAdmin").value;
  const surname = document.getElementById("lastNameAdmin").value;
  const email = document.getElementById("emailAdmin").value;
  const username = document.getElementById("usernameAdmin").value;
  const telephone = document.getElementById("phoneAdmin").value.replace(/\s/g, "");
  const current_account = document.getElementById("currentAccountAdmin").value;

  const messageBox = document.getElementById("messageAdmin");
  messageBox.innerHTML = "";
  messageBox.style.color = "red";

  if (!name || !surname || !email || !username || !telephone || !current_account) {
    messageBox.innerHTML = "You must fill all the fields";
    return;
  }

  function hasChanges() {
    return (
      name !== usuario.name ||
      surname !== usuario.surname ||
      email !== usuario.email ||
      username !== usuario.username ||
      telephone !== usuario.telephone ||
      current_account !== usuario.current_account
    );
  }

  if (!hasChanges()) {
    messageBox.innerHTML = "No changes detected";
    return;
  }

  try {
    const response = await fetch(
      `../../api/ModifyAdmin.php?profile_code=${encodeURIComponent(profile_code)}&name=${encodeURIComponent(name)}&surname=${encodeURIComponent(surname)}&email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&telephone=${encodeURIComponent(telephone)}&current_account=${encodeURIComponent(current_account)}`
    );

    const data = await response.json();

    if (data.status === "success") {
      messageBox.innerHTML = data.message;
      messageBox.style.color = "green";

      actualProfile.NAME_ = name;
      actualProfile.SURNAME = surname;
      actualProfile.EMAIL = email;
      actualProfile.USER_NAME = username;
      actualProfile.TELEPHONE = telephone;
      actualProfile.CURRENT_ACCOUNT = current_account;

      return;
    }

    if (data.code === 422 && data.errors) {
      let html = "<ul>";
      for (const field in data.errors) {
        html += `<li>${data.errors[field]}</li>`;
      }
      html += "</ul>";
      messageBox.innerHTML = html;
      return;
    }

    messageBox.innerHTML = data.message || "Unknown error";
  } catch (error) {
    messageBox.innerHTML = "Network/Server error";
  }
}


/* ----------SHARED ELEMENTS---------- */
function resetPasswordModal() {
  document.getElementById("changePasswordForm").reset();
  document.getElementById("messageOldPassword").innerHTML = "";
  document.getElementById("messageWrongPassword").innerHTML = "";
  document.getElementById("message").innerHTML = "";
}

async function delete_user(id) {
  if (!confirm("Are you sure you want to your account?")) return;

  const response = await fetch(
    `../../api/DeleteUser.php?id=${encodeURIComponent(id)}`
  );

  const data = await response.json();

  if (data.error) {
    //DEBUG console.log("Error deleting user: ", data.error);
  } else {
    window.location.href = "login.html";
  }
}

async function loadSneakersForModal() {
    try {
        console.log("Cargando zapatillas para el modal...");
        
        const sneakerList = document.getElementById("sneakerList");
        const sneakerDetail = document.getElementById("sneakerDetail");
        
        if (!sneakerList || !sneakerDetail) {
            console.error("No se encontraron elementos sneakerList o sneakerDetail");
            return;
        }
        
        // Mostrar mensaje de carga
        sneakerList.innerHTML = '<div class="loading">Cargando zapatillas...</div>';
        sneakerDetail.innerHTML = '<div class="loading">Selecciona una zapatilla</div>';
        
        // Hacer la petición
        const response = await fetch("../../api/GetAllShoes.php");
        
        if (!response.ok) {
            throw new Error("Error en la petición: " + response.status);
        }
        
        const data = await response.json();
        console.log("Datos recibidos:", data);
        
        if (data.status === "success" && data.data && data.data.length > 0) {
            // Renderizar la lista
            renderSneakerList(data.data);
            
            // Mostrar la primera zapatilla por defecto
            if (data.data[0]) {
                showSneakerDetails(data.data[0]);
            }
        } else {
            sneakerList.innerHTML = '<div class="no-data">No hay zapatillas disponibles</div>';
        }
        
    } catch (error) {
        console.error("Error al cargar zapatillas:", error);
        const sneakerList = document.getElementById("sneakerList");
        if (sneakerList) {
            sneakerList.innerHTML = '<div class="error">Error al cargar: ' + error.message + '</div>';
        }
    }
}
function renderSneakerList(shoes) {
    const sneakerList = document.getElementById("sneakerList");
    if (!sneakerList) return;
    
    sneakerList.innerHTML = "";
    
    shoes.forEach((shoe, index) => {
        const item = document.createElement("div");
        item.className = "sneaker-item";
        
        // Crear contenido de la tarjeta - SOLO BD
        item.innerHTML = `
            <div class="sneaker-item-brand">${shoe.BRAND || ''}</div>
            <div class="sneaker-item-model">${shoe.MODEL || ''}</div>
            <div class="sneaker-item-price">${shoe.PRICE ? parseFloat(shoe.PRICE).toFixed(2) : ''}</div>
            <div class="sneaker-item-size">${shoe.SIZE ? 'Talla ' + shoe.SIZE : ''}</div>
            <div style="margin-top: 8px; font-size: 0.7rem; color: #868e96;">
                ${shoe.COLOR || ''}${shoe.COLOR && shoe.ORIGIN ? ' • ' : ''}${shoe.ORIGIN || ''}
            </div>
        `;
        
        item.addEventListener("click", () => {
            document.querySelectorAll(".sneaker-item").forEach(el => {
                el.classList.remove("selected");
            });
            item.classList.add("selected");
            showSneakerDetail(shoe);
        });
        
        sneakerList.appendChild(item);
        
        if (index === 0) {
            item.classList.add("selected");
        }
    });
}

// Función auxiliar para abrir el modal desde cualquier lugar
function openSneakerModal() {
    const modal = document.getElementById("checkSneakerPopUp");
    if (modal) {
        modal.style.display = "flex";
        loadSneakersForModal();
    }
}

function openSneakerCheckModal() {
    console.log('Opening sneaker check modal');
    
    if (sneakerPopUp) {
        sneakerPopUp.style.display = "flex";
        loadSneakersForModal();
    }
}

async function loadSneakersForModal() {
    try {
        console.log('Loading sneakers for modal...');
        
        // Limpiar lista actual
        if (sneakerList) {
            sneakerList.innerHTML = '<p class="loading-message">Loading sneakers...</p>';
        }
        
        const response = await fetch("../../api/GetAllShoes.php");
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === "success" && data.data && data.data.length > 0) {
            console.log('Sneakers loaded:', data.data.length);
            renderSneakerList(data.data);
            
            // Mostrar detalles de la primera zapatilla por defecto
            if (data.data.length > 0) {
                showSneakerDetail(data.data[0]);
            }
        } else {
            console.error("No sneakers found");
            if (sneakerList) {
                sneakerList.innerHTML = '<p class="no-sneakers">No sneakers available</p>';
            }
        }
    } catch (error) {
        console.error("Error loading sneakers:", error);
        if (sneakerList) {
            sneakerList.innerHTML = '<p class="error-message">Error loading sneakers</p>';
        }
    }
}

function renderSneakerList(shoes) {
    if (!sneakerList) return;
    
    sneakerList.innerHTML = "";
    
    shoes.forEach(shoe => {
        const sneakerItem = document.createElement("div");
        sneakerItem.className = "sneakerItem";
        sneakerItem.dataset.id = shoe.ID;
        
        // Crear contenido de la tarjeta de zapatilla
        sneakerItem.innerHTML = `
            <div class="sneaker-item-content">
                <div class="sneaker-item-brand">${shoe.BRAND || 'Unknown Brand'}</div>
                <div class="sneaker-item-model">${shoe.MODEL || 'Unknown Model'}</div>
                <div class="sneaker-item-price">$${shoe.PRICE ? shoe.PRICE.toFixed(2) : '0.00'}</div>
                <div class="sneaker-item-size">Size: ${shoe.SIZE || 'N/A'}</div>
            </div>
        `;
        
        // Evento para mostrar detalles al hacer clic
        sneakerItem.addEventListener("click", () => {
            // Remover clase activa de todos los items
            document.querySelectorAll('.sneakerItem').forEach(item => {
                item.classList.remove('active');
            });
            
            // Agregar clase activa al item seleccionado
            sneakerItem.classList.add('active');
            
            // Mostrar detalles
            showSneakerDetail(shoe);
        });
        
        // Seleccionar el primer item por defecto
        if (shoes.indexOf(shoe) === 0) {
            sneakerItem.classList.add('active');
        }
        
        sneakerList.appendChild(sneakerItem);
    });
}

function showSneakerDetail(shoe) {
    if (!sneakerDetail) return;
    console.log('Shoe data:', shoe);

    sneakerDetail.innerHTML = `
        <div class="sneaker-detail-header">
            <h3>${shoe.BRAND || 'Unknown Brand'} ${shoe.MODEL || 'Unknown Model'}</h3>
            <div class="sneaker-detail-actions">
                <button type="button" class="update-btn" onclick="modifySneaker('${shoe.ID}')">
                    <i class="fas fa-save"></i> Update
                </button>
                <button type="button" class="remove-btn" onclick="removeSneaker('${shoe.ID}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
        
        <div class="sneaker-detail-content">
            <form id="sneakerForm">
                <div class="detail-row">
                    <div class="detail-field">
                        <label for="detail-id">ID</label>
                        <input type="text" id="detail-id" value="${shoe.ID || ''}" readonly>
                    </div>
                    <div class="detail-field">
                        <label for="detail-price">Price</label>
                        <input type="number" id="detail-price" value="${shoe.PRICE || ''}"step="0.01" min="0" readonly>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-field">
                        <label for="detail-brand">Brand</label>
                        <input type="text" id="detail-brand" value="${shoe.BRAND || ''}" readonly>
                    </div>
                    <div class="detail-field">
                        <label for="detail-model">Model</label>
                        <input type="text" id="detail-model" value="${shoe.MODEL || ''}" readonly>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-field">
                        <label for="detail-size">Size</label>
                        <input type="number" id="detail-size" value="${shoe.SIZE || ''}" min="1" readonly>
                    </div>
                    <div class="detail-field">
                        <label for="detail-color">Color</label>
                        <input type="text" id="detail-color" value="${shoe.COLOR || ''}" readonly>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-field">
                        <label for="detail-stock">Stock</label>
                        <input type="number" id="detail-stock" value="${shoe.STOCK || ''}" min="0">
                    </div>
                    <div class="detail-field">
                        <label for="detail-origin">Origin</label>
                        <input type="text" id="detail-origin" value="${shoe.ORIGIN || ''}" readonly>
                    </div>
                </div>
            </form>
        </div>
    `;
}


async function removeSneaker(shoeId) {
    if (!confirm('Are you sure you want to remove this sneaker?')) {
        return;
    }
    
    try {
        const response = await fetch(`../../api/DeleteShoe.php?id=${encodeURIComponent(shoeId)}`);
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Show success message
            const sneakerDetail = document.getElementById('sneakerDetail');
            if (sneakerDetail) {
                sneakerDetail.innerHTML = '<div class="success-message">Sneaker removed successfully!</div>';
                setTimeout(() => {
                    loadSneakersForModal();
                }, 1500);
            }
        } else {
            alert('Error removing sneaker: ' + (result.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error removing sneaker:', error);
        alert('Error removing sneaker: ' + error.message);
    }
}

async function modifySneaker(shoeId) {
    // Get form values
    const price = document.getElementById('detail-price')?.value || '';
    const model = document.getElementById('detail-model')?.value || '';
    const size = document.getElementById('detail-size')?.value || '';
    const color = document.getElementById('detail-color')?.value || '';
    const origin = document.getElementById('detail-origin')?.value || '';
    const brand = document.getElementById('detail-brand')?.value || '';
    const stock = document.getElementById('detail-stock')?.value || '';
    
    // Validate required fields
    if (!price || !model || !size || !color || !origin || !brand || !stock) {
        alert('Please fill all required fields');
        return;
    }
    
    try {
        // Build query string with all parameters
        const params = new URLSearchParams({
            id: shoeId,
            price: price,
            model: model,
            size: size,
            color: color,
            origin: origin,
            brand: brand,
            stock: stock
        });
        
        const response = await fetch(`../../api/ModifyShoe.php?${params.toString()}`);
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Show success message
            const sneakerDetail = document.getElementById('sneakerDetail');
            if (sneakerDetail) {
                sneakerDetail.innerHTML = '<div class="success-message">Sneaker updated successfully!</div>';
                setTimeout(() => {
                    loadSneakersForModal();
                }, 1500);
            }
        } else {
            // Handle validation errors
            if (result.errors) {
                let errorMessages = 'Validation errors:\n';
                for (const [field, message] of Object.entries(result.errors)) {
                    errorMessages += `- ${message}\n`;
                }
                alert(errorMessages);
            } else {
                alert('Error updating sneaker: ' + (result.message || 'Unknown error'));
            }
        }
    } catch (error) {
        console.error('Error updating sneaker:', error);
        alert('Error updating sneaker: ' + error.message);
    }
}

/*----------LOAD SHOES TO THE GRID----------*/
async function loadShoes(gridContainer) {
    try {
        console.log("Loading shoes...");
        
        // Check if grid container exists
        if (!gridContainer) {
            console.error("Grid container not found!");
            return;
        }

        const response = await fetch('../../api/GetUniqueShoes.php'); 
        
        if (!response.ok) {
            console.log('Error in the fetch');
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
        // Clean container
        gridContainer.innerHTML = '';
        
        // Check if data exists and has items
        if (!data || !data.data) {
            console.error("Invalid data format:", data);
            gridContainer.innerHTML = '<p>No shoes found</p>';
            return;
        }
        
        if (data.data.length === 0) {
            console.log("No shoes in database");
            gridContainer.innerHTML = '<p>No shoes available</p>';
            return;
        }
        
        // Create card for each shoe
        data.data.forEach(shoe => {
            const card = createShoeCard(shoe);
            gridContainer.appendChild(card);
        });
        
    } catch (error) {
        console.error("Error loading shoes:", error);
        if (gridContainer) {
            gridContainer.innerHTML = '<p>Error loading shoes</p>';
        }
    }
}


console.log("zapas cargadas");

/*----------SNEAKER CHECK POPUP - NUEVA VERSIÓN----------*/
// Esperar a que el DOM esté completamente cargado para obtener los elementos
setTimeout(() => {
    const checkSneakerBtn = document.getElementById("checkSneakers");
    const sneakerPopUp = document.getElementById("checkSneakerPopUp");
    
    console.log("Elementos sneakers:", {
        btn: checkSneakerBtn,
        modal: sneakerPopUp
    });
    
    if (checkSneakerBtn && sneakerPopUp) {
        console.log("Configurando botón Check Sneakers...");
        
        checkSneakerBtn.addEventListener("click", function(e) {
            e.preventDefault();
            console.log("Botón Check Sneakers clickeado!");
            
            // Mostrar el modal
            sneakerPopUp.style.display = "flex";
            
            // Cargar las zapatillas
            loadSneakersForModal();
        });
        
        // También configurar el cierre del modal
        sneakerPopUp.addEventListener("click", function(e) {
            if (e.target === sneakerPopUp) {
                sneakerPopUp.style.display = "none";
            }
        });
        
        // Configurar botones de cerrar dentro del modal
        const closeButtons = sneakerPopUp.querySelectorAll(".close, .modal-close-btn");
        closeButtons.forEach(btn => {
            btn.addEventListener("click", function() {
                sneakerPopUp.style.display = "none";
            });
        });
        
    } else {
        console.error("No se encontraron elementos para Check Sneakers");
        console.log("Buscando checkSneakers:", document.getElementById("checkSneakers"));
        console.log("Buscando checkSneakerPopUp:", document.getElementById("checkSneakerPopUp"));
    }
}, 100);
// create the card
function createShoeCard(shoe) {
    const card = document.createElement('div');
    card.className = 'shoe-card';
    
    const shoeName = shoe.MODEL;
    const shoePrice = shoe.PRICE;
    const shoeBrand = shoe.BRAND;
    const shoeImage = shoe.IMAGE_FILE;

    card.innerHTML = `
        <img src="../assets/img/${shoeImage || 'default_img.jpg'}" 
             alt="${shoeName}" 
             class="shoe-image">
        <div class="shoe-info">
            <div class="shoe-brand">${shoeBrand || ''}</div>
            <h3 class="shoe-name">${shoeName}</h3>
            <div class="shoe-price">$${shoePrice.toFixed(2)}</div>
        </div>
    `;
    
    // when click on the card, redirect to buy window
    card.addEventListener('click', () => {
        sessionStorage.setItem('shoe', JSON.stringify(shoe));
    
    
    window.location.href = 'detalle.html';
    });
    
    return card;
}

/******************************************************************************************************
 ************************************ ADMIN SPECIFIC FUNCTIONALITY ***********************************
 ******************************************************************************************************/

// ============================================
// ADMIN PAGE SPECIFIC CODE
// ============================================

// Check if we're on the admin page
function isAdminPage() {
    return document.getElementById('manageUsersBtn') !== null || 
           document.getElementById('adminTableModal') !== null;
}

// Initialize admin page functionality
function initAdminPage() {
    console.log('Initializing admin page functionality');
    
    // ============================================
    // 1. BOTÓN "MANAGE USERS" - ABRIR MODAL
    // ============================================
    const manageUsersBtn = document.getElementById('manageUsersBtn');
    if (manageUsersBtn) {
        manageUsersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Manage Users button clicked');
            
            const adminModal = document.getElementById('adminTableModal');
            if (adminModal) {
                adminModal.style.display = 'block';
                console.log('Modal opened');
                
                // Si la función refreshAdminTable existe, ejecútala
                if (typeof refreshAdminTable === 'function') {
                    console.log('Refreshing admin table...');
                    refreshAdminTable();
                }
            }
        });
    }
    
    // ============================================
    // 2. BOTÓN DE CERRAR (X) - CERRAR MODAL
    // ============================================
    const closeAdminModalBtn = document.getElementById('closeAdminModalBtn');
    if (closeAdminModalBtn) {
        closeAdminModalBtn.addEventListener('click', function() {
            console.log('Close button clicked');
            
            const adminModal = document.getElementById('adminTableModal');
            if (adminModal) {
                adminModal.style.display = 'none';
                console.log('Modal closed');
            }
        });
    }
    
    // ============================================
    // 3. CLIC FUERA DEL MODAL - CERRAR MODAL
    // ============================================
    const originalWindowOnClick = window.onclick;
    window.onclick = function(event) {
        // Call original function if it exists
        if (typeof originalWindowOnClick === 'function') {
            originalWindowOnClick(event);
        }
        
        // Additional check for admin modal
        const adminModal = document.getElementById('adminTableModal');
        if (adminModal && event.target === adminModal) {
            console.log('Clicked outside admin modal');
            adminModal.style.display = 'none';
        }
    };
    
    // ============================================
    // 4. BOTÓN "VIEW PRODUCTS" - SCROLL SUAVE
    // ============================================
    const viewProductsBtn = document.getElementById('viewProductsBtn');
    if (viewProductsBtn) {
        viewProductsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const gridContainer = document.getElementById('grid-container');
            if (gridContainer) {
                gridContainer.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                console.log('Scrolled to products');
            }
        });
    }
    
    // ============================================
    // 5. BOTÓN DE LOGOUT ESPECÍFICO PARA ADMIN
    // ============================================
    const logoutBtnAdmin = document.getElementById('logoutBtnAdmin');
    if (logoutBtnAdmin) {
        logoutBtnAdmin.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Admin logout clicked');
            
            // Usar la función logout si existe
            if (typeof logout === 'function') {
                logout();
            }
        });
    }
    
    // ============================================
    // 6. ENLACES RÁPIDOS DEL FOOTER
    // ============================================
    // Dashboard link
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Users Management link
    const usersManagementLink = document.getElementById('usersManagementLink');
    if (usersManagementLink) {
        usersManagementLink.addEventListener('click', function(e) {
            e.preventDefault();
            const adminModal = document.getElementById('adminTableModal');
            if (adminModal) {
                adminModal.style.display = 'block';
            }
        });
    }
    
    // Products link
    const productsLink = document.getElementById('productsLink');
    if (productsLink) {
        productsLink.addEventListener('click', function(e) {
            e.preventDefault();
            const gridContainer = document.getElementById('grid-container');
            if (gridContainer) {
                gridContainer.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Settings link
    const settingsLink = document.getElementById('settingsLink');
    if (settingsLink) {
        settingsLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Settings feature coming soon!');
        });
    }
    
    // ============================================
    // 7. CARGAR ESTADÍSTICAS INICIALES
    // ============================================
    updateAdminStats();
}

// ============================================
// FUNCIÓN PARA ACTUALIZAR ESTADÍSTICAS
// ============================================
async function updateAdminStats() {
    console.log('Updating admin statistics...');
    
    try {
        // Obtener número total de usuarios
        const usersResponse = await fetch('../../api/GetAllUsers.php');
        if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            console.log('Users data received:', usersData);
            
            if (usersData.data) {
                const totalUsersElement = document.getElementById('totalUsers');
                if (totalUsersElement) {
                    totalUsersElement.textContent = usersData.data.length;
                    console.log('Total users updated:', usersData.data.length);
                }
            }
        }
        
        // Obtener número total de productos
        const productsResponse = await fetch('../../api/GetAllShoes.php');
        if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            console.log('Products data received:', productsData);
            
            if (productsData.data) {
                const totalProductsElement = document.getElementById('totalProducts');
                if (totalProductsElement) {
                    totalProductsElement.textContent = productsData.data.length;
                    console.log('Total products updated:', productsData.data.length);
                }
            }
        }
        
    } catch (error) {
        console.error('Error fetching admin statistics:', error);
    }
}

// ============================================
// INITIALIZE ADMIN FUNCTIONALITY
// ============================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (isAdminPage()) {
            initAdminPage();
        }
    });
} else {
    // DOM already loaded
    if (isAdminPage()) {
        initAdminPage();
    }
}


