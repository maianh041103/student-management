const Department = require('../../models/department.model');
const Course = require('../../models/course.model');
const ClassManagement = require('../../models/classManagement.model');
const ClassRoom = require('../../models/classRoom.model');
const Teacher = require('../../models/teacher.model');
const Student = require('../../models/student.model');
const GenerateAccount = require('../../models/generate-account.model');
const Account = require('../../models/account.model');

//[GET] /admin/
module.exports.index = async (req, res) => {
  const departmentActive = await Department.countDocuments({
    deleted: false,
    status: "active"
  });
  const departmentInactive = await Department.countDocuments({
    deleted: false,
    status: "inactive"
  });

  const courseActive = await Course.countDocuments({
    deleted: false,
    status: "active"
  });
  const courseInactive = await Course.countDocuments({
    deleted: false,
    status: "inactive"
  });

  const classManagementActive = await ClassManagement.countDocuments({
    deleted: false,
    status: "active"
  });
  const classManagementCancel = await ClassManagement.countDocuments({
    deleted: false,
    status: "cancel"
  });
  const classManagementComplete = await ClassManagement.countDocuments({
    deleted: false,
    status: "complete"
  });

  const classRoomActive = await ClassRoom.countDocuments({
    deleted: false,
    status: "active"
  });
  const classRoomCancel = await ClassRoom.countDocuments({
    deleted: false,
    status: "cancel"
  });
  const classRoomComplete = await ClassRoom.countDocuments({
    deleted: false,
    status: "complete"
  });

  const teacherActive = await Teacher.countDocuments({
    deleted: false,
    status: "active"
  })
  const teacherInactive = await Teacher.countDocuments({
    deleted: false,
    status: "inactive"
  })

  const studentActive = await Student.countDocuments({
    deleted: false,
    status: "active"
  });
  const studentInactive = await Student.countDocuments({
    deleted: false,
    status: "inactive"
  });
  const studentComplete = await Student.countDocuments({
    deleted: false,
    status: "complete"
  });

  const accountStudentActive = await GenerateAccount.countDocuments({
    deleted: false,
    status: "active",
    type: "student"
  });
  const accountStudentInactive = await GenerateAccount.countDocuments({
    deleted: false,
    status: "inactive",
    type: "student"
  });

  const accountTeacherActive = await GenerateAccount.countDocuments({
    deleted: false,
    status: "active",
    type: "teacher"
  });
  const accountTeacherInactive = await GenerateAccount.countDocuments({
    deleted: false,
    status: "inactive",
    type: "teacher"
  });

  const accountAdminActive = await Account.countDocuments({
    deleted: false,
    status: "active"
  });
  const accountAdminInactive = await Account.countDocuments({
    deleted: false,
    status: "inactive"
  });

  const data = {
    departmentActive: departmentActive,
    departmentInactive: departmentInactive,
    courseActive: courseActive,
    courseInactive: courseInactive,
    classManagementActive: classManagementActive,
    classManagementCancel: classManagementCancel,
    classManagementComplete: classManagementComplete,
    classRoomActive: classRoomActive,
    classRoomCancel: classRoomCancel,
    classRoomComplete: classRoomComplete,
    teacherActive: teacherActive,
    teacherInactive: teacherInactive,
    studentActive: studentActive,
    studentInactive: studentInactive,
    studentComplete: studentComplete,
    accountTeacherActive: accountTeacherActive,
    accountTeacherInactive: accountTeacherInactive,
    accountStudentActive: accountStudentActive,
    accountStudentInactive: accountStudentInactive,
    accountAdminActive: accountAdminActive,
    accountAdminInactive: accountAdminInactive
  }

  res.render("admin/pages/dashboard/index.pug", {
    pageTitle: "Trang tổng quan",
    data: data
  })
}