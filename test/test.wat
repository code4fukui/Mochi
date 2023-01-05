(module
(memory 1)
(export "memory" (memory 0))
(global $ps_GAMEPAD1 i32 (i32.const 22))
(global $x (mut i32) (i32.const 0))
(export "_update" (func $_update))
(func $_update 
(global.set $x (i32.load16 (i32.add (global.get $ps_GAMEPAD1) (i32.const 0))))
)
)
