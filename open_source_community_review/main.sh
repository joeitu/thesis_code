#! /usr/bin/env bash

# Require mergestat ( https://github.com/mergestat/mergestat )

GITHUB_REPO="'CommunitySolidServer/CommunitySolidServer'"
export GITHUB_PER_PAGE=50
export GITHUB_RATE_LIMIT=1/3
# export GITHUB_TOKEN="enter token here or export it in bash"

CORE_DEVS="-e joachimvh -e matthieubosquet -e RubenVerborgh -e rubenswork"
BOTS="-e renovate -e dependabot -e gitter-badger"

echo Getting data from $GITHUB_REPO [ $(date +'%Y/%m/%d %Hh%M') ]

mergestat --format json "SELECT * FROM github_repo_prs($GITHUB_REPO)" > all_PRs

mergestat --format json "SELECT * FROM github_repo_issues($GITHUB_REPO)" > all_issues

mergestat --format json "SELECT * FROM commits($GITHUB_REPO)" > all_commits


# if mergestat give back API error, lower the rate limit and per page



echo active devs
cat all_commits | jq -r '.author_email' | sort | uniq -c | sort -rn | cut -c8- > sorted_commits_contributor
bash user_stat_del_add.sh $(cat sorted_commits_contributor )

echo how many PR by core devs?
cat all_PRs | jq -r .author_login | grep -v $CORE_DEVS $BOTS | wc -l

echo how many total PR?
 cat all_PRs | jq -r .author_login | wc -l


echo how many non-devs submited PR
 cat all_PRs | jq -r .author_login | sort | uniq -c | sort -rn | grep -v  $CORE_DEVS $BOTS | wc -l


echo how many PR answer not by dev?
mkdir -p ./prs_comments/
for n in $(cat all_PRs| jq -r .number); do
  echo "fetching PR $n"
  mergestat  --format json "SELECT * FROM github_repo_pr_comments($GITHUB_REPO, $n)" > "./prs_comments/$n"
done

for pr_n in $(ls ./prs_comments);do
  author_login=$( cat all_PRs | jq ". | select(.number == $pr_n | author_login")
  echo "None author nor bot nor dev who answer"
  cat ./prs_comments/$pr_n | jq ".author_login" | grep -v $author_login | grep -v $CORE_DEVS
  cat ./prs_comments/$pr_n | jq ".author_login" | grep -v $author_login | grep -v $CORE_DEVS | wc -l

done


echo how many different user raised issue?
cat all_issues| jq -r .author_login | sort | uniq -c | sort -rn |grep -v $CORE_DEVS $BOTS | wc -l


