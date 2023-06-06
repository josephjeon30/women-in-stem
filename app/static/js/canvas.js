var canvas = document.getElementById("notepad");
var postit_button = document.getElementById("post-it");
var draw_button = document.getElementById("draw");
var clear_button = document.getElementById("clear");

// console.log(canvas);
var ctx = canvas.getContext("2d");
ctx.fillStyle = "rgb(255,0,0)";
ctx.fillRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
var mouse_held_down = false;

var mode = "post-it";
var last_coords = [0,0]

var create_postit = function(e) {
	if (mode == "post-it"){
		let coords = get_mouse_pos(e);
		console.log(coords);
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillRect(coords[0], coords[1], 200, 200);
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.font = "20px monospace"; 
		place_text("daopifha;oifuoahlgifhafihafhihekjfgfgiwfgisgiwahuiuiwdaopifha;oifuoahlgifhafihafhihekjfgfgiwfgisgiwahuiuiwdaopifha;oifuoahlgifhafihafhihekjfgfgiwfgisgiwahuiuiwdaopifha;oifuoahlgifhafihafhihekjfgfgiwfgisgiwahuiuiwdaopifha;oifuoahlgifhafihafhihekjfgfgiwfgisgiwahuiuiwdaopifha;oifuoahlgifhafihafhihekjfgfgiwfgisgiwahuiuiw", coords[0], coords[1]);
		send_data("dhfk"); //Will be relavent data that gives information about postit
		//save data
	}
};

var place_text = function(text, x, y) {
	for (var i = 0; i < text.length / 15 && i < 9; i++){
		ctx.fillText(text.substring(15 * i,15*i +15), x+7, y + 20 *(i+1));
	}
}


var draw = function(e) {
	if (mode == "draw" && mouse_held_down){
		let coords = get_mouse_pos(e);
		console.log(coords);
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.beginPath();
		ctx.arc(coords[0], coords[1], 10, 0, Math.PI*2, true);
		ctx.fill();
		ctx.closePath();
		//save data
	}
}

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

var post_it_mode = function(e){
	mode = "post-it";
}

var draw_mode = function(e){
	mode = "draw";
}

var clear = function(e){
	ctx.fillStyle = "rgb(255,0,0)";
	ctx.fillRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
	ctx.fillStyle = "rgb(0,0,0)";
}

var mouse_down = function(e){
	mouse_held_down = true;
}

var mouse_up = function(e){
	mouse_held_down = false;
}

var update_last_coords = function(e){
	last_coords = get_mouse_pos(e)
}

canvas.addEventListener("click", create_postit);
canvas.addEventListener("mousedown", mouse_down);
canvas.addEventListener("mouseup", mouse_up);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousemove", update_last_coords);
postit_button.addEventListener("click", post_it_mode);
draw_button.addEventListener("click", draw_mode);
clear_button.addEventListener("click", clear);