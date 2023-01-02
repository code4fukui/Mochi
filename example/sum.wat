(module
  (export "main" (func $main))

(func $main (result i32)
(local $sum i32)
(local $i i32)
(local.set $sum (i32.const 0))
(local.set $i (i32.const 1))
(block $w0 (loop $w0_
(br_if $w0 (i32.sub (i32.const 1) (i32.le_s (local.get $i) (i32.const 100))))
(local.set $sum (i32.add (local.get $sum) (local.get $i)))
(local.set $i (i32.add (local.get $i) (i32.const 1)))
(br $w0_)
))
(local.get $sum)
(return)
)
)
