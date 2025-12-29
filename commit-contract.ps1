# PowerShell script to add and commit changes for sBTC Simple Wallet contract
# Commits each contract file individually for detailed Git history

# Get the list of untracked files in clarity-contract/ directory
$untrackedFiles = (git ls-files --others --exclude-standard 2>$null) -split '\r\n|\n|\r' | Where-Object { $_ -ne "" -and $_ -match "^clarity-contract/" }
Write-Host "Untracked contract files: $($untrackedFiles -join ', ')"

# Get the list of modified files (staged and unstaged) in clarity-contract/ directory
$modifiedUnstaged = (git diff --name-only 2>$null) -split '\r\n|\n|\r' | Where-Object { $_ -ne "" -and $_ -match "^clarity-contract/" }
$modifiedStaged = (git diff --cached --name-only 2>$null) -split '\r\n|\n|\r' | Where-Object { $_ -ne "" -and $_ -match "^clarity-contract/" }
$modifiedFiles = ($modifiedUnstaged + $modifiedStaged) | Select-Object -Unique
Write-Host "Modified contract files: $($modifiedFiles -join ', ')"

# Combine all contract files to commit
$allFiles = ($untrackedFiles + $modifiedFiles) | Select-Object -Unique
Write-Host "All contract files to commit: $($allFiles -join ', ')"

# Comprehensive commit message for sBTC Simple Wallet contract updates
$commitMessage = "Updated sBTC Simple Wallet contract - decentralized wallet for managing sBTC on Stacks blockchain. Features secure deposit, withdrawal, and transfer functionality with Clarity smart contracts for Bitcoin-backed assets."

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
