var canvas = document.getElementById("notepad");
// console.log(canvas);
var ctx = canvas.getContext("2d");
ctx.fillStyle = "rgb(255,0,0)";
ctx.fillRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);

var create_postit = function(e) {
  let coords = get_mouse_pos(e);
  console.log(coords);
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(coords[0], coords[1], 200, 200);
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.font = "20px webdings"
  ctx.fillText("lkajflkdsjlk", coords[0], coords[1]);
  send_data("dhfk"); //Will be relavent data that gives information about postit
};

// var create_drawing = function(e) {
//   // text[0:15]
//   // To be figured out later
// }

function get_mouse_pos (e) {
  var rect_pos = canvas.getBoundingClientRect();
  x_pos = e.clientX - rect_pos.left;
  y_pos = e.clientY - rect_pos.top;
  return [x_pos, y_pos];
}

canvas.addEventListener("click", create_postit);
