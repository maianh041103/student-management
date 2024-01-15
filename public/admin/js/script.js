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

//Change status
const listButtonStatus = document.querySelectorAll("[data-status]");
if (listButtonStatus) {
  for (const button of listButtonStatus) {
    button.addEventListener("click", (e) => {
      const dataId = button.getAttribute("data-id");
      const dataStatus = button.getAttribute("data-status");
      const type = button.getAttribute("type");
      fetch(`http://localhost:3000/admin/${type}/changeStatus?id=${dataId}&status=${dataStatus}`, {
        method: "PATCH",
        "headers": {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          location.reload();
        })
    })
  }
}
//End change status

//Delete Item
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete) {
  for (const button of listButtonDelete) {
    button.addEventListener("click", (e) => {
      const check = confirm("Bạn có chắc chắn muốn xóa?");
      if (check) {
        const type = button.getAttribute("type");
        const id = button.getAttribute("data-id");
        fetch(`http://localhost:3000/admin/${type}/delete/${id}`, {
          method: "DELETE",
          "headers": {
            "Content-Type": "application/json"
          }
        })
          .then(res => res.json())
          .then(data => {
            location.reload();
          })
      }
    })
  }
}
//End delete Item

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

//Remove Student 
const listButtonRemove = document.querySelectorAll("[button-remove]");
if (listButtonRemove) {
  for (const button of listButtonRemove) {
    button.addEventListener("click", (e) => {
      const check = confirm("Bạn có chắc chắn muốn xóa?");
      if (check) {
        e.preventDefault();
        const studentId = button.getAttribute("data-student-id");
        const classRoomId = button.getAttribute("data-class-id");
        const type = button.getAttribute("type");
        fetch(`http://localhost:3000/admin/${type}/remove/${classRoomId}/${studentId}`, {
          method: "DELETE",
          "headers": {
            "Content-Type": "application/json"
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.code == 200)
              location.reload();
          })
      }
    })
  }
}
//End romove student