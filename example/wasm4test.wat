(module
  (import "env" "blit" (func $blit (param i32 i32 i32 i32 i32 i32)))
  (import "env" "blitSub" (func $blitSub (param i32 i32 i32 i32 i32 i32 i32 i32 i32)))
  (import "env" "line" (func $line (param i32 i32 i32 i32)))
  (import "env" "hline" (func $nline (param i32 i32 i32)))
  (import "env" "vline" (func $vline (param i32 i32 i32)))
  (import "env" "oval" (func $oval (param i32 i32 i32 i32)))
  (import "env" "rect" (func $rect (param i32 i32 i32 i32)))
  (import "env" "textUtf8" (func $textUtf8 (param i32 i32 i32 i32)))
  (import "env" "traceUtf8" (func $traceUtf8 (param i32 i32)))
  (import "env" "tone" (func $tone (param i32 i32 i32 i32)))
  (import "env" "diskr" (func $diskr (param i32 i32) (result i32)))
  (import "env" "diskw" (func $diskw (param i32 i32) (result i32)))

  (import "env" "memory" (memory 1))
(global $icnt (mut i32) (i32.const 0))
(global $pi_PALETTE i32 (i32.const 0))
(global $ps_DRAW_COLORS i32 (i32.const 20))
(global $ps_GAMEPAD1 i32 (i32.const 22))
(global $pi_FREEMEM i32 (i32.const 6560))
(export "start" (func $start))
(func $start 
(i32.store (i32.add (global.get $pi_PALETTE) (i32.mul (i32.const 4) (i32.const 0))) (i32.const 16774867))
(i32.store (i32.add (global.get $pi_PALETTE) (i32.mul (i32.const 4) (i32.const 1))) (i32.const 16361589))
(i32.store (i32.add (global.get $pi_PALETTE) (i32.mul (i32.const 4) (i32.const 2))) (i32.const 15428463))
(i32.store (i32.add (global.get $pi_PALETTE) (i32.mul (i32.const 4) (i32.const 3))) (i32.const 8142680))
)
(global $x (mut i32) (i32.const 15))
(global $y (mut i32) (i32.const 15))
(export "update" (func $update))
(func $update 
(local $ipad i32)
(local $icolor i32)
(local.set $ipad (i32.load16_u (i32.add (global.get $ps_GAMEPAD1) (i32.const 0))))
(local.set $icolor (i32.const 66))
(if (i32.and (local.get $ipad) (i32.const 16)) (then
(global.set $x (i32.sub (global.get $x) (i32.const 1)))
))
(if (i32.and (local.get $ipad) (i32.const 32)) (then
(global.set $x (i32.add (global.get $x) (i32.const 1)))
))
(if (i32.and (local.get $ipad) (i32.const 64)) (then
(global.set $y (i32.sub (global.get $y) (i32.const 1)))
))
(if (i32.and (local.get $ipad) (i32.const 128)) (then
(global.set $y (i32.add (global.get $y) (i32.const 1)))
))
(if (i32.and (local.get $ipad) (i32.const 1)) (then
(local.set $icolor (i32.const 36))
))
(i32.store16 (i32.add (global.get $ps_DRAW_COLORS) (i32.mul (i32.const 2) (i32.const 0))) (local.get $icolor))
(call $line (i32.add (global.get $x) (i32.const 4)) (i32.add (global.get $y) (i32.const 4)) (i32.const 0) (global.get $icnt))
(call $line (i32.add (global.get $x) (i32.const 4)) (i32.add (global.get $y) (i32.const 4)) (i32.const 159) (global.get $icnt))
(call $line (i32.add (global.get $x) (i32.const 4)) (i32.add (global.get $y) (i32.const 4)) (global.get $icnt) (i32.const 0))
(call $line (i32.add (global.get $x) (i32.const 4)) (i32.add (global.get $y) (i32.const 4)) (global.get $icnt) (i32.const 159))
(call $rect (global.get $x) (global.get $y) (i32.const 8) (i32.const 8))
(global.set $icnt (i32.rem_s (i32.add (global.get $icnt) (i32.const 1)) (i32.const 160)))
)
)
