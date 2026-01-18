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
  loadSneakers();
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
  /* ----------ADMIN POPUP---------- */
  const modifyAdminPopup = document.getElementById("modifyAdminPopup");
  const closeAdminSpan = document.getElementsByClassName("close")[0];
  const changePwdBtnAdmin = document.getElementById("changePwdBtnAdmin");
  const adminTableModal = document.getElementById("adminTableModal");
  const modifyAdminBtn = document.getElementById("modifySelfButton");
  const saveBtnAdmin = document.getElementById("saveBtnAdmin");

  /* ----------SHARED ELEMENTS---------- */
  const changePwdModal = document.getElementById("changePasswordModal");
  const deleteBtn = document.getElementById("deleteBtn");
  const closePasswordSpan =
    document.getElementsByClassName("closePasswordSpan")[0];

  /*.......load shoes to the grid.......*/
  const logoutBtn = document.querySelector(".logoutBtn");
  

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
  checkSneakerBtn.onclick = function () {
    openSneakerPopUpCheck();
  };

  /* ----------ADMIN POPUP---------- */
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

  /* ----------SHARED ELEMENTS---------- */
  deleteBtn.onclick = function () {
    delete_user(profile["PROFILE_CODE"]);
  };

  closePasswordSpan.onclick = function () {
    changePwdModal.style.display = "none";
  };

  logoutBtn.onclick = function () {
    logout();
  };

  gridContainer.onlcikck

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
function openSneakerPopUpCheck(){
  let checkSneaker =document.getElementById("checkSneakerPopUp")
  checkSneaker.style.display = "flex";
}

const itemsSneakers = document.querySelectorAll(".sneakerItem");
const detail = document.getElementById("sneakerDetail");

itemsSneakers.forEach(item => {
  item.addEventListener("click", () => {
    detail.textContent = "INFO ZAPATILLA";
  });
});



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

const gridContainer = document.getElementById('grid-container');
/*----------LOAD SHOES TO THE GRID----------*/
async function loadSneakers() {
    try {
     

        const response = await fetch('../../api/GetShoes.php'); //cambiar por metodo de Alis
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        
        const shoes = await response.json();
        
        // Clean container
        gridContainer.innerHTML = '';
        
        // for each to create the card of each sheo
        shoes.forEach(shoe => {
            const card = createSneakerCard(shoe);
            gridContainer.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading shoes:', error);
    }
}

// create the card
function createSneakerCard(shoe) {
    const card = document.createElement('div');
    card.className = 'sneaker-card';
    
    // se puede guardar en localstorage o enviar por post?
    card.dataset.shoe = JSON.stringify(shoe);
    
    card.innerHTML = `
        <img src="${shoe.imagen || 'default-image.jpg'}" 
             alt="${shoe.nombre}" 
             class="sneaker-image"
             onerror="this.src='default-image.jpg'">
        <div class="sneaker-info">
            <div class="sneaker-brand">${shoe.marca || ''}</div>
            <h3 class="sneaker-name">${shoe.nombre}</h3>
            <div class="sneaker-price">$${shoe.precio.toFixed(2)}</div>
        </div>
    `;
    
    // when click on the card, redirect to buy window
    card.addEventListener('click', () => {
        sessionStorage.setItem('shoe', JSON.stringify(shoe));
    
    
    window.location.href = 'detalle.html';
    });
    
    return card;
}
