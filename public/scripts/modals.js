$(function () {
  document.querySelector(".close").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
    document.querySelector(".popup-overlay").style.display = "none";
  });
  document.getElementById("login-btn").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "block";
    document.querySelector(".popup-overlay").style.display = "block";
  });
  document
    .getElementById("register-btn")
    .addEventListener("click", function () {
      document.querySelector(".registration-modal").style.display = "block";
      document.querySelector(".popup-overlay").style.display = "block";
    });
});
