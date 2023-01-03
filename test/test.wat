(module
(memory 1)
(export "memory" (memory 0))
(local $fa f32)
(local $fb f32)
(f32.add (local.get $fa) (local.get $fb))
)
