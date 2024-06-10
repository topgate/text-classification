#!/usr/bin/env bash
set -ue -o pipefail
export LC_ALL=C

cd $(dirname $0)

branches=$1

if !(type "hub" > /dev/null 2>&1); then
  brew install hub
fi

# https://developer.github.com/v3/repos/branches/#update-branch-protection
hub api -XPUT "/repos/{owner}/{repo}/branches/${branches}/protection" \
  --input ./protection.json \
  --header "Accept:application/vnd.github.luke-cage-preview+json"
