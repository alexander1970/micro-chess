let map = Array();
let inf = Array();

let move_color = "white";
let move_from_x;
let move_from_y;

function  init_map() {    // массив позиции
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

function init_inf() { // куда можно хидить
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

function can_move(sx, sy, dx, dy){
  if (!can_move_from(sx, sy))
    return false;
  if (!can_move_to(dx, dy))
    return false;
  return is_correct_move(sx, sy, dx, dy);
}

function is_correct_move(sx, sy, dx, dy) {
  let figure = map[sx][sy];
  if (is_king(figure))
    return is_correct_king_move(sx, sy, dx, dy);
  if (is_queen(figure))
    return is_correct_queen_move(sx, sy, dx, dy);
  if (is_bishop(figure))
    return is_correct_bishop_move(sx, sy, dx, dy);
  if (is_knight(figure))
    return is_correct_knight_move(sx, sy, dx, dy);
  if (is_rook(figure))
    return is_correct_rook_move(sx, sy, dx, dy);
  if (is_pawn(figure))
    return is_correct_pawn_move(sx, sy, dx, dy);
  return true;
}

function is_king  (figure) { return figure.toUpperCase() == "K"; }
function is_queen (figure) { return figure.toUpperCase() == "Q"; }
function is_bishop(figure) { return figure.toUpperCase() == "B"; }
function is_knight(figure) { return figure.toUpperCase() == "N"; }
function is_rook  (figure) { return figure.toUpperCase() == "R"; }
function is_pawn  (figure) { return figure.toUpperCase() == "P"; }

function is_correct_king_move(sx, sy, dx, dy) {
  return (Math.abs(dx - sx) <= 1 && Math.abs(dy - sy) <= 1);
}

function is_correct_line_move(sx, sy, dx, dy, figure) {
  let delta_x = Math.sign(dx - sx);
  let delta_y = Math.sign(dy - sy);

  if (!is_correct_line_delta(delta_x, delta_y, figure)) return false;
  do {
    sx += delta_x;
    sy += delta_y;
    if (sx == dx && sy == dy) return true;
  } while (is_empty(sx, sy));
  return false;
}

function is_correct_line_delta(delta_x, delta_y, figure) {
  if (is_rook(figure)) return is_correct_rook_delta(delta_x, delta_y);
  if (is_bishop(figure)) return is_correct_bishop_delta(delta_x, delta_y);
  if (is_queen(figure)) return is_correct_queen_delta(delta_x, delta_y);
  return false;
}

function is_correct_rook_delta(delta_x, delta_y) {
  return Math.abs(delta_x) + Math.abs(delta_y) == 1;
}

function is_correct_bishop_delta(delta_x, delta_y) {
  return Math.abs(delta_x) + Math.abs(delta_y) == 2;
}

function is_correct_queen_delta(delta_x, delta_y) {
  return true;
}

function is_correct_queen_move(sx, sy, dx, dy) {
  return is_correct_line_move(sx, sy, dx, dy, "Q");
}

function is_correct_bishop_move(sx, sy, dx, dy) {
  return is_correct_line_move(sx, sy, dx, dy, "B");
}

function is_correct_knight_move(sx, sy, dx, dy) {
  return (Math.abs(dx - sx) == 1 && Math.abs(dy - sy) == 2) ||
         (Math.abs(dx - sx) == 2 && Math.abs(dy - sy) == 1);
}

function is_correct_rook_move(sx, sy, dx, dy) {
  return is_correct_line_move(sx, sy, dx, dy, "R");
}

function is_empty(x, y) {
  if (!on_map(x, y)) return false;
  return map[x][y] == " ";
}

function on_map(x, y) {
  return (x >= 0 && x <= 7 && y >= 0 && y <= 7);
}

function is_correct_pawn_move(sx, sy, dx, dy) {
  if (get_color(sx, sy) == "white") return is_correct_white_pawn_move(sx, sy, dx, dy);
  if (get_color(sx, sy) == "black") return is_correct_black_pawn_move(sx, sy, dx, dy);
  return false;
}

function is_correct_white_pawn_move(sx, sy, dx, dy) {
  if (sy < 1 || sy > 6) return false;
  if (is_pawn_passant()) return true;
  if (!is_empty(dx, dy)) { // это взятие?
    if (Math.abs(dx - sx) != 1) return false;  // 1 шаг влево/вправо
    return dy - sy == 1;
  }
  if (dx != sx) return false;
  if (dy - sy == 1) return true;
  if (dy - sy == 2) {// на две клетки
    if (sy != 1) return false;
    return is_empty(sx, sy + 1);
  }
  return false;
}

function is_correct_black_pawn_move(sx, sy, dx, dy) {
  return true;
}

function is_pawn_passant() {
  return false;
}

function mark_moves_from() { // (урок 6)
  init_inf();
  for (let sx = 0; sx <= 7; sx++)
    for (let sy = 0; sy <= 7; sy++)
      for (let dx = 0; dx <= 7; dx++)
        for (let dy = 0; dy <= 7; dy++)
          if (can_move(sx, sy, dx, dy))
            inf[sx][sy] = 1;
}

function mark_moves_to(){
  init_inf();
  for (let x = 0; x <= 7; x++)
    for (let y = 0; y <= 7; y++)
      if (can_move(move_from_x, move_from_y, x, y))
        inf[x][y] = 2;
}

function can_move_from(x, y) {
  if (!on_map(x, y)) return false;
  return get_color(x, y) == move_color;
}

function can_move_to(x, y) {
  if (!on_map(x, y)) return false;
  if (map[x][y] == " ") return true;
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

function figure_to_html(figure) { // Фигуры
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

function show_map() {    // вывод доски
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
