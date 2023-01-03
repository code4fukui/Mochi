function i_test(a, b) {
  let i, j;
  for (i = 0; i < b; i++) {
    for (j = 0; j < b; j++) {
      a += a;
    }
  }
  return a;
}
export function _start() {
  printlni32(12345);
  printlni32(i_test(2, 4));
}
