module.exports.index = async (req, res) => {
  res.render("admin/pages/department/index.pug", {
    pageTitle: "Khoa"
  })
}