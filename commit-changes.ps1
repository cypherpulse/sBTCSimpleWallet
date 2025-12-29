# PowerShell script to add and commit changes for sBTC Simple Wallet frontend
# Commits each frontend file individually for detailed Git history

# Get the list of untracked files excluding clarity-contract/ directory
$untrackedFiles = (git ls-files --others --exclude-standard 2>$null) -split '\r\n|\n|\r' | Where-Object { $_ -ne "" -and $_ -notmatch "^clarity-contract/" }
Write-Host "Untracked frontend files: $($untrackedFiles -join ', ')"

# Get the list of modified files (staged and unstaged) excluding clarity-contract/ directory
$modifiedUnstaged = (git diff --name-only 2>$null) -split '\r\n|\n|\r' | Where-Object { $_ -ne "" -and $_ -notmatch "^clarity-contract/" }
$modifiedStaged = (git diff --cached --name-only 2>$null) -split '\r\n|\n|\r' | Where-Object { $_ -ne "" -and $_ -notmatch "^clarity-contract/" }
$modifiedFiles = ($modifiedUnstaged + $modifiedStaged) | Select-Object -Unique
Write-Host "Modified frontend files: $($modifiedFiles -join ', ')"

# Combine all frontend files to commit
$allFiles = ($untrackedFiles + $modifiedFiles) | Select-Object -Unique
Write-Host "All frontend files to commit: $($allFiles -join ', ')"

# Comprehensive commit message for sBTC Simple Wallet frontend updates
$commitMessage = @'
feat: Complete sBTC Simple Wallet frontend integration

- Integrate Stacks blockchain with React frontend
- Add wallet connection using @stacks/connect v8.2.4
- Implement sBTC balance fetching via Stacks API
- Create deposit/withdraw transaction forms
- Add real-time balance updates with @tanstack/react-query
- Configure WalletConnect for mobile wallet support
- Update README with architecture diagrams and screenshots
- Fix CSS import order and styling issues
- Implement proper wallet disconnect functionality
- Add environment variables for secure configuration
- Create comprehensive project documentation

Dependencies:
- @stacks/connect: ^8.2.4 (wallet integration)
- @stacks/network: ^6.17.0 (network config)
- @stacks/transactions: ^6.17.0 (contract calls)
- @tanstack/react-query: ^5.83.0 (data fetching)

Components:
- ConnectWallet: Secure wallet authentication
- BalanceDisplay: Real-time sBTC balance
- DepositForm/WithdrawForm: Transaction handling
- Contract integration with sbtc-simple-wallet.clar

Closes wallet connection, balance display, and transaction issues.
'@

# Commit each file individually
foreach ($file in $allFiles) {
    if ($file -ne "") {
        git add $file 2>$null
        git commit --only $file -m "$commitMessage - $file" 2>$null
    }
}

# Check if there are commits to push
$hasCommits = git log --oneline 2>$null
if ($hasCommits) {
    # Push all commits
    git push --set-upstream origin master 2>$null
} else {
    Write-Host "No commits made. Skipping push."
}