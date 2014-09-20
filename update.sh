#!/bin/sh
# your repository folder
cd "/srv/sprnklr"

# fetch changes, git stores them in FETCH_HEAD
git fetch

# check for remote changes in origin repository
newUpdatesAvailable=`git diff HEAD FETCH_HEAD`
if [ "$newUpdatesAvailable" != "" ]
then
        git merge
        echo "merged updates"

        npm install
        #bower --allow-root update
        systemctl stop sprnklr
        systemctl start sprnklr
else
        echo "no updates available"
fi
