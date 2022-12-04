const { updatePaths } = require("../../api/path/path")


exports.updatePaths = async (req, res) => {
  let paths = await updatePaths();
  if(paths === undefined){
    res.send("up-to-date");
  }else{
    res.send("updated");
  }
}