(module
(memory 1)
(export "memory" (memory 0))
(export "_start" (func $_start))
(func $_start 
(local $isum i32)
(local $i i32)
(local.set $isum (i32.const 0))
(local.set $i (i32.const 1))
(block $w0 (loop $w0_
(br_if $w0 (i32.sub (i32.const 1) (i32.lt_s (local.get $i) (i32.const 100))))
(local.set $isum (i32.add (local.get $isum) (local.get $i)))
(local.set $i (i32.add (local.get $i) (i32.const 1)))
(br $w0_)
))
(local.get $isum)
(return)
)
)
