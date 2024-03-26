//Chọn khoa và học kỳ
const selectDepartmentId = document.querySelector("[departmentId]");
const semester = document.querySelector("[semester]");
let selectedDepartmentValue = ""
let selectedSemesterValue = "";

if (selectDepartmentId) {
  selectDepartmentId.addEventListener("change", (e) => {
    selectedDepartmentValue = selectDepartmentId.value;
    callApi();
  })
}

if (semester) {
  semester.addEventListener("change", (e) => {
    selectedSemesterValue = semester.value;
    callApi();
  })
}


function callApi() {
  if (selectedDepartmentValue != "" && selectedSemesterValue != "") {
    console.log("OK");
    fetch(`${URLBACKEND}/admin/programFrame/create/getData?departmentId=${selectedDepartmentValue}&semester=${selectedSemesterValue}`, {
      method: "GET",
      "headers": {
        "Content-Type": "application/json"
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == 200) {
          const div = document.querySelector("[divCourse]");
          if (div) {
            if (data.status == "exists") {
              div.innerHTML = "";
              for (const course of data.listCourse) {
                div.innerHTML += `
                  <tr>
                    <td class="text-center">
                      <input type="checkbox" name="id_course" value=${course._id} ${data.listCourseSelected.includes(course._id) == true ? "checked" : ""}>
                    </td> ${course.name}
                  </tr>
                `
              }
            } else {
              div.innerHTML = "";
              for (const course of data.listCourse) {
                if (!data.listCourseSelected.includes(course._id)) {
                  div.innerHTML += `
                  <tr>
                    <td class="text-center">
                      <input type="checkbox" name="id_course" value=${course._id} ${data.listCourseSelected.includes(course._id) == true ? "checked" : ""}>
                    </td> ${course.name}
                  </tr>
                `
                }
              }
            }
          }
        }
      })
  }
}
