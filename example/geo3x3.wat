(module
(memory 1)
(export "memory" (memory 0))

(export "i_encode" (func $i_encode))
(func $i_encode (param $flat f32) (param $flng f32) (param $ilevel i32) (param $pccode i32) (result i32)
(local $funit f32)
(local $i i32)
(local $x i32)
(local $y i32)
(if (i32.lt_s (local.get $ilevel) (i32.const 1)) (then
(i32.const 1)
(return)
))
(i32.store8 (i32.add (local.get $pccode) (i32.const 0)) (i32.const 69))
(if (f32.lt (local.get $flng) (f32.const 0)) (then
(i32.store8 (i32.add (local.get $pccode) (i32.const 0)) (i32.const 87))
(local.set $flng (f32.add (local.get $flng) (f32.const 180)))
))
(local.set $flat (f32.add (local.get $flat) (f32.const 90)))
(local.set $funit (f32.const 180))
(local.set $i (i32.const 1))
(block $w0 (loop $w0_
(br_if $w0 (i32.sub (i32.const 1) (i32.lt_s (local.get $i) (local.get $ilevel))))
(local.set $funit (f32.div (local.get $funit) (f32.const 3)))
(local.set $x (i32.trunc_f32_s (f32.div (local.get $flng) (local.get $funit))))
(local.set $y (i32.trunc_f32_s (f32.div (local.get $flat) (local.get $funit))))
(i32.store8 (i32.add (local.get $pccode) (local.get $i)) (i32.add (i32.add (local.get $x) (i32.mul (local.get $y) (i32.const 3))) (i32.const 49)))
(local.set $flng (f32.sub (local.get $flng) (f32.mul (f32.convert_i32_s (local.get $x)) (local.get $funit))))
(local.set $flat (f32.sub (local.get $flat) (f32.mul (f32.convert_i32_s (local.get $y)) (local.get $funit))))
(local.set $i (i32.add (local.get $i) (i32.const 1)))
(br $w0_)
))
(i32.const 0)
(return)
)
(export "i_decode" (func $i_decode))
(func $i_decode (param $pccode i32) (param $pfres i32) (result i32)
(local $iflg i32)
(local $funit f32)
(local $flat f32)
(local $flng f32)
(local $ilevel i32)
(local $i i32)
(local $n i32)
(local $c i32)
(local.set $c (i32.load8_u (i32.add (local.get $pccode) (i32.const 0))))
(if (i32.eq (local.get $c) (i32.const 69)) (then
(local.set $iflg (i32.const 0))
) (else
(if (i32.eq (local.get $c) (i32.const 87)) (then
(local.set $iflg (i32.const 1))
) (else
(i32.const 1)
(return)))))
(local.set $funit (f32.const 180))
(local.set $flat (f32.const 0))
(local.set $flng (f32.const 0))
(local.set $ilevel (i32.const 1))
(local.set $i (i32.const 1))
(block $w1 (loop $w1_
(local.set $n (i32.load8_u (i32.add (local.get $pccode) (local.get $i))))
(if (i32.eq (local.get $n) (i32.const 0)) (then
(br $w1)
))
(local.set $n (i32.sub (local.get $n) (i32.const 49)))
(if (i32.or (i32.lt_s (local.get $n) (i32.const 0)) (i32.gt_s (local.get $n) (i32.const 9))) (then
(i32.const 1)
(return)
))
(local.set $funit (f32.div (local.get $funit) (f32.const 3)))
(local.set $flng (f32.add (local.get $flng) (f32.mul (f32.convert_i32_s (i32.rem_s (local.get $n) (i32.const 3))) (local.get $funit))))
(local.set $flat (f32.add (local.get $flat) (f32.mul (f32.convert_i32_s (i32.div_s (local.get $n) (i32.const 3))) (local.get $funit))))
(local.set $ilevel (i32.add (local.get $ilevel) (i32.const 1)))
(local.set $i (i32.add (local.get $i) (i32.const 1)))
(br $w1_)
))
(local.set $flat (f32.add (local.get $flat) (f32.div (local.get $funit) (f32.const 2))))
(local.set $flng (f32.add (local.get $flng) (f32.div (local.get $funit) (f32.const 2))))
(local.set $flat (f32.sub (local.get $flat) (f32.const 90)))
(if (local.get $iflg) (then
(local.set $flng (f32.sub (local.get $flng) (f32.const 180)))
))
(f32.store (i32.add (local.get $pfres) (i32.mul (i32.const 4) (i32.const 0))) (local.get $flat))
(f32.store (i32.add (local.get $pfres) (i32.mul (i32.const 4) (i32.const 1))) (local.get $flng))
(f32.store (i32.add (local.get $pfres) (i32.mul (i32.const 4) (i32.const 2))) (f32.convert_i32_s (local.get $ilevel)))
(f32.store (i32.add (local.get $pfres) (i32.mul (i32.const 4) (i32.const 3))) (local.get $funit))
(i32.const 0)
(return)
)
)
