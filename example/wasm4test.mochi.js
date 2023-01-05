let icnt = 0;

const pi_PALETTE = 0x0;
const ps_DRAW_COLORS = 0x14;
const ps_GAMEPAD1 = 0x16;
const pi_FREEMEM = 0x19a0;

export function start() {
  pi_PALETTE[0] = 0xfff6d3;
  pi_PALETTE[1] = 0xf9a875;
  pi_PALETTE[2] = 0xeb6b6f;
  pi_PALETTE[3] = 0x7c3f58;
}

let x = 15;
let y = 15;

export function update() {
  let ipad, icolor;

  ipad = ps_GAMEPAD1[0];
  icolor = 0x42;
  if (ipad & 16) {
    x--;
  }
  if (ipad & 32) {
    x++;
  }
  if (ipad & 64) {
    y--;
  }
  if (ipad & 128) {
    y++;
  }
  if (ipad & 1) {
    icolor = 0x24;
  }
  
  ps_DRAW_COLORS[0] = icolor;

  line(x + 4, y + 4, 0, icnt);
  line(x + 4, y + 4, 159, icnt);
  line(x + 4, y + 4, icnt, 0);
  line(x + 4, y + 4, icnt, 159);

  rect(x, y, 8, 8);

  icnt = (icnt + 1) % 160;
}
