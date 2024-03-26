let URLBACKEND = "https://student-management-k1k3.onrender.com";

//Alert
const showAlerts = document.querySelectorAll("[show-alert]");
if (showAlerts) {
  for (const item of showAlerts) {
    const time = item.getAttribute("data-time");
    setTimeout(() => {
      item.classList.add("alert-hidden");
    }, time);
    const closeAlert = document.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
      item.classList.add("alert-hidden");
    })
  }
}
//End alert

//Preview Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  uploadImageInput.addEventListener("change", (e) => {
    const [file] = e.target.files;
    uploadImagePreview.src = URL.createObjectURL(file);
  })
}
//End preview image