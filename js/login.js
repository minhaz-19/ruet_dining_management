import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, getDocs,getDoc, addDoc , doc, setDoc, updateDoc, DocumentSnapshot, deleteDoc
} from 'firebase/firestore'
import {
   getStorage, ref, uploadBytes, getDownloadURL
} from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword
} from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyBDO7u2dhOkLYDJDpVCI1MDJuRr_WS4MYU",
    authDomain: "ruet-dining-management.firebaseapp.com",
    projectId: "ruet-dining-management",
    storageBucket: "ruet-dining-management.appspot.com",
    messagingSenderId: "269174171595",
    appId: "1:269174171595:web:66e6174cdfb12ddda2384e",
    measurementId: "G-R852636W3G"
}

// init firebase
initializeApp(firebaseConfig);


// init services
const db = getFirestore();
const storage = getStorage();
const auth = getAuth();
var docRef;
var userEmail;
const admin_emails=['bangabandhu@gmail.com','sheikhhasina@gmail.com','hamid@gmail.com','selim@gmail.com','zia@gmail.com','shahidul@gmail.com','tinshed@gmail.com'];
const admin_halls=['Bangabandhu Sheikh Mujibur Rahman Hall','Deshratna Sheikh Hasina Hall','Shahid Abdul Hamid Hall','Shahid Lt. Selim Hall','Shahid President Ziaur Rahman Hall','Shahid Shahidul Islam Hall','Tin Shed Hall'];














  //=============================  Log In Page Javascript  ===============================



  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  }




  async function signIn(email, password) {
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
      // Access the signed-in user object
      const user = userCredential.user;
  
      // Return the user object or any other relevant data
      return user;
    } catch (error) {
      throw error;
    }
  }





function loginPage(){
var sign_in_btn = document.querySelector("#sign-in-btn");
var sign_up_btn = document.querySelector("#sign-up-btn");
var container = document.querySelector(".container");
var signUpSubmitButton = document.getElementById('signUpSubmitButton');
var loginButton = document.getElementById('loginButton');

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', ()=>{
  container.classList.remove("sign-up-mode");
});

signUpSubmitButton.addEventListener("click", (event) => {
  event.preventDefault();
 let signUpUserName = document.getElementById('signUpUserName').value;
 let signUpEmail = document.getElementById('signUpEmail').value;
 let signUpPassword = document.getElementById('signUpPassword').value;

 signup(signUpEmail, signUpPassword)
  .then(user => {
    userEmail= signUpEmail;
    
    localStorage.setItem("userid", user.uid);
    localStorage.setItem("userEmail", userEmail);
    if(admin_emails.includes(userEmail)){
      sessionStorage.setItem("meal_name", 'Lunch');
      window.location.href = './admin_order.html';
    }else{
      window.location.href = './order.html';
    }
  })
  .catch(error => {
    alert(error.message);
  });
});

loginButton.addEventListener("click", (event) => {
  event.preventDefault();
  let loginEmail = document.getElementById('loginEmail').value;
  let loginPassword = document.getElementById('loginPassword').value;
 
  signIn(loginEmail, loginPassword)
  .then(user => {
    userEmail= loginEmail;
    localStorage.setItem("userid", user.uid);
    localStorage.setItem("userEmail", userEmail);
    if(admin_emails.includes(userEmail)){
      sessionStorage.setItem("meal_name", 'Lunch');
      window.location.href = './admin_order.html';
    }else{
      window.location.href = './order.html';
    }
    
    
  })
  .catch(error => {
    alert(error.message);
  });
 });

}









//============================  Order Page Javascript ===========================




var show_item_price_in_menu, meal_name = 'Lunch', hall_name = 'Bangabandhu Sheikh Mujibur Rahman Hall',text_in_add_to_cart_button, is_admin;

var reference = hall_name+'/Menu/'+meal_name;
var item_name, item_price, item_availability, item_image_source;
 // collection ref
 var colRef = collection(db, reference);


function showDate(){
   userEmail = localStorage.getItem("userEmail");
   

  var nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1); // Add 1 day to the current date
    // Define an array of month names
    var monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    
    
  // Handle cases where the next day falls in the next month or year
  if (nextDay.getDate() === 1) {
    nextDay.setMonth(nextDay.getMonth() + 1); // Add 1 month
    if (nextDay.getMonth() === 0) {
      nextDay.setFullYear(nextDay.getFullYear() + 1); // Add 1 year
    }
  }

// Extract the date parts
var month = monthNames[nextDay.getMonth()]; // Get month name from array
var day = nextDay.getDate();
var year = nextDay.getFullYear();


    // Format the date as desired (e.g., "Month DD, YYYY")
    var formattedDate = month + " " + day + ", " + year;

    sessionStorage.setItem('formattedDate', formattedDate)
  
    // Update the innerHTML of the display element
    document.getElementById('show-date').innerHTML  = formattedDate;
}






function showMenuItems(item_name, show_item_price_in_menu, image_source){

  
    text_in_add_to_cart_button='Add to cart'
  

  // Create a new element
var newElement = document.createElement('div');

// Set class name for the new element
newElement.className = 'card my-3 shadow border-0 pt-2';

// Set styles for the new element
newElement.style.width = '18rem';


newElement.innerHTML = `
<img
  src="${image_source}"
  class="card-img-top standard-height"
  alt="..."
/>
<div class="card-body">
  <h5 class="card-title">
    <div class="row">
      <div class="col">${item_name}</div>
      <div class="col text-end">${show_item_price_in_menu} </div>
    </div>
  </h5>
  <a class="btn btn-secondary w-100" id="${item_name}" onclick="addToCartClicked(event, '${meal_name}', '${item_price}', '${hall_name}')">${text_in_add_to_cart_button}</a>
</div>`;




// Get the parent element by its ID name
var parentElement = document.getElementById('menu-items-card-holder');

// Append the new element to the parent element
parentElement.appendChild(newElement);
 
}

 


function menu(){

 colRef = collection(db, reference);

// get collection data
getDocs(colRef)
  .then(snapshot => {

    let items = []
    
    snapshot.docs.forEach(doc => {
      items.push({ ...doc.data(), id: doc.id })
        item_name = doc.id;
        item_price = doc.data().Price;
        item_image_source = doc.data().url;
        item_availability = doc.data().Available;
        if(item_price == 0){
          show_item_price_in_menu = 'Complementary'
        }else{
          show_item_price_in_menu = item_price +'/='
        }
        if(item_availability){
          showMenuItems(item_name, show_item_price_in_menu,item_image_source)
        }
    })
    
  })
  .catch(err => {
    item_name = 'Error';
        item_price = 'Error';
        item_availability = false;
  });

}




function lunchButtonClicked(){
  document.getElementById('lunch-button').addEventListener("click", function() {
    let lunch_button = document.getElementById('lunch-button');
    lunch_button.style.color = 'white';
    lunch_button.style.backgroundColor = 'rgba(63, 99, 183, 0.689)';
    let dinner_button = document.getElementById('dinner-button');
    dinner_button.style.color = 'black';
    dinner_button.style.backgroundColor = 'white';
    document.getElementById('menu-items-card-holder').innerHTML='';

    meal_name = 'Lunch';
    reference = hall_name+'/Menu/'+meal_name;
    menu();
  
  });
}


function dinnerButtonClicked(){
  document.getElementById('dinner-button').addEventListener("click", function() {
    let dinner_button = document.getElementById('dinner-button');
    dinner_button.style.color = 'white';
    dinner_button.style.backgroundColor = 'rgba(63, 99, 183, 0.689)';
    let lunch_button = document.getElementById('lunch-button');
    lunch_button.style.color = 'black';
    lunch_button.style.backgroundColor = 'white';
    document.getElementById('menu-items-card-holder').innerHTML='';

    meal_name = 'Dinner';
    reference = hall_name+'/Menu/'+meal_name;
    menu();
  
  });
}



function showSelectedHallName(){
  document.getElementById("myDropdownMenu").addEventListener("click", function(event) {
    meal_name='Lunch';
     hall_name = event.target.textContent;
     
    document.getElementById("showSelectedHallName").innerHTML = `<div class="row py-3 m-0 third-row">
    <div class="col">
      <div class="row m-0 py-3 first-row">
        <div class="col">
          <button
            type="button"
            class="btn btn-secondary btn-lg w-100 disabled"
            id="show-selected-hall-name"
          >
            ${hall_name}
          </button>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('menu-items-card-holder').innerHTML='';
  let lunch_button = document.getElementById('lunch-button');
    lunch_button.style.color = 'white';
    lunch_button.style.backgroundColor = 'rgba(63, 99, 183, 0.689)';
    let dinner_button = document.getElementById('dinner-button');
    dinner_button.style.color = 'black';
    dinner_button.style.backgroundColor = 'white';
  reference = hall_name+'/Menu/'+meal_name;
  window.selectedItemForLunch.length= 0;
  window.selectedItemForDinner.length= 0;
  menu();
  });
}



// async function uploadImage(collectionRef, documentId, newItemData) {
//   const imageInput = document.getElementById("imageInput");
//   const file = imageInput.files[0];

//   if (file) {
//     // Create a storage reference
//      image_storageRef = ref(storage, hall_name+"/" + file.name);

//     // Upload the file
//     uploadBytes(image_storageRef, file)
//       .then(() => {
//         console.log("Image uploaded successfully!");

    
//         getDownloadURL(image_storageRef)
//           .then((downloadURL) => {
//             item_image_download_url = downloadURL;
//             newItemData.url = downloadURL;
//       // Set the new document data for the selected document ID
//        setDoc(doc(collectionRef, documentId), newItemData);
//       document.getElementById("popup-container").style.display = "none";
            
//           })
//           .catch((error) => {
//             console.error("Error getting download URL: ", error);
//           });
//       })
//       .catch((error) => {
//         console.error("Error uploading image: ", error);
//       });
//   } else {
//     console.log("No file selected.");
//   }
// }


// function addItemButtonClicked(){
//   document.getElementById('add-element-container').addEventListener("click", function(event){
//     document.getElementById('popup-container').style.display = "block";
//     document.getElementById('add-item-lunch-button').innerHTML = meal_name;
//   });

  
// }

// function closeAddItemPopupClicked(){
//   document.getElementById('close-add-item-popup').addEventListener("click", function(event){
//     document.getElementById('popup-container').style.display = "none";
//   });
// }


// function submitAddItemButtonClicked() {
//   document.getElementById("submit-add-item-popup").addEventListener("click", async function (event) {
//     var newItemName = document.getElementById("itemNameToBeAdded").value;
//     var newItemValue = Number(document.getElementById("itemPriceToBeAdded").value);

//     reference = hall_name + "/Menu/" + meal_name;

//     var collectionRef = collection(db, reference);
//     var documentId = newItemName; // specify the document ID

//     // Create a new document with the data you want to add
//     var newItemData = {
//       Available: true,
//       Price: newItemValue,
//       url: item_image_download_url,
//     };

//     try {
//       // Upload the image to Firebase Storage
//   await uploadImage(collectionRef, documentId, newItemData);

//   // Get the download URL for the image
//   // const downloadURL = await getDownloadURL(image_storageRef);

//   // Update the newItemData with the download URL
  
//     } catch (error) {
//       console.error("Error adding document: ", error);
//     }
//   });
// }







function orderPage(){
  
  showDate();

  menu();

  lunchButtonClicked();

  dinnerButtonClicked();

  showSelectedHallName();

// addItemButtonClicked();

// closeAddItemPopupClicked();

// submitAddItemButtonClicked();


}





//--------------------------------   Cart Page   ------------------------------------------



var selectedItemForLunch = JSON.parse(sessionStorage.getItem('selectedItemForLunch'));
    var selectedItemForLunchPrice = JSON.parse(sessionStorage.getItem('selectedItemForLunchPrice'));

    const lunch_cartItemsContainer = document.getElementById('lunch_cartItems');
    const lunch_totalPriceContainer = document.getElementById('lunch_totalPrice');
    const lunchcheckoutButton = document.getElementById('make_payment_lunch');


    var selectedItemForDinner = JSON.parse(sessionStorage.getItem('selectedItemForDinner'));
    var selectedItemForDinnerPrice = JSON.parse(sessionStorage.getItem('selectedItemForDinnerPrice'));

    const dinner_cartItemsContainer = document.getElementById('dinner_cartItems');
    const dinner_totalPriceContainer = document.getElementById('dinner_totalPrice');
    const dinnercheckoutButton = document.getElementById('make_payment_dinner');





function lunch_renderCartItems() {
  if (sessionStorage.getItem('lunch_hall_name') != null || sessionStorage.getItem('lunch_hall_name') != undefined) {
    document.getElementById('lunch_cart_hall_name').textContent = sessionStorage.getItem('lunch_hall_name');
  }
  lunch_cartItemsContainer.innerHTML = '';
  let lunch_total = 0;

  for (let i = 0; i < selectedItemForLunch.length; i++) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');

    const nameElement = document.createElement('span');
    nameElement.classList.add('item-name');
    nameElement.textContent = selectedItemForLunch[i];

    const priceElement = document.createElement('span');
    priceElement.classList.add('item-price');
    priceElement.textContent = `${selectedItemForLunchPrice[i]}/=`;

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash', 'delete-icon');

    // Attach event listener to delete icon
    deleteIcon.addEventListener('click', function() {
      lunch_removeItem(i);
    });

    
    itemElement.appendChild(nameElement);
    itemElement.appendChild(priceElement);
    itemElement.appendChild(deleteIcon);

    lunch_cartItemsContainer.appendChild(itemElement);
    lunch_total += selectedItemForLunchPrice[i];
  }

  lunch_totalPriceContainer.textContent = `Total: ${lunch_total}/=`;
}

function lunch_removeItem(index) {
  selectedItemForLunch.splice(index, 1);
  selectedItemForLunchPrice.splice(index, 1);
  sessionStorage.setItem('selectedItemForLunch', JSON.stringify(selectedItemForLunch));
  sessionStorage.setItem('selectedItemForLunchPrice', JSON.stringify(selectedItemForLunchPrice));
  lunch_renderCartItems();
}







function dinner_renderCartItems() {
  if (sessionStorage.getItem('dinner_hall_name') != null || sessionStorage.getItem('dinner_hall_name') != undefined) {
    document.getElementById('dinner_cart_hall_name').textContent = sessionStorage.getItem('dinner_hall_name');
  }
  dinner_cartItemsContainer.innerHTML = '';
  let dinner_total = 0;

  for (let i = 0; i < selectedItemForDinner.length; i++) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');

    const nameElement = document.createElement('span');
    nameElement.classList.add('item-name');
    nameElement.textContent = selectedItemForDinner[i];

    const priceElement = document.createElement('span');
    priceElement.classList.add('item-price');
    priceElement.textContent = `${selectedItemForDinnerPrice[i]}/=`;

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash', 'delete-icon');

    // Attach event listener to delete icon
    deleteIcon.addEventListener('click', function() {
      dinner_removeItem(i);
    });

    
    itemElement.appendChild(nameElement);
    itemElement.appendChild(priceElement);
    itemElement.appendChild(deleteIcon);

    dinner_cartItemsContainer.appendChild(itemElement);
    dinner_total += selectedItemForDinnerPrice[i];
  }

  dinner_totalPriceContainer.textContent = `Total: ${dinner_total}/=`;
}

function dinner_removeItem(index) {
  selectedItemForDinner.splice(index, 1);
  selectedItemForDinnerPrice.splice(index, 1);
  sessionStorage.setItem('selectedItemForDinner', JSON.stringify(selectedItemForDinner));
  sessionStorage.setItem('selectedItemForDinnerPrice', JSON.stringify(selectedItemForDinnerPrice));
  dinner_renderCartItems();
}

 async function completePayment(meal_name, hall_name) {
  var reference = hall_name + '/Orders/' + sessionStorage.getItem('formattedDate')+'/' + meal_name + '/'+ 'Pending';

  var userEmail = localStorage.getItem('userEmail');

  var selectedItemForLunch = JSON.parse(sessionStorage.getItem('selectedItemForLunch'));
  var selectedItemForLunchPrice = JSON.parse(sessionStorage.getItem('selectedItemForLunchPrice'));
  var selectedItemForDinner = JSON.parse(sessionStorage.getItem('selectedItemForDinner'));
  var selectedItemForDinnerPrice = JSON.parse(sessionStorage.getItem('selectedItemForDinnerPrice'));

  // Create a new document with the data you want to add
  const newItemData = {}; // Create an empty object
  const updateOrderIdInUser = {};
  const currentTime = new Date();
  const autoGeneratedDoc = doc(collection(db, reference));
       updateOrderIdInUser[sessionStorage.getItem('formattedDate')] = autoGeneratedDoc.id,
      updateOrderIdInUser["hall"] = hall_name;

  const ordered_items_docref  = doc(collection(db, hall_name + '/Orders/' + sessionStorage.getItem('formattedDate') + '/' + meal_name + '/' + 'Ordered items'), "pending")
  const check_documentSnapshot = await getDoc(ordered_items_docref);



    
  if (meal_name === 'Lunch') {

  const updateItemsData = async (selectedItemForLunch, check_documentSnapshot, ordered_items_docref) => {
    try {
  
      selectedItemForLunch.forEach((item) => {
        if (newItemData.hasOwnProperty(item)) {
          newItemData[item]++;
        } else {
          newItemData[item] = 1;
        }
      });
  
      const updatePromises = Object.keys(newItemData).map(async (item_check) => {
        if (check_documentSnapshot.exists() && check_documentSnapshot.data()[item_check] !== undefined) {
          await updateDoc(ordered_items_docref, {
            [item_check]: check_documentSnapshot.data()[item_check] + newItemData[item_check]
          });
        } else {
          await setDoc(ordered_items_docref, {
            [item_check]: newItemData[item_check]
          }, { merge: true });
        }
      });
  
      await Promise.all(updatePromises);
  
      console.log('Items data updated successfully.');
    } catch (error) {
      console.error('Error updating items data:', error);
    }
  };
  
  updateItemsData(selectedItemForLunch, check_documentSnapshot, ordered_items_docref);
  
  
  


  await setDoc(autoGeneratedDoc, newItemData).then(
    
    await setDoc(doc(db, 'user/'+ localStorage.getItem("userid")+'/order/'+sessionStorage.getItem('formattedDate')+'/'+meal_name, currentTime.toString()), updateOrderIdInUser).then(
      {
        
    
    
      }
    ),
    
  );

  selectedItemForLunch=[];
  selectedItemForLunchPrice=[];
  sessionStorage.removeItem('selectedItemForLunch');
  sessionStorage.removeItem('selectedItemForLunchPrice');
  
  lunch_renderCartItems();
  sessionStorage.removeItem('lunch_hall_name');
  location.reload();

  

 


    
    
  } else if (meal_name === 'Dinner') {

    const updateItemsDataDinner = async (selectedItemForDinner, check_documentSnapshot, ordered_items_docref) => {
      try {
    
        selectedItemForDinner.forEach((item) => {
          if (newItemData.hasOwnProperty(item)) {
            newItemData[item]++;
          } else {
            newItemData[item] = 1;
          }
        });
    
        const updatePromises = Object.keys(newItemData).map(async (item_check) => {
          if (check_documentSnapshot.exists() && check_documentSnapshot.data()[item_check] !== undefined) {
            await updateDoc(ordered_items_docref, {
              [item_check]: check_documentSnapshot.data()[item_check] + newItemData[item_check]
            });
          } else {
            await setDoc(ordered_items_docref, {
              [item_check]: newItemData[item_check]
            }, { merge: true });
          }
        });
    
        await Promise.all(updatePromises);
    
        console.log('Items data updated successfully.');
      } catch (error) {
        console.error('Error updating items data:', error);
      }
    };
    
    updateItemsDataDinner(selectedItemForDinner, check_documentSnapshot, ordered_items_docref);


    selectedItemForDinner.forEach((item) => {
      if (newItemData.hasOwnProperty(item)) {
        newItemData[item]++;
      } else {
        newItemData[item] = 1;
      }
    });
    await setDoc(autoGeneratedDoc, newItemData).then(
      
      await setDoc(doc(db, 'user/'+ localStorage.getItem("userid")+'/order/'+sessionStorage.getItem('formattedDate')+'/'+meal_name, currentTime.toString()), updateOrderIdInUser),
      
    );

    selectedItemForDinner=[];
    selectedItemForDinnerPrice=[];
    sessionStorage.removeItem('selectedItemForDinner');
    sessionStorage.removeItem('selectedItemForDinnerPrice');

    dinner_renderCartItems();
    sessionStorage.removeItem('dinner_hall_name');
    location.reload();


  }

 
}









function cartPage(){

  


    if(selectedItemForLunch){
      lunch_renderCartItems();
    }
    if(selectedItemForDinner){
      dinner_renderCartItems();
    }
    

    

    lunchcheckoutButton.addEventListener('click', function() {

      completePayment('Lunch',sessionStorage.getItem('lunch_hall_name'));
      alert('Lunch payment completed!');
      // Perform additional actions here, such as redirecting to a payment gateway
    });

    dinnercheckoutButton.addEventListener('click', function() {
      completePayment('Dinner',sessionStorage.getItem('dinner_hall_name'));
      alert('Dinner payment completed!');
      // Perform additional actions here, such as redirecting to a payment gateway
    });
}




// ==========================   Order History page   ===============================





function showqr(meal_name) {
  
  var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var current_day = new Date();
  var month = monthNames[current_day.getMonth()];
  var day = current_day.getDate();
  var year = current_day.getFullYear();

  var current_formattedDate = month + " " + day + ", " + year;
  document.getElementById("show-date-in-history-page").innerText = 'Orders for '+current_formattedDate;

  var reference = 'user/' + localStorage.getItem("userid") + '/order/' + current_formattedDate + '/' + meal_name;
  var colRef = collection(db, reference);

  document.getElementById('lunch_qr').innerHTML ='';
  document.getElementById('dinner_qr').innerHTML ='';

  // Get collection data
  getDocs(colRef)
    .then(snapshot => {
      snapshot.docs.forEach(async doc => {
        if (doc.exists) {
          var order_id = await doc.data()[current_formattedDate];
          var ordered_hall_name = await doc.data()['hall'];
          var newElement = document.createElement('div');
          var newElementForOrderId = document.createElement('div');
          
          newElementForOrderId.innerHTML = `<div class="row d-flex justify-content-center align-items-center">Order Id: ${order_id}</div>`;
          var newElementForOrderIdHallName = document.createElement('div');
          newElementForOrderIdHallName.innerHTML = `<div class="row d-flex justify-content-center align-items-center">${ordered_hall_name}</div>`;
          if (order_id !== null) {
            newElement.innerHTML = await generateQRCode(order_id);
          } else {
            newElement.innerHTML = "No order ID found";
          }

          newElement.appendChild(newElementForOrderId);
          newElement.appendChild(newElementForOrderIdHallName);

          if (meal_name === 'Lunch') {
            document.getElementById("lunch_qr").appendChild(newElement);
          } else if (meal_name === 'Dinner') {
            document.getElementById("dinner_qr").appendChild(newElement);
          }
        } else {
          console.log("Document does not exist");
        }
      });
    })
    .catch(err => {
      console.log('Error getting the data:', err);
    });
}

function generateQRCode(order_id) {
  var qr = qrcode(0, 'L');
  qr.addData(order_id);
  qr.make();
  var svgTag = qr.createSvgTag({ cellSize: 10 });
  return svgTag;
}

function toggle_in_qr() {
  const lunchButton = document.getElementById("lunch-button");
  const dinnerButton = document.getElementById("dinner-button");
  

  document.getElementById('lunch-button').addEventListener("click", function() {
    let lunch_button = document.getElementById('lunch-button');
    lunch_button.style.color = 'white';
    lunch_button.style.backgroundColor = 'rgba(63, 99, 183, 0.689)';
    let dinner_button = document.getElementById('dinner-button');
    dinner_button.style.color = 'black';
    dinner_button.style.backgroundColor = 'white';
    lunchTab.classList.add("show", "active");
    dinnerTab.classList.remove("show", "active");
    showqr('Lunch');
  
  });



    document.getElementById('dinner-button').addEventListener("click", function() {
      let dinner_button = document.getElementById('dinner-button');
      dinner_button.style.color = 'white';
      dinner_button.style.backgroundColor = 'rgba(63, 99, 183, 0.689)';
      let lunch_button = document.getElementById('lunch-button');
      lunch_button.style.color = 'black';
      lunch_button.style.backgroundColor = 'white';
      dinnerTab.classList.add("show", "active");
      lunchTab.classList.remove("show", "active");
      showqr('Dinner');
    });
  

  // Get the lunch and dinner tab elements
  const lunchTab = document.getElementById("lunch");
  const dinnerTab = document.getElementById("dinner");

 
}






function historyPage(){
      toggle_in_qr();
}



// ================  log out page  =========================


function logOut(){
  const logoutButton = document.getElementById('logoutBtn');
  logoutButton.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      // Redirect to login page or any other page after logout
      window.location.href = './index.html';
    }).catch((error) => {
      console.log(error.message);
    });
  });
}





// ==============  Admin Order Page ============================

var lunch_pending, lunch_served, dinner_pending, dinner_served;
var item_image_download_url;
var image_storageRef;


async function admin_showDate(admin_hall_name){

  userEmail = localStorage.getItem("userEmail");
 
  // var admin_hall_name = admin_halls[admin_emails.indexOf(userEmail)];
  document.getElementById('show-selected-hall-name').innerHTML  = admin_hall_name;
  

 var date = new Date();

   var monthNames = [
     "January", "February", "March", "April", "May", "June",
     "July", "August", "September", "October", "November", "December"
   ];

// Extract the date parts
var month = monthNames[date.getMonth()]; // Get month name from array
var day = date.getDate();
var year = date.getFullYear();


   // Format the date as desired (e.g., "Month DD, YYYY")
   var formattedDate = month + " " + day + ", " + year;

   sessionStorage.setItem('formattedDate', formattedDate);
 
   // Update the innerHTML of the display element
   document.getElementById('show-date').innerHTML  = formattedDate;
}






function admin_showMenuItems(item_name, show_item_price_in_menu, image_source, hall_name) {
  // Create a new element
  var newElement = document.createElement('div');

  // Set class name for the new element
  newElement.className = 'card my-3 shadow border-0 pt-2';

  // Set styles for the new element
  newElement.style.width = '18rem';

  newElement.innerHTML = `
    <img
      src="${image_source}"
      class="card-img-top standard-height"
      alt="..."
    />
    <div class="card-body">
      <h5 class="card-title">
        <div class="row">
          <div class="col">${item_name}</div>
          <div class="col text-end">${show_item_price_in_menu}</div>
        </div>
      </h5>
      <a class="btn btn-secondary w-100">Edit This</a>
    </div>`;

  newElement.id = item_name;

  // newElement.addEventListener("click", () => editThisItemClicked(item_name, meal_name, hall_name));
  newElement.addEventListener("click", () => admin_editItemButtonClicked(item_name, meal_name, hall_name));

  // Get the parent element by its ID name
  var parentElement = document.getElementById('menu-items-card-holder');

  // Append the new element to the parent element
  parentElement.appendChild(newElement);
}

function admin_editItemButtonClicked(item_name, meal_name, hall_name){
  sessionStorage.setItem('item_name', item_name);
  sessionStorage.setItem('meal_name', meal_name);
  sessionStorage.setItem('hall_name', hall_name);
  document.getElementById('edit-item-popup-container').style.display = "block";
  document.getElementById('submit-update-item-popup').addEventListener("click", async function() {
    var updatedItemName = document.getElementById("itemNameToBeUpdated").value;
    var updatedItemValue = Number(document.getElementById("itemPriceToBeUpdated").value);
    var item_name = sessionStorage.getItem('item_name');
    var meal_name = sessionStorage.getItem('meal_name');
    var hall_name = sessionStorage.getItem('hall_name');
    var collectionRef = collection(db, hall_name + '/Menu/' + meal_name);
    if(updatedItemName !== ""){
      const oldDocRef = doc(collection(db, hall_name + '/Menu/' + meal_name), item_name);
  
  // Get the data from the old document
  const oldDocSnapshot = await getDoc(oldDocRef);
  const oldDocData = oldDocSnapshot.data();
  
  // Create a new document with the new ID
  const newDocRef = doc(collection(db, hall_name + '/Menu/' + meal_name), updatedItemName);
  
  // Set the data from the old document to the new document
  await setDoc(newDocRef, oldDocData);
  
  // Delete the old document if desired
  await deleteDoc(oldDocRef);
      item_name = updatedItemName;
    }

    if(updatedItemValue !== ""){
      await updateDoc(doc(collectionRef, item_name), { Price: updatedItemValue });
    }
    document.getElementById("edit-item-popup-container").style.display = "none";
    
    location.reload();
  });

  document.getElementById('delete-update-item-popup').addEventListener("click", async function() {
    
    var item_name = sessionStorage.getItem('item_name');
    var meal_name = sessionStorage.getItem('meal_name');
    var hall_name = sessionStorage.getItem('hall_name');
    var collectionRef = collection(db, hall_name + '/Menu/' + meal_name);
   
    await deleteDoc(doc(collectionRef, item_name));
     
    document.getElementById("edit-item-popup-container").style.display = "none";
    
    location.reload();
  });

  document.getElementById('make-item-unavailable').addEventListener("click", async function() {
    
    var item_name = sessionStorage.getItem('item_name');
    var meal_name = sessionStorage.getItem('meal_name');
    var hall_name = sessionStorage.getItem('hall_name');
    var collectionRef = collection(db, hall_name + '/Menu/' + meal_name);
   
    await updateDoc(doc(collectionRef, item_name), { Available: false });
     
    document.getElementById("edit-item-popup-container").style.display = "none";
    
    location.reload();
  });

  document.getElementById('close-update-item-popup').addEventListener("click", async function() {    
    document.getElementById("edit-item-popup-container").style.display = "none"; 
  });
}

async function editThisItemClicked(item_name, meal_name, hall_name) {
  var collectionRef = collection(db, hall_name + '/Menu/' + meal_name);
  await updateDoc(doc(collectionRef, item_name), { Available: false });
  location.reload();
  
  
}



function admin_showUnavailableMenuItems(item_name, show_item_price_in_menu, image_source,hall_name){

  // Create a new element
  var newElement = document.createElement('div');

  // Set class name for the new element
  newElement.className = 'card my-3 shadow border-0 pt-2';

  // Set styles for the new element
  newElement.style.width = '18rem';

  newElement.innerHTML = `
    <img
      src="${image_source}"
      class="card-img-top standard-height"
      alt="..."
    />
    <div class="card-body">
      <h5 class="card-title">
        <div class="row">
          <div class="col">${item_name}</div>
          <div class="col text-end">${show_item_price_in_menu}</div>
        </div>
      </h5>
      <a class="btn btn-secondary w-100">Make this item available</a>
    </div>`;

  newElement.id = item_name;

  newElement.addEventListener("click", () => makeItemAvailableClicked(item_name, meal_name, hall_name));
  // newElement.addEventListener("click", () => admin_editItemButtonClicked(item_name, meal_name, hall_name));

  // Get the parent element by its ID name
  var parentElement = document.getElementById('unavailable-items-card-holder');

  // Append the new element to the parent element
  parentElement.appendChild(newElement);
  
  }

  function makeItemAvailableClicked(item_name, meal_name, hall_name) {
    var collectionRef = collection(db, hall_name + '/Menu/' + meal_name);
    updateDoc(doc(collectionRef, item_name), { Available: true });
    document.getElementById('lunch-button').click();
  }


function admin_menu(admin_hall_name){
  // var admin_hall_name = admin_halls[admin_emails.indexOf(userEmail)];
  colRef = collection(db, reference);
 
 // get collection data
 getDocs(colRef)
   .then(snapshot => {

     let items = []
     
     snapshot.docs.forEach(doc => {
       items.push({ ...doc.data(), id: doc.id })
         item_name = doc.id;
         item_price = doc.data().Price;
         item_image_source = doc.data().url;
         item_availability = doc.data().Available;
         if(item_price == 0){
           show_item_price_in_menu = 'Complementary'
         }else{
           show_item_price_in_menu = item_price +'/='
         }
         if(item_availability){
           admin_showMenuItems(item_name, show_item_price_in_menu,item_image_source,admin_hall_name)
         }
         else{
          admin_showUnavailableMenuItems(item_name, show_item_price_in_menu,item_image_source,admin_hall_name)
         }
     })
     
   })
   .catch(err => {
     item_name = 'Error';
         item_price = 'Error';
         item_availability = false;
   });
 
 }

  async function admin_lunchButtonClicked(admin_hall_name){
 
  document.getElementById('lunch-button').addEventListener("click", async function() {
    document.getElementById('show-remaining-order-items').innerHTML=''
    let lunch_button = document.getElementById('lunch-button');
    lunch_button.style.color = 'white';
    lunch_button.style.backgroundColor = 'rgba(63, 99, 183, 0.689)';
    let dinner_button = document.getElementById('dinner-button');
    dinner_button.style.color = 'black';
    dinner_button.style.backgroundColor = 'white';

    var formattedDate = sessionStorage.getItem('formattedDate');
    var admin_hall_name = admin_halls[admin_emails.indexOf(userEmail)];
    var colRef = collection(db, admin_hall_name+'/Orders/'+formattedDate+'/Lunch/Pending');
    await getDocs(colRef).then(snapshot=>{
    lunch_pending = snapshot.size;});

    colRef = collection(db, admin_hall_name+'/Orders/'+formattedDate+'/Lunch/Served');
    await getDocs(colRef).then(snapshot=>{
    lunch_served = snapshot.size;});
    var show_in_lunch_pending = 'Pending : '+lunch_pending
    var show_in_lunch_served = 'Served : '+lunch_served
    document.getElementById('show_remaining_served_orders').textContent=`${show_in_lunch_pending} ${"\u00A0".repeat(8)} ${show_in_lunch_served}`;
    
    document.getElementById('menu-items-card-holder').innerHTML='';
    document.getElementById('unavailable-items-card-holder').innerHTML='';

    meal_name = 'Lunch';
    reference = admin_halls[admin_emails.indexOf(userEmail)]+'/Menu/'+meal_name;
    admin_menu(admin_hall_name);


    
    var docref_for_remaining_items = doc(collection(db, admin_hall_name+'/Orders/'+formattedDate+'/Lunch/Ordered items'), 'pending')
    const DocSnapshot = await getDoc(docref_for_remaining_items);
    const oldDocData = DocSnapshot.data();
  
    if (DocSnapshot.exists()) {
      for (let key in oldDocData) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
    
        const nameElement = document.createElement('span');
        nameElement.classList.add('item-name');
        nameElement.textContent = key;
    
        const priceElement = document.createElement('span');
        priceElement.classList.add('item-quantity');
        priceElement.textContent = oldDocData[key];
    
        itemElement.appendChild(nameElement);
        itemElement.appendChild(priceElement);
        
        
        document.getElementById('show-remaining-order-items').appendChild(itemElement);
      }
      
    }
  
  });
}


function admin_dinnerButtonClicked(admin_hall_name){
  
  document.getElementById('dinner-button').addEventListener("click", async function() {
    document.getElementById('show-remaining-order-items').innerHTML=''
    let dinner_button = document.getElementById('dinner-button');
    dinner_button.style.color = 'white';
    dinner_button.style.backgroundColor = 'rgba(63, 99, 183, 0.689)';
    let lunch_button = document.getElementById('lunch-button');
    lunch_button.style.color = 'black';
    lunch_button.style.backgroundColor = 'white';


    var formattedDate = sessionStorage.getItem('formattedDate');
    var admin_hall_name = admin_halls[admin_emails.indexOf(userEmail)];
    var colRef = collection(db, admin_hall_name+'/Orders/'+formattedDate+'/Dinner/Pending');
    await getDocs(colRef).then(snapshot=>{ 
    dinner_pending = snapshot.size;});

    colRef = collection(db, admin_hall_name+'/Orders/'+formattedDate+'/Dinner/Served');
    await getDocs(colRef).then(snapshot=>{
    dinner_served = snapshot.size;});
    var show_in_dinner_pending = 'Pending : '+dinner_pending
    var show_in_dinner_served = 'Served : '+dinner_served
    document.getElementById('show_remaining_served_orders').textContent=`${show_in_dinner_pending} ${"\u00A0".repeat(8)} ${show_in_dinner_served}`;


    document.getElementById('menu-items-card-holder').innerHTML='';
    document.getElementById('unavailable-items-card-holder').innerHTML='';

    meal_name = 'Dinner';
    reference = admin_halls[admin_emails.indexOf(userEmail)]+'/Menu/'+meal_name;
 
    admin_menu(admin_hall_name);


    
    var docref_for_remaining_items = doc(collection(db, admin_hall_name+'/Orders/'+formattedDate+'/Dinner/Ordered items'), 'pending')
    const DocSnapshot = await getDoc(docref_for_remaining_items);
    const oldDocData = DocSnapshot.data();
  
    if (DocSnapshot.exists()) {
      for (let key in oldDocData) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
    
        const nameElement = document.createElement('span');
        nameElement.classList.add('item-name');
        nameElement.textContent = key;
    
        const priceElement = document.createElement('span');
        priceElement.classList.add('item-quantity');
        priceElement.textContent = oldDocData[key];
    
        itemElement.appendChild(nameElement);
        itemElement.appendChild(priceElement);
        
        
        document.getElementById('show-remaining-order-items').appendChild(itemElement);
      }
      
    }
  
  });
}

async function uploadImage(collectionRef, documentId, newItemData, admin_hall_name, meal_name) {
  const imageInput = document.getElementById("imageInput");
  const file = imageInput.files[0];

  if (file) {
    // Create a storage reference
     image_storageRef = ref(storage, admin_hall_name+"/"+meal_name+'/' + file.name);
   

    // Upload the file
    uploadBytes(image_storageRef, file)
      .then(() => {
        console.log("Image uploaded successfully!");

    
        getDownloadURL(image_storageRef)
          .then((downloadURL) => {
            item_image_download_url = downloadURL;
            newItemData.url = downloadURL;
      // Set the new document data for the selected document ID
       setDoc(doc(collectionRef, documentId), newItemData);
      document.getElementById("popup-container").style.display = "none";
            
          })
          .catch((error) => {
            console.error("Error getting download URL: ", error);
          });
      })
      .catch((error) => {
        console.error("Error uploading image: ", error);
      });
  } else {
    console.log("No file selected.");
  }
}


function admin_addItemButtonClicked(){
  document.getElementById('add-element-container').addEventListener("click", function(event){
    document.getElementById('popup-container').style.display = "block";
    document.getElementById('add-item-lunch-button').innerHTML = meal_name;
  });

  
}

function admin_closeAddItemPopupClicked(){
  document.getElementById('close-add-item-popup').addEventListener("click", function(event){
    document.getElementById('popup-container').style.display = "none";
  });
}


function admin_submitAddItemButtonClicked(admin_hall_name) {
  document.getElementById("submit-add-item-popup").addEventListener("click", async function (event) {
    var newItemName = document.getElementById("itemNameToBeAdded").value;
    var newItemValue = Number(document.getElementById("itemPriceToBeAdded").value);

    reference = admin_hall_name + "/Menu/" + meal_name;

    var collectionRef = collection(db, reference);
    var documentId = newItemName; // specify the document ID

    // Create a new document with the data you want to add
    var newItemData = {
      Available: true,
      Price: newItemValue,
      url: item_image_download_url,
    };

    try {
      // Upload the image to Firebase Storage
  await uploadImage(collectionRef, documentId, newItemData,admin_hall_name, meal_name);

  // Get the download URL for the image
  // const downloadURL = await getDownloadURL(image_storageRef);

  // Update the newItemData with the download URL
  
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  });
}



function admin_order(){
  var userEmail = localStorage.getItem("userEmail");
  var admin_hall_name = admin_halls[admin_emails.indexOf(userEmail)];
  admin_showDate(admin_hall_name);
  admin_lunchButtonClicked(admin_hall_name);
  admin_dinnerButtonClicked(admin_hall_name);
  admin_addItemButtonClicked(admin_hall_name);
  admin_closeAddItemPopupClicked(admin_hall_name);
  admin_submitAddItemButtonClicked(admin_hall_name);
}



// ============================  Scan QR Page  ================================

function scan_qr_page(){
  const show_ordered_item_list = document.getElementById('show_ordered_item_list');
  var userEmail = localStorage.getItem("userEmail");
  var admin_hall_name = admin_halls[admin_emails.indexOf(userEmail)];
  sessionStorage.setItem("admin_hall_name", admin_hall_name);
  var meal_name = sessionStorage.getItem("meal_name");
  var formattedDate = sessionStorage.getItem('formattedDate');
  var lunch_dinner_toggle_button = document.getElementById('lunch-dinner-toggle-button');
  lunch_dinner_toggle_button.innerText = meal_name;

  lunch_dinner_toggle_button.addEventListener("click", function(event){
    if(meal_name=='Lunch'){
      sessionStorage.setItem("meal_name", 'Dinner');
      location.reload();
    }
    else{
      sessionStorage.setItem("meal_name", 'Lunch');
      location.reload();
    }
  });
  
  document.getElementById('scan_another_qr_button').addEventListener("click", function(event){
    location.reload();
  });
  

  document.getElementById('search_qr_button').addEventListener("click", async function(event){
    var qrCodeValueInput = document.getElementById('qrCodeValue');
   const DocRef = doc(collection(db, admin_hall_name + '/Orders/' + formattedDate+ '/'+ meal_name+'/Pending'), qrCodeValueInput.value);
  
  const DocSnapshot = await getDoc(DocRef);
  const oldDocData = DocSnapshot.data();
  
  if (DocSnapshot.exists()) {
    for (let key in oldDocData) {
      const itemElement = document.createElement('div');
      itemElement.classList.add('item');
  
      const nameElement = document.createElement('span');
      nameElement.classList.add('item-name');
      nameElement.textContent = key;
  
      const priceElement = document.createElement('span');
      priceElement.classList.add('item-quantity');
      priceElement.textContent = oldDocData[key];
  
      itemElement.appendChild(nameElement);
      itemElement.appendChild(priceElement);
      
      
      document.getElementById('show_ordered_item_list').appendChild(itemElement);
    }
    document.getElementById('order_served_button').style.display ='block'
    
  }
  else{
    document.getElementById('show_ordered_item_list').classList.add("text-center","h1");
    document.getElementById('show_ordered_item_list').innerText = 'Invalid Order Id'
  }


  });

  document.getElementById('order_served_button').addEventListener("click", async function(event){
    var qrCodeValueInput = document.getElementById('qrCodeValue');
    const DocRef = doc(collection(db, admin_hall_name + '/Orders/' + formattedDate+ '/'+ meal_name+'/Pending'), qrCodeValueInput.value);
    
    const oldDocSnapshot = await getDoc(DocRef);
    const oldDocData = oldDocSnapshot.data();
  
  // Create a new document with the new ID
  const newDocRef = doc(collection(db, admin_hall_name + '/Orders/' + formattedDate+ '/'+ meal_name+'/Served'), qrCodeValueInput.value);
  
  // Set the data from the old document to the new document
  await setDoc(newDocRef, oldDocData);
  
  // Delete the old document if desired
  await deleteDoc(DocRef);


  var docref_for_remaining_items = doc(collection(db, admin_hall_name+'/Orders/'+formattedDate+'/'+meal_name+'/Ordered items'), 'pending');
  const remaining_items_DocSnapshot = await getDoc(docref_for_remaining_items);
  // await updateDoc(docref_for_remaining_items, {
  //   [item_check]: check_documentSnapshot.data()[item_check] + oldDocData[item_check]
  // });

  const updatePromisesRemainingItems = Object.keys(oldDocData).map(async (item_check) => {

      await updateDoc(docref_for_remaining_items, {
        [item_check]: remaining_items_DocSnapshot.data()[item_check] - oldDocData[item_check]
      });
    
  });
  
  await Promise.all(updatePromisesRemainingItems);
  


  location.reload();  
  });
}


//===============================  Select Javascript function  =================

if(document.title == 'Log In'){
  loginPage();
}
else if(document.title == 'Order Meal'){
  orderPage();
}
else if(document.title == 'Cart'){
  cartPage();
}
else if(document.title == 'Order History'){
  historyPage();
}
else if(document.title == 'Log Out'){
  logOut();
}
else if(document.title == 'Order'){
  admin_order();
}
else if(document.title == 'Scan QR'){
  
  scan_qr_page();
}