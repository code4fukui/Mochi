const ps_DRAW_COLORS = 0x14;
let icnt = 0;
export function start() {
}
export function update() {
  ps_DRAW_COLORS[0] = 0x42
  line(0, 0, icnt, 159);
  icnt = (icnt + 1) % 160;
}
