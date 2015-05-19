#!/bin/bash

svnUrl=$1
host1=$2
host2=$3
centricHost=$4
gospelHost=$5
daysNumber=$6

svn diff --summarize $svnUrl -r {`date -d"$daysNumber days ago" +%Y-%m-%d`}:HEAD  | grep -v "^A" | grep "\.css\|\.js\|\.png\|\.jpg" | sed "s;.*\/jcr_root\(.*\);http://$host1\1\r\nhttp://$host2\1\r\nhttp://$centricHost\1;g" | sort -ru
echo http://$host1/etc/designs/betcom/jslibs/bet.js
echo http://$host2/etc/designs/betcom/jslibs/bet.js
echo http://$centricHost/etc/designs/centrictv/clientlibs.js
echo http://$gospelHost/etc/designs/gospelverticals/deploy/static/clientlibs.css
echo http://$gospelHost/etc/designs/gospelverticals/deploy/static/clientlibs.js