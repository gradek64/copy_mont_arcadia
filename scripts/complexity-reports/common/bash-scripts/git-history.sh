echo 'Calculating the number of commits per file for the last 6 months ...'

git log --since "6 months ago" --pretty=format: --name-only | sort | uniq -c | sort -rg | head -4000 > $1/git-history.txt
