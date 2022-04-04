#! /usr/bin/env bash
GIT_REPO_PATH="$HOME/thesis/css2/"
cd $GIT_REPO_PATH
# source https://gist.github.com/102/ebc4ba2ac7db7aaf29dcbb92d2ed6deb
echo "TOTAL"
 git log --pretty=format: --shortstat --no-merges | sed '/^$/d'   | awk -F' ' '{s1+=$4;s2+=$6}END{printf "additions: %s; deletions: %s\n",s1,s2}'

for user in $@ ;do
 echo "stat for $user"
 git log --pretty=format: --shortstat --no-merges --author="$user" | sed '/^$/d'   | awk -F' ' '{s1+=$4;s2+=$6}END{printf "additions: %s; deletions: %s\n",s1,s2}'
done
