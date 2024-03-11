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

//Button remove student 
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
//End button romove student

//Button edit student
const listButtonEdit = document.querySelectorAll("[button-edit]");
if (listButtonEdit) {
  for (const button of listButtonEdit) {
    button.addEventListener("click", (e) => {
      const check = confirm("Bạn có chắc chắn muốn sửa?");
      if (check) {
        e.preventDefault();
        const studentId = button.getAttribute("data-student-id");
        const classRoomId = button.getAttribute("data-class-id");
        const type = button.getAttribute("type");
        const listInputPointProcess = document.querySelectorAll("[point-process]");
        console.log(listInputPointProcess);
        let inputPointProcess;
        listInputPointProcess.forEach(button => {
          if (button.getAttribute("student-id") == studentId)
            inputPointProcess = button
        })
        const listInputPointTest = document.querySelectorAll("[point-test]");
        let inputPointTest;
        listInputPointTest.forEach(button => {
          if (button.getAttribute("student-id") == studentId)
            inputPointTest = button
        })
        const dataSendServer = {
          pointProcess: inputPointProcess.value,
          pointTest: inputPointTest.value
        }

        fetch(`http://localhost:3000/admin/${type}/edit/${classRoomId}/${studentId}`, {
          method: "PATCH",
          "headers": {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataSendServer)
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
//End button edit student

//Table schedule
const tableSchedule = document.querySelector("[name-table]");
if (tableSchedule) {
  tableSchedule.addEventListener("click", (e) => {
    const dataCells = tableSchedule.querySelectorAll("[row]");
    for (const item of dataCells) {
      item.addEventListener("click", e => {
        const value = item.getAttribute("value");
        console.log(value);
      })
    }
  })
}

//End table schedule
