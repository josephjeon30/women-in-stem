var canvas = document.getElementById("notepad");
// console.log(canvas);
var ctx = canvas.getContext("2d");

var create_postit = function(e) {
  let coords = get_mouse_pos(e);
  console.log(coords);
};

function get_mouse_pos (e) {
  var rect_pos = canvas.getBoundingClientRect();
  x_pos = e.clientX;
  y_pos = e.clientY;
  // console.log(x_pos, y_pos);
  return [x_pos, y_pos];
}

canvas.addEventListener("click", create_postit);
