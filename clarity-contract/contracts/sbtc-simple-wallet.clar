;; sbtc-simple-wallet
;; A very simple Clarity smart contract for sBTC deposits and withdrawals on Stacks
;; Compatible with Clarity version 2
;; Features: Deposit sBTC, withdraw up to balance, balance tracking per user

;; Map to track user balances
(define-map user-balances principal uint)

;; Deposit sBTC to the contract
;; @param amount: The amount of sBTC to deposit (must be > 0)
;; @returns: (ok true) on success, error code on failure
(define-public (deposit (amount uint))
  (begin
    ;; Assert amount is positive
    (asserts! (> amount u0) (err u1))
    ;; Transfer sBTC from tx-sender to contract
    (try! (contract-call? .sbtc-token transfer amount tx-sender (as-contract tx-sender) none))
    ;; Update user's balance in the map
    (map-set user-balances tx-sender (+ (default-to u0 (map-get? user-balances tx-sender)) amount))
    (ok true)
  )
)

;; Withdraw sBTC from the contract
;; @param amount: The amount of sBTC to withdraw (must be > 0 and <= user's balance)
;; @returns: (ok true) on success, error code on failure
(define-public (withdraw (amount uint))
  (let ((current-balance (default-to u0 (map-get? user-balances tx-sender))))
    ;; Assert amount is positive
    (asserts! (> amount u0) (err u2))
    ;; Assert sufficient balance
    (asserts! (<= amount current-balance) (err u3))
    ;; Transfer sBTC from contract to tx-sender
    (try! (as-contract (contract-call? .sbtc-token transfer amount tx-sender tx-sender none)))
    ;; Update user's balance in the map
    (map-set user-balances tx-sender (- current-balance amount))
    (ok true)
  )
)

;; Read-only function to get a user's balance
;; @param user: The principal whose balance to query
;; @returns: The user's balance (u0 if not found)
(define-read-only (get-balance (user principal))
  (default-to u0 (map-get? user-balances user))
)