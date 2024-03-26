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
    const formDataSchedule = document.querySelector("[form-data-schedule]");
    if (formDataSchedule) {
      formDataSchedule.submit();
    }
  }
}
//End chọn năm và kỳ học

//Lấy dữ liệu form xếp môn học
const tableScheduleEdit = document.querySelector("[table-schedule-edit]");
if (tableScheduleEdit) {
  const buttonEditSchedule = document.querySelector("[button-edit-schedule]");
  buttonEditSchedule.addEventListener("click", e => {
    e.preventDefault();
    const listSelected = tableScheduleEdit.querySelectorAll("[name='schedule']");
    const result = [];
    listSelected.forEach(item => {
      if (item.value != "") {
        const time = item.getAttribute("row");
        const date = item.getAttribute("col");
        const schedule = {
          time: time, // ca học : 1 2 3
          date: date, //thứ 2 3 4
          classRoomId: item.value
        }
        result.push(schedule);
      }
    })

    const classManagementId = tableScheduleEdit.getAttribute("class-management-id");
    const year = tableScheduleEdit.getAttribute("year");
    const semester = tableScheduleEdit.getAttribute("semester");
    fetch(`${URLBACKEND}/admin/schedule/edit/${classManagementId}?year=${year}&semester=${semester}`, {
      method: "PATCH",
      "headers": {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(result)
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == 200) {
          alert("Thay đổi thời khóa biểu thành công");
        }
      })
  })
}
//End lấy dữ liệu form xếp môn học
