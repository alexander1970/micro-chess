let map = Array();
let inf = Array();

let move_color = "white";
let move_from_x;
let move_from_y;
let pawn_attack_x; // координаты битого поля
let pawn_attack_y;
let from_figure;
let to_figure;
let possible_moves;
let save_pawn_x = -1;
let save_pawn_y = -1;
let save_pawn_figure = " ";
let can_white_castle_left = true;
let can_white_castle_right = true;
let can_black_castle_left = true;
let can_black_castle_right = true;

function  init_map() {    // массив позиции
  can_white_castle_left = true;
  can_white_castle_right = true;
  can_black_castle_left = true;
  can_black_castle_right = true;
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
  if (!can_move_from(sx, sy)) return false;
  if (!can_move_to(dx, dy)) return false;
  if (!is_correct_move(sx, sy, dx, dy)) return false;
  return !is_check_after_move(sx, sy, dx, dy);  // шах
}

function is_check_after_move(sx, sy, dx, dy) {
  move_figure(sx, sy, dx, dy);                           // 1. Сделать ход белых
  let check = is_check();
  back_figure(sx, sy, dx, dy);                           // 5. вернуть ход
  return check;
}

function is_check() {                      // шах
  king = find_figure(move_color == "white" ? "K" : "k");
  // 2. если ход белых - будем искать чёрного короля, чтобы его съесть
  for (let x = 0; x <= 7; x++)                           // 3. если ход белых - перебраем белые фигуры
    for (let y = 0; y <= 7; y++)
      if (get_color(x, y) != move_color)
        if (is_correct_move(x, y, king.x, king.y))       // 4. проверить, может ли фигура съесть короля
          return true;
  return false;
}

function is_checkmate() {
  if (!is_check()) return false;
  return possible_moves == 0;
}

function is_stalemate() {
  if (is_check()) return false;
  return possible_moves == 0;
}

function find_figure(figure) { // 2. найти короля белых
  for (let x = 0; x <= 7; x++)
    for (let y = 0; y <= 7; y++)
      if (map[x][y] == figure)
        return {x:x, y:y};
  return {x: -1, y: -1};
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
  return false;
}

function is_king  (figure) { return figure.toUpperCase() == "K"; }
function is_queen (figure) { return figure.toUpperCase() == "Q"; }
function is_bishop(figure) { return figure.toUpperCase() == "B"; }
function is_knight(figure) { return figure.toUpperCase() == "N"; }
function is_rook  (figure) { return figure.toUpperCase() == "R"; }
function is_pawn  (figure) { return figure.toUpperCase() == "P"; }

function is_correct_king_move(sx, sy, dx, dy) {
  if (Math.abs(dx - sx) <= 1 && Math.abs(dy - sy) <= 1) return true;
  return (can_castle(sx, sy, dx, dy))
}

function can_castle(sx, sy, dx, dy) {
  let figure = map[sx][sy];
  if (figure == "K" && sx == 4 && sy == 0) {
    if (dx == 6 && dy == 0) return can_white_cr();
    if (dx == 2 && dy == 0) return can_white_cl();
  }
  else
  if (figure == "k" && sx == 4 && sy == 7) {
    if (dx == 6 && dy == 7) return can_black_cr();
    if (dx == 2 && dy == 7) return can_black_cl();
  }
  return false;
}

function can_white_cr() {
  if (!can_white_castle_right) return false;
  if (is_check()) return false;
  if (is_check_after_move(4, 0, 5, 0)) return false;
  if (!is_empty(5, 0)) return false;
  if (!is_empty(6, 0)) return false;
  return map[7][0] == 'R';
}

function can_white_cl() {
  if (!can_white_castle_left) return false;
  if (is_check()) return false;
  if (is_check_after_move(4, 0, 3, 0)) return false;
  if (!is_empty(3, 0)) return false;
  if (!is_empty(2, 0)) return false;
  if (!is_empty(1, 0)) return false;
  return map[0][0] == 'R';
}

function can_black_cr() {
  if (!can_black_castle_right) return false;
  if (is_check()) return false;
  if (is_check_after_move(4, 7, 5, 7)) return false;
  if (!is_empty(5, 7)) return false;
  if (!is_empty(6, 7)) return false;
  return map[7][7] == 'r';
}

function can_black_cl() {
  if (!can_black_castle_left) return false;
  if (is_check()) return false;
  if (is_check_after_move(4, 7, 3, 7)) return false;
  if (!is_empty(3, 7)) return false;
  if (!is_empty(2, 7)) return false;
  if (!is_empty(1, 7)) return false;
  return map[0][7] == 'r';
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
  if (sy < 1 || sy > 6) return false;
  if (get_color(sx, sy) == "white") return is_correct_sign_pawn_move(sx, sy, dx, dy, +1);
  if (get_color(sx, sy) == "black") return is_correct_sign_pawn_move(sx, sy, dx, dy, -1);
  return false;
}

function is_correct_sign_pawn_move(sx, sy, dx, dy, sign) {
  if (is_pawn_passant(sx, sy, dx, dy, sign)) return true;
  if (!is_empty(dx, dy)) { // это взятие?
    if (Math.abs(dx - sx) != 1) return false;  // 1 шаг влево/вправо
    return dy - sy == sign;
  }
  if (dx != sx) return false;
  if (dy - sy == sign) return true;
  if (dy - sy == sign * 2) {// на две клетки
    if (sy != 1 && sy != 6) return false;
    return is_empty(sx, sy + sign);
  }
  return false;
}

function is_pawn_passant(sx, sy, dx, dy, sign) { // Порверка битого поля
  if (!(dx == pawn_attack_x && dy == pawn_attack_y)) return false;
  if (sign == +1 && sy != 4) return false; // для белых только с 4 горизонтали возможно взятие на проходе
  if (sign == -1 && sy != 3) return false; // для чёрных только с 3 горизонтали возможно взятие на проходе
  if (dy - sy != sign) return false;
  return (Math.abs(dx - sx) == 1);
}

function mark_moves_from() { // (урок 6)
  possible_moves = 0;
  init_inf();
  for (let sx = 0; sx <= 7; sx++)
    for (let sy = 0; sy <= 7; sy++)
      for (let dx = 0; dx <= 7; dx++)
        for (let dy = 0; dy <= 7; dy++)
          if (can_move(sx, sy, dx, dy)) {
            inf[sx][sy] = 1;
            possible_moves ++;
          }
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

function move_figure(sx, sy, dx, dy) { // 1. Сделать ход белых
  from_figure = map[sx][sy];
  to_figure = map[dx][dy];
  map[dx][dy] = from_figure;
  map[sx][sy] = " ";
  move_pawn_attack(from_figure, dx, dy);
}

function back_figure(sx, sy, dx, dy) { // 5. вернуть ход
  map[sx][sy] = from_figure;
  map[dx][dy] = to_figure;
  back_pawn_attack();
}

function click_box_to(to_x, to_y){
  move_figure(move_from_x, move_from_y, to_x, to_y);

  promote_pawn(from_figure, to_x, to_y);
  check_pawn_attack(from_figure, to_x, to_y);

  check_castle_moves(move_from_x, move_from_y, to_x, to_y);
  move_castling_rook(move_from_x, move_from_y, to_x, to_y);

  turn_move();    // поменять очерёдность хода
  mark_moves_from();
  show_map();
}

function check_castle_moves(from_x, from_y, to_x, to_y) {
  let figure = map[to_x][to_y];
  if ( figure == "K") {
    can_white_castle_right = false;
    can_white_castle_left = false;
  }

  if (figure == "k") {
    can_black_castle_right = false;
    can_black_castle_left = false;
  }

  if (figure == "R" && from_x == 0 && from_y == 0)
    can_white_castle_left = false;
  if (figure == "R" && from_x == 7 && from_y == 0)
    can_white_castle_right = false;

  if (figure == "r" && from_x == 0 && from_y == 7)
    can_black_castle_left = false;
  if (figure == "r" && from_x == 7 && from_y == 7)
    can_black_castle_right = false;
}

function move_castling_rook(from_x, from_y, to_x, to_y) {
  if (!is_king(map[to_x][to_y])) return;
  if (Math.abs(to_x - from_x) != 2) return;
  if (to_x == 6 && to_y == 0) {map[7][0] = ''; map[5][0] = 'R';}
  if (to_x == 2 && to_y == 0) {map[0][0] = ''; map[3][0] = 'R';}
  if (to_x == 6 && to_y == 7) {map[7][7] = ''; map[5][7] = 'r';}
  if (to_x == 2 && to_y == 7) {map[0][7] = ''; map[3][7] = 'r';}
}

function promote_pawn(from_figure, to_x, to_y) {
  if (!is_pawn(from_figure)) return;
  if (!(to_y == 7 || to_y == 0)) return;
  do {
    figure = prompt("Select figure to promote: Q R B N", "Q")
  } while (!(
    is_queen(figure) ||
    is_rook(figure) ||
    is_bishop(figure) ||
    is_knight(figure)
  ));
  if (move_color == "white")
    figure = figure.toUpperCase();
  else
    figure = figure.toLowerCase();
  map[to_x][to_y] = figure;
}

function move_pawn_attack(from_figure, to_x, to_y) {
  if (is_pawn(from_figure))
    if (to_x == pawn_attack_x && to_y == pawn_attack_y) {
      let y = move_color == "white" ? to_y - 1 : to_y + 1;
      save_pawn_figure = map[to_x][y];
      save_pawn_x = to_x;
      save_pawn_y = y;
      map[to_x][y] = " ";
    }
}

function back_pawn_attack() {
  if (save_pawn_x == -1) return;
  map[save_pawn_x][save_pawn_y] = save_pawn_figure;
}

function check_pawn_attack(from_figure, to_x, to_y) {
  pawn_attack_x = -1;
  pawn_attack_y = -1;
  save_pawn_x = -1;
  if (is_pawn(from_figure))
    if (Math.abs(to_y - move_from_y) == 2){   // строка 262 (урок 25)
      pawn_attack_x = move_from_x;
      pawn_attack_y = (move_from_y + to_y) / 2;
    }
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
                          "font-size: 36px; " +
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
  show_info();
}

function show_info() {
  let html = "Turns: " + move_color;
  if (is_checkmate())
    html += " CHECKMATE";
  else if (is_stalemate())
    html += " STALEMATE";
  else if (is_check())
    html += " CHECK";
  html +=
    (can_white_castle_left ?  'WCL ' : '') +
    (can_white_castle_right ? 'WCR ' : '') +
    (can_black_castle_left ?  'BCL ' : '') +
    (can_black_castle_right ? 'BCR ' : '');
  document.getElementById("info").innerHTML = html;
}

function start(){
  init_map();
  mark_moves_from();
  show_map();
}

start();
