document.addEventListener("DOMContentLoaded", function() {

 //  Close Login Modal 
 function closeLoginModal() {
    document.querySelector('.login-modal').style.display = 'none';
    document.querySelector('.popup-overlay').style.display = 'none';
  }

//    Close Register Modal 
  function closeRegisterModal() {
    document.querySelector('.register-modal').style.display = 'none';
    document.querySelector('.popup-overlay').style.display = 'none';
  }
//   Open Login Modal 
  function openLoginModal() {
    document.querySelector('.login-modal').style.display = 'block';
    document.querySelector('.popup-overlay').style.display = 'block';
    console.log("clicked");
  }
//   Open Register Modal 
  function openRegisterModal() {
    document.querySelector('.register-modal').style.display = 'block';
    document.querySelector('.popup-overlay').style.display = 'block';
  }

  

//  Close Login Event Listener
document.querySelector('.close-login').addEventListener('click', closeLoginModal)

//  Close Register Event Listener
document.querySelector('.close-register').addEventListener('click', closeRegisterModal)

//  Open Login Event Listener
document.getElementById('login-btn').addEventListener('click', openLoginModal);

// Open Register Event Listener
document.getElementById('register-btn').addEventListener('click', openRegisterModal);
});


