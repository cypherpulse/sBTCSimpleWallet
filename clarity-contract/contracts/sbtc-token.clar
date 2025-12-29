;; sbtc-token - SIP-010 token implementation

(define-constant contract-owner tx-sender)

(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-insufficient-balance (err u1))

(define-data-var token-name (string-ascii 32) "sBTC")
(define-data-var token-symbol (string-ascii 32) "sBTC")
(define-data-var token-decimals uint u8)
(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var token-supply uint u0)

(define-map token-balances principal uint)

(define-read-only (get-name)
  (ok (var-get token-name))
)

(define-read-only (get-symbol)
  (ok (var-get token-symbol))
)

(define-read-only (get-decimals)
  (ok (var-get token-decimals))
)

(define-read-only (get-balance (account principal))
  (ok (default-to u0 (map-get? token-balances account)))
)

(define-read-only (get-total-supply)
  (ok (var-get token-supply))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

(define-public (transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq from tx-sender) err-not-token-owner)
    (asserts! (>= (default-to u0 (map-get? token-balances from)) amount) err-insufficient-balance)
    (transfer-token amount from to)
    (print memo)
    (ok true)
  )
)

(define-private (transfer-token (amount uint) (from principal) (to principal))
  (begin
    (map-set token-balances from (- (default-to u0 (map-get? token-balances from)) amount))
    (map-set token-balances to (+ (default-to u0 (map-get? token-balances to)) amount))
    true
  )
)