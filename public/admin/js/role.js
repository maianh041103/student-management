const tablePermission = document.querySelector("[table-permissions]");
if (tablePermission) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", e => {
    e.preventDefault();
    //Lấy id
    let result = [];
    const rowDataId = tablePermission.querySelector("[data-name='id']");
    const inputDataId = rowDataId.querySelectorAll("input[type='text']");
    inputDataId.forEach(input => {
      result.push({
        "role_id": input.value,
        permissions: []
      })
    })
    //End lấy id

    const listDataName = tablePermission.querySelectorAll("[data-name]");
    for (const row of listDataName) {
      const listInputChecked = row.querySelectorAll("input[type='checkbox']");
      const permission = row.getAttribute("data-name");
      for (let i = 0; i < listInputChecked.length; i++) {
        if (listInputChecked[i].checked == true) {
          result[i].permissions.push(permission);
        }
      }
    }

    fetch(`http://localhost:3000/admin/role/permissions`, {
      method: "PATCH",
      "headers": {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(result)
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == 200) {
          alert("Cập nhật phân quyền thành công");
        } else {
          alert("Cập nhật phân quyền thất bại");
        }
      })
  })
}

//Check checked
const dataPermission = document.querySelector("[data-permission]");
if (dataPermission) {
  let roles = JSON.parse(dataPermission.getAttribute("data-permission"));
  for (let i = 0; i < roles.length; i++) {
    for (const permission of roles[i].permissions) {
      const row = document.querySelector(`[data-name=${permission}]`);
      const inputs = row.querySelectorAll("input[type='checkbox']");
      inputs[i].checked = true;
    }
  }
}
//End check checked