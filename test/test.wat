(module
  (import "wasi_unstable" "fd_write"
    (func $fd_write (param i32 i32 i32 i32) (result i32))
  )
  (memory 1)
  (export "memory" (memory 0))
  ;; mem map
  ;;    0 (8byte) for $fd_write buffer
  ;;    8 (8byte) for $fd_write result (size, err)
  ;;    - (?byte) ?? for wasmtime
  ;;   48 (32byte) for $printn buffer
  (export "_start" (func $_start))
  
  (func $strlen (param $s i32) (result i32)
    (local $p i32)
    (local.set $p (local.get $s))
    (block $block (loop $loop
      (br_if $block (i32.eqz (i32.load8_u (local.get $p))))
      (local.set $p (i32.add (local.get $p) (i32.const 1)))
      (br $loop)
    ))
    (i32.sub (local.get $p) (local.get $s))
  )
  (func $print (param $s i32)
    (local $len i32)
    (local.set $len (call $strlen (local.get $s)))
    (i32.store (i32.const 0) (local.get $s))
    (i32.store (i32.const 4) (local.get $len))

    i32.const 1 ;; stdout
    i32.const 0 ;; buffer
    local.get $len ;; out len
    i32.const 8 ;; nwrite
    call $fd_write
    drop
  )
  (func $putc (param $c i32)
    (i32.store (i32.const 0) (i32.const 24)) ;; str.pointer
    (i32.store (i32.const 4) (i32.const 1)) ;; len=1
    (i32.store8 (i32.const 24) (local.get $c))

    i32.const 1 ;; stdout
    i32.const 0 ;; buffer
    i32.const 1 ;; out len
    i32.const 8 ;; nwrite
    call $fd_write
    drop
  )
  (func $i32len (param $n i32) (result i32)
    (local $len i32)
    (local.set $len (i32.const 0))
    (if (i32.eqz (local.get $n)) (then
      (i32.const 1)
      (return)
    ))
    (if (i32.le_s (local.get $n) (i32.const 0)) (then
      (local.set $len (i32.add (local.get $len) (i32.const 1)))
      (local.set $n (i32.sub (i32.const 0) (local.get $n)))
    ))
    (block $block (loop $loop
      (br_if $block (i32.eqz (local.get $n)))
      (local.set $n (i32.div_s (local.get $n) (i32.const 10)))
      (local.set $len (i32.add (local.get $len) (i32.const 1)))
      (br $loop)
    ))
    (local.get $len)
  )
  (func $i32tos (param $n i32) (param $s i32) (param $maxlen i32) (result i32)
    (local $len i32)
    (local $c i32)
    
    (local.set $len (call $i32len (local.get $n)))
    (if (i32.le_s (local.get $maxlen) (local.get $len)) (then
      (i32.const 0)
      (return)
    ))
    (if (i32.lt_s (local.get $n) (i32.const 0)) (then
      (i32.store8 (local.get $s) (i32.const 45)) ;; -
      (local.set $n (i32.sub (i32.const 0) (local.get $n)))
      (local.set $len (i32.sub (local.get $len) (i32.const 1)))
      (local.set $s (i32.add (local.get $s) (i32.const 1)))
    ))
    (local.set $s (i32.add (local.get $s) (local.get $len)))
    (i32.store8 (local.get $s) (i32.const 0)) ;; \0
    (if (i32.eqz (local.get $n)) (then
      (local.set $s (i32.sub (local.get $s) (i32.const 1)))
      (i32.store8 (local.get $s) (i32.const 48)) ;; 0
    ) (else
      (block $block (loop $loop
        (br_if $block (i32.eqz (local.get $n)))
        (local.set $c (i32.rem_s (local.get $n) (i32.const 10)))
        (local.set $s (i32.sub (local.get $s) (i32.const 1)))
        (i32.store8 (local.get $s) (i32.add (local.get $c) (i32.const 48))) ;; "0"
        (local.set $n (i32.div_s (local.get $n) (i32.const 10)))
        (br $loop)
      ))
    ))
    (i32.const 1)
  )
  (func $printlni32 (param $n i32)
    (call $i32tos (local.get $n) (i32.const 48) (i32.const 64))
    drop
    (call $print (i32.const 48))
    (call $putc (i32.const 10))
  )
  ;; -- end of wasi.watx --
  
(func $test (param $a i32) (param $b i32) (result i32)
(local $i i32)
(local $j i32)
(local.set $i (i32.const 0))
(block $w0 (loop $w0_
(br_if $w0 (i32.sub (i32.const 1) (i32.lt_s (local.get $i) (local.get $b))))
(local.set $j (i32.const 0))
(block $w1 (loop $w1_
(br_if $w1 (i32.sub (i32.const 1) (i32.lt_s (local.get $j) (local.get $b))))
(local.set $a (i32.add (local.get $a) (local.get $a)))
(local.set $j (i32.add (local.get $j) (i32.const 1)))
(br $w1_)
))
(local.set $i (i32.add (local.get $i) (i32.const 1)))
(br $w0_)
))
(local.get $a)
(return)
)
(func $_start 
(call $printlni32 (i32.const 12345))
(call $printlni32 (call $test (i32.const 2) (i32.const 4)))
)
)
