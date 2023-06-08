var canvas = document.getElementById("notepad");
var postit_button = document.getElementById("post-it");
var draw_button = document.getElementById("draw");
var clear_button = document.getElementById("clear");

// console.log(canvas);
var ctx = canvas.getContext("2d");
var mouse_held_down = false;

var resize = () => {
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	ctx.fillStyle = "rgba(95,154,128,1)";
	ctx.fillRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
}

resize();
window.addEventListener("resize", () => {
	resize();
})

var mode = "post-it";
var last_coords = [0,0];

var create_postit = function(e) {
	if (mode == "post-it"){
		let coords = get_mouse_pos(e);
		console.log(coords);
		ctx.fillStyle = "rgb(255, 255, 153)";
		ctx.shadowBlur = 10;
		ctx.shadowOffsetY = 10;
		ctx.shadowColor = "rgba(0,0,0,0.5)";
		ctx.fillRect(coords[0], coords[1], 200, 200);
		ctx.shadowColor = "rgba(0,0,0,0)";
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.font = "20px monospace";
		let text = "daopifha;oifuoahlgifhafihafhihekjfgfgiwfgisgiwahuiuiwdaopifha;oifuoahlgifhafihafhihekjfgfgiwfgisgiwahuiuiwdaopifha;oifuoahlgifhafihafhihekjfgfgiwfgisgiwahuiuiwdaopifha;oifuoahlgifhafihafhihekjfgfgiwfgisgiwahuiuiwdaopifha;oifuoahlgifhafihafhihekjfgfgiwfgisgiwahuiuiwdaopifha;oifuoahlgifhafihafhihekjfgfgiwfgisgiwahuiuiw";
		// process_data();
		place_text(text, coords[0], coords[1]);
		// send_data("notepad_id, user_id," postit, text, coords[0], coords[1]);
		send_data(0, 0, "postit", text, coords[0], coords[1]);
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
		ctx.strokeStyle = "rgb(255,255,255)";
		ctx.lineWidth = 10;
		ctx.beginPath();
		ctx.moveTo(last_coords[0], last_coords[1]);
		ctx.lineTo(coords[0], coords[1])
		ctx.stroke();
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
