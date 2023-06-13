var canvas = document.getElementById("notepad");
var create_postit_button = document.getElementById("create-post-it");
var edit_postit_button = document.getElementById("edit-post-it");
var draw_button = document.getElementById("draw");
var clear_button = document.getElementById("clear");
var quit_editing_menu_button = document.getElementById("quit-menu");

// console.log(canvas);
var ctx = canvas.getContext("2d");
var mouse_held_down = false;
var notepad_id = parseInt(document.getElementById("notepad_id").innerHTML);

process_data(notepad_id);
// console.log(notepad_id);

var resize = () => {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  ctx.fillStyle = "rgba(95,154,128,1)";
  ctx.fillRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
  process_data(notepad_id);
}

resize();

window.addEventListener("resize", () => {
  resize();
})

var mode = "create-post-it";
var last_coords = [0, 0];
var draw_path = [];
var items_placed = [];

var create_postit = function(e) {
  let coords = get_mouse_pos(e);
  text = "";
  create_postit_with_coords(coords[0] - 100, coords[1] - 100, text);
  send_data(notepad_id, 0, "postit", text, coords[0] - 100, coords[1] - 100);
  open_menu(items_placed.length - 1);
}

var create_postit_with_coords = (x, y, text) => {
  ctx.fillStyle = "rgb(255, 255, 153)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 10;
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.fillRect(x, y, 200, 200);
  ctx.shadowColor = "rgba(0,0,0,0)";
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.font = "20px monospace";
  place_text(text, x, y);
  items_placed.push(["post-it", text, x, y]);
}

function create_item(item) {
  if (item[2] == "postit") {
    create_postit_with_coords(item[4], item[5], item[3]);
    return true;
  } else if (item[2] == "stroke") {
  	draw_2(item[3]);
		return true;
  }
  console.log("Error: An instance of " + item[2] + " was not placed");
  return false;
}

var edit_postit = (e) => {
  let coords = get_mouse_pos(e);
  for (var i = items_placed.length - 1; i >= 0; i--) {
    if (items_placed[i][0] == "post-it") {
      if (Math.abs(coords[0] - items_placed[i][2] - 100) <= 100 && Math.abs(coords[1] - items_placed[i][3] - 100) <= 100) {
        open_menu(i);
        return 69;
      }
    }
  }
}

var open_menu = (index) => {
	document.getElementById("edit-menu").style.display = "block";
	document.getElementById("post-it-edit-menu").innerHTML = "<h1>"+items_placed[index][1].substring(0,135)+"</h1>";
  let display_html = '<h1>' +
    '<form onsubmit="edit_postit_text(' + index + ')" method="POST">' +
    '<textarea id="new_text" type="text" maxlength=135 placeholder="Insert text here...">' + items_placed[index][1].substring(0, 135) + '</textarea>' +
    '<input type="submit" value="Confirm Changes">' +
    '</form>' +
    '</h1>';
  document.getElementById("post-it-edit-menu").style.display = "block";
  document.getElementById("post-it-edit-menu").innerHTML = display_html;
}

function edit_postit_text(index) {
  let new_text = document.getElementById('new_text').value;
  let x = items_placed[index][2];
  let y = items_placed[index][3];
  // delete old postit here
  // create_postit_with_coords(new_text, x, y);
  send_data(notepad_id, 0, "postit", new_text, x, y);
}

var close_menu = () => {
	document.getElementById("edit-menu").style.display = "none";
}

var place_text = function(text, x, y) {
  for (var i = 0; i < text.length / 15 && i < 9; i++) {
    ctx.fillText(text.substring(15 * i, 15 * i + 15), x + 7, y + 20 * (i + 1));
  }
}

var draw = (e) => {
  if (mode == "draw" && mouse_held_down) {
    let coords = get_mouse_pos(e);
    ctx.strokeStyle = "rgb(255,255,255)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(last_coords[0], last_coords[1]);
    ctx.lineTo(coords[0], coords[1]);
    ctx.stroke();
    ctx.closePath();
  }
}

var draw_2 = (path) => {
  const pairs = path.split(";");
  var path_list = [];
  for (item of pairs) {
    path_list.push(item.split(","));
  }
  ctx.strokeStyle = "rgb(255,255,255)";
  ctx.lineWidth = 10;
  ctx.moveTo(path_list[0][0], path_list[0][1]);
  ctx.beginPath();
  for (var i = 0; i < path_list.length; i++) {
    ctx.lineTo(path_list[i][0], path_list[i][1]);
  }
  ctx.stroke();
  ctx.closePath();
}

function get_mouse_pos(e) {
  var rect_pos = canvas.getBoundingClientRect();
  x_pos = e.clientX - rect_pos.left;
  y_pos = e.clientY - rect_pos.top;
  return [x_pos, y_pos];
}

var create_post_it_mode = function(e) {
  mode = "create-post-it";
}

var edit_post_it_mode = function(e) {
  mode = "edit-post-it";
}

var draw_mode = function(e) {
  mode = "draw";
}

var mouse_down = function(e) {
  mouse_held_down = true;
  if (mode == "draw") {
    draw_path = [];
    draw_path.push(get_mouse_pos(e));
  }
}

var mouse_up = function(e) {
  mouse_held_down = false;
  if (mode == "draw") {
    items_placed.push(["stroke", stringify_path(draw_path), draw_path[0][0], draw_path[0][1]]);
    send_data(notepad_id, 0, "stroke", stringify_path(draw_path), draw_path[0][0], draw_path[0][1]);
  }
  draw_path = [];
}

var clicked = (e) => {
  if (mode == "create-post-it") {
    create_postit(e);
  } else if (mode == "edit-post-it") {
    edit_postit(e);
  }
}

var stringify_path = (path) => {
  var ans = "";
  for (var i = 0; i < path.length; i++) {
    for (var j = 0; j < path[i].length; j++) {
      ans += path[i][j];
      if (j == 0) ans += ",";
    }
    if (i < path.length - 1) ans += ";";
  }
  return ans;
}

var update_last_coords = function(e) {
  last_coords = get_mouse_pos(e);
  if (mode =='draw' && mouse_held_down) {
    draw_path.push(get_mouse_pos(e));
  }
}

var add_change_name_area = function() {
  let area = document.getElementById('change_name_area');
  area.innerHTML = '<div class="form-group d-flex justify-content-center">' +
    '<input type="text" class="form-control" name="change_name" placeholder="Enter name" style="width:30rem">' +
    '<button type="submit" class="btn" value="submit"> Submit </button>' +
    '</div>';
}

let change_name_area_activator = document.getElementById("activate_change_name");
change_name_area_activator.addEventListener("click", add_change_name_area);

var remove_delete_popup = function () {
  let popup = document.getElementById('delete_popup');
  popup.innerHTML = "";
}

var add_delete_popup = function () {
  let popup = document.getElementById('delete_popup');
  popup.innerHTML = '<div class="card" id="delete_popup" style="width:30rem">' +
    '<div class="card-header">' +
      'Delete Notepad' +
    '</div>' +
    '<div class="card-body">' +
      '<p class="card-text">Do you want to delete this notepad?</p>' +
      '<div class="d-flex justify-content-center">' +
      '<form action="/delete" method="POST">'+
        '<input type="hidden" name="selected" value='+notepad_id+'>'+
        '<button type="submit" class="btn mr-3" value="submit"> Yes </button>'+
      '</form>'+
      '<button id = "close_delete_popup" class="btn"> No </button>'+
    '</div>'+
    '</div>'+
  '</div>';
  let close_button = document.getElementById('close_delete_popup');
  close_button.addEventListener("click", remove_delete_popup);
}

let delete_button = document.getElementById("delete_button_popup");
delete_button.addEventListener("click", add_delete_popup);

canvas.addEventListener("click", clicked);
canvas.addEventListener("mousedown", mouse_down);
canvas.addEventListener("mouseup", mouse_up);
canvas.addEventListener("mouseout", mouse_up);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousemove", update_last_coords);
create_postit_button.addEventListener("click", create_post_it_mode);
edit_postit_button.addEventListener("click", edit_post_it_mode);
draw_button.addEventListener("click", draw_mode);
// clear_button.addEventListener("click", clear);
quit_editing_menu_button.addEventListener("click", close_menu)
