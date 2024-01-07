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