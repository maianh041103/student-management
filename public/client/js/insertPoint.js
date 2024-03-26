// Chọn năm và kỳ học
const currentUrl = window.location.href;
const urlSearchParams = new URLSearchParams(new URL(currentUrl).searchParams);
let year = urlSearchParams.get("year") || "";
let semester = urlSearchParams.get("semester") || "";

const inputSemester = document.querySelector("[name='semester']");
const inputYear = document.querySelector("[name='year']");

if (inputYear && inputSemester) {
  inputYear.addEventListener("change", e => {
    year = inputYear.value;
    submitForm();
  })

  inputSemester.addEventListener("change", e => {
    semester = inputSemester.value;
    submitForm();
  })
}

function submitForm() {
  if (year != "" && semester != "") {
    const formDataInsertPoint = document.querySelector("[form-data-insertPoint]");
    if (formDataInsertPoint) {
      formDataInsertPoint.submit();
    }
  }
}
//End chọn năm và kỳ học

//Khóa lớp học phần
const buttonLock = document.querySelector("[button-lock]");
if (buttonLock) {
  buttonLock.addEventListener("click", e => {
    const isConfirm = confirm("Bạn có chắc chắn muốn khóa lớp học phần");
    if (isConfirm) {
      const classRoomId = buttonLock.getAttribute("class-id");
      const year = buttonLock.getAttribute("year");
      const semester = buttonLock.getAttribute("semester");

      fetch(`${URLBACKEND}/insertPoint/lock/${classRoomId}?year=${year}&semester=${semester}`, {
        method: "PATCH",
        "headers": {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.href = `${URLBACKEND}/insertPoint?year=${year}&semester=${semester}`
            alert("Khóa lớp học phần thành công");
          }
          else {
            alert("Không thể khóa lớp học phần khi chưa nhập hết điểm cho sinh viên");
          }
        })
    }
  })
}
//End khóa lớp học phần