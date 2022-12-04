

module.exports.fromDanger = (danger) => {
  switch(danger){
    case 0:
      return "";
    case 1:
      return "#ed6c02";//from mui chip warning
    case 2:
      return "#D32F2F";//from mui error
  }
}

module.exports.stateFromDanger = (danger) => {
  switch(danger){
    case 0:
      return "default";
    case 1:
      return "warning";
    case 2:
      return "error";
  }
}