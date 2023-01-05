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
(global $ps_DRAW_COLORS i32 (i32.const 20))
(global $icnt (mut i32) (i32.const 0))
(export "start" (func $start))
(func $start 

)
(export "update" (func $update))
(func $update 
(i32.store16 (i32.add (global.get $ps_DRAW_COLORS) (i32.mul (i32.const 2) (i32.const 0))) (i32.const 66))
(call $line (i32.const 0) (i32.const 0) (global.get $icnt) (i32.const 159))
(global.set $icnt (i32.rem_s (i32.add (global.get $icnt) (i32.const 1)) (i32.const 160)))
)
)
