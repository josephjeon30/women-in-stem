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
  text = String(Math.random()) + String(Math.random()) + String(Math.random()) + String(Math.random()) + String(Math.random()) + String(Math.random()) + String(Math.random()) + String(Math.random());
  create_postit_with_coords(coords[0] - 100, coords[1] - 100, text);
  send_data(notepad_id, 0, "postit", text, coords[0] - 100, coords[1] - 100);
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
}

var close_menu = () => {
	document.getElementById("edit-menu").style.display = "none";
  let display_html = '<h1>' +
    '<form onsubmit="edit_postit_text(' + index + ')" method="POST">' +
    '<input id="new_text" type="text" value=' + items_placed[index][1].substring(0, 135) + ' maxlength=135>' +
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

var place_text = function(text, x, y) {
  for (var i = 0; i < text.length / 15 && i < 9; i++) {
    ctx.fillText(text.substring(15 * i, 15 * i + 15), x + 7, y + 20 * (i + 1));
  }
}

var draw = (e) => {
  if (mode == "draw" && mouse_held_down) {
    let coords = get_mouse_pos(e);
// 		place_draw(coords[0], coords[1]);
// 	}
//
// function place_draw (x, y) {
    ctx.strokeStyle = "rgb(255,255,255)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(last_coords[0], last_coords[1]);
    ctx.lineTo(coords[0], coords[1]);
    ctx.stroke();
    ctx.closePath();
    //save data
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

var clear = function(e) {
  ctx.fillStyle = "rgba(95,154,128,1)";
  ctx.fillRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
  ctx.fillStyle = "rgb(0,0,0)";
	// deletes from database!!
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
    console.log(items_placed[items_placed.length - 1])
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
  if (mode == "draw") {
    draw_path.push(get_mouse_pos(e));
  }
}

// draw_2("144,2920.5;144,2920.5;144,2920.5;144,2918.5;144,2914.5;144,2912.5;144,2911.5;144,2909.5;144,2905.5;144,2901.5;145,2899.5;147,2897.5;148,2895.5;151,2890.5;152,2888.5;154,2886.5;156,2884.5;157,2881.5;159,2878.5;160,2875.5;163,2870.5;166,2865.5;170,2860.5;175,2852.5;186,2842.5;198,2828.5;213,2818.5;228,2803.5;245,2790.5;261,2777.5;266,2775.5;279,2764.5;287,2758.5;294,2753.5;298,2749.5;302,2746.5;304,2745.5;306,2744.5;308,2743.5;309,2743.5;311,2743.5;313,2743.5;316,2743.5;320,2743.5;323,2743.5;326,2743.5;329,2743.5;333,2743.5;337,2744.5;341,2746.5;344,2747.5;347,2748.5;352,2750.5;355,2752.5;360,2755.5;366,2758.5;369,2761.5;373,2763.5;378,2768.5;381,2772.5;385,2776.5;387,2778.5;390,2782.5;393,2784.5;394,2787.5;396,2789.5;397,2793.5;399,2796.5;402,2803.5;403,2809.5;404,2816.5;406,2822.5;406,2827.5;406,2834.5;406,2843.5;406,2849.5;406,2856.5;406,2862.5;406,2867.5;406,2878.5;406,2885.5;405,2892.5;404,2900.5;403,2909.5;401,2920.5;401,2924.5;401,2932.5;399,2941.5;399,2950.5;399,2956.5;399,2963.5;399,2970.5;399,2974.5;399,2981.5;399,2986.5;399,2992.5;399,2997.5;399,3002.5;399,3007.5;401,3010.5;404,3014.5;407,3018.5;409,3020.5;413,3024.5;417,3027.5;421,3030.5;425,3033.5;428,3035.5;433,3038.5;440,3042.5;445,3044.5;451,3046.5;460,3048.5;469,3049.5;477,3051.5;481,3051.5;487,3051.5;494,3051.5;499,3051.5;502,3051.5;507,3051.5;513,3051.5;517,3051.5;521,3048.5;526,3045.5;529,3042.5;538,3035.5;540,3034.5;546,3030.5;551,3027.5;556,3022.5;564,3014.5;568,3010.5;573,3005.5;577,2999.5;582,2992.5;585,2988.5;588,2983.5;593,2975.5;596,2971.5;599,2966.5;601,2961.5;604,2956.5;607,2953.5;609,2949.5;610,2946.5;612,2944.5;612,2942.5;614,2940.5;614,2938.5;615,2936.5;616,2934.5;616,2933.5;616,2931.5;616,2930.5;616,2930.5;616,2929.5;616,2929.5;616,2928.5;616,2928.5")

canvas.addEventListener("click", clicked);
canvas.addEventListener("mousedown", mouse_down);
canvas.addEventListener("mouseup", mouse_up);
canvas.addEventListener("mouseout", mouse_up);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousemove", update_last_coords);
create_postit_button.addEventListener("click", create_post_it_mode);
edit_postit_button.addEventListener("click", edit_post_it_mode);
draw_button.addEventListener("click", draw_mode);
clear_button.addEventListener("click", clear);
quit_editing_menu_button.addEventListener("click", close_menu)
