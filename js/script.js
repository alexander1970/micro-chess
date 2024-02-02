let map = Array();
let inf = Array();

let move_color = "white";
let move_from_x;
let move_from_y;

function  init_map() {
  map =
  [// y0,  y1,  y2,  y3,  y4,  y5,  y6,  y7
    ["R", "P", " ", " ", " ", " ", "p", "r"], // x0
    ["N", "P", " ", " ", " ", " ", "p", "n"], // x1
    ["B", "P", " ", " ", " ", " ", "p", "b"], // x2
    ["Q", "P", " ", " ", " ", " ", "p", "q"], // x3
    ["K", "P", " ", " ", " ", " ", "p", "k"], // x4
    ["B", "P", " ", " ", " ", " ", "p", "b"], // x5
    ["N", "P", " ", " ", " ", " ", "p", "n"], // x6
    ["R", "P", " ", " ", " ", " ", "p", "r"]  // x7
  ];
}

function init_inf() {
  inf =
  [
    [" ", " ", " ", " ", " ", " ", " ", " ",],
    [" ", " ", " ", " ", " ", " ", " ", " ",],
    [" ", " ", " ", " ", " ", " ", " ", " ",],
    [" ", " ", " ", " ", " ", " ", " ", " ",],
    [" ", " ", " ", " ", " ", " ", " ", " ",],
    [" ", " ", " ", " ", " ", " ", " ", " ",],
    [" ", " ", " ", " ", " ", " ", " ", " ",],
    [" ", " ", " ", " ", " ", " ", " ", " ",]
  ];
}

function mark_moves_from() {
  init_inf();
  for (let x = 0; x <= 7; x++)
    for (let y = 0; y <= 7; y++)
      if (can_move_from(x, y))
        inf[x][y] = 1;
}

function mark_moves_to(){
  init_inf();
  for (let x = 0; x <= 7; x++)
    for (let y = 0; y <= 7; y++)
      if (can_move_to(x, y))
        inf[x][y] = 2;
}

function can_move_from(x, y) {
  return get_color(x, y) == move_color;
}

function can_move_to(x, y) {
  if (map[x][y] == " ")
    return true;
  return get_color(x, y) !== move_color; // съесть фигуру противника
}

function get_color(x, y) {
  let figure = map[x][y];
  if (figure == " ")
    return " ";
  return (figure.toUpperCase() == figure) ? "white" : "black";
}

function click_box(x, y){
  if (inf[x][y] == "1")
    click_box_from(x, y);
  else if (inf[x][y] == "2")
    click_box_to(x, y);
}

function click_box_from(x, y){
  move_from_x = x;
  move_from_y = y;
  mark_moves_to();
  show_map();
}

function click_box_to(x, y){
  map[x][y] = map[move_from_x][move_from_y];
  map[move_from_x][move_from_y] = " ";
  turn_move();
  mark_moves_from();
  show_map();
}

function turn_move(){
  move_color = move_color == "white" ? "black" : "white";
}

function figure_to_html(figure) {
  switch (figure) {
    case "K": return "&#9812;"; case "k": return "&#9818;";
    case "Q": return "&#9813;"; case "q": return "&#9819;";
    case "R": return "&#9814;"; case "r": return "&#9820;";
    case "B": return "&#9815;"; case "b": return "&#9821;";
    case "N": return "&#9816;"; case "n": return "&#9822;";
    case "P": return "&#9817;"; case "p": return "&#9823;";
    default: return "&nbsp";
  }
}

function show_map() {
  let html = "<table border='1'cellpadding='2' cellspacing='0'>";
  let x1 = ["a", "b", "c", "d", "e", "f", "g", "h"];
  let color;
  for (let y = 7; y >= 0; y--) {
    html += "<tr>";
    let y1 = y + 1;
    html += "<td>" + y1 + "</td>"
    for (let x = 0; x <= 7; x++) {
      if (inf[x][y] == " ")
        color = (x + y) % 2 ? "#eeffee" : "#abcdef";
      else
        color = inf[x][y] == "1" ? "#aaffaa" : "#ffaaaa";
      html += "<td style='width: 50px; height: 50px; " +
                          "background-color: " + color + "; " +
                          "text-align: center; " +
                          "font-size: 40px; " +
                          "color: #000; " +
                          "' onclick='click_box(" + x + ", " + y + ");'>";
      html += figure_to_html(map[x][y]);
      html += "</td>";
    }
    html += "</tr>";
  }
  html += "<tr>";
  html += "<td>&nbsp</td>";
  for (let x = 0; x <= 7; x++)
    html += "<td style='text-align: center'>" + x1[x] + "</td>"
  html += "</table>";
  document.getElementById("chess").innerHTML = html;
}

function start(){
  init_map();
  mark_moves_from();
  show_map();
}

start();
