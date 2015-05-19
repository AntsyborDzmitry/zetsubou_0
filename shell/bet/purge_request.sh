#!/bin/bash

svnUrl=$1
host1=$2
host2=$3
centricHost=$4
gospelHost=$5
credentials=$6
daysCount=$7

bash get_list_of_resources.sh $svnUrl $host1 $host2 $centricHost $gospelHost $daysCount | sort -o uris.log
echo List of resoures to be cleared:
IFS=$'\r\n' read -d '' -r -a urls_array < uris.log

urlsList=""

for i in "${urls_array[@]}"
do
   echo $i
   urlsList="$urlsList,\"$i\""
done

urlsList=$(echo $urlsList | sed 's/,//' ) 
urlListJsonObject="{\"objects\":[$urlsList]}"

echo "urls list json object - $urlListJsonObject"

echo "sending request for purging to akamai..." 
akamaiResponse=$(curl https://api.ccu.akamai.com/ccu/v2/queues/default -H "Content-Type:application/json" -d $urlListJsonObject -u $credentials)
#akamaiResponse="{\"estimatedSeconds\": 420, \"progressUri\": \"/ccu/v2/purges/ee72318c-2d05-11e4-8abe-55b4f8f0cc4d\", \"purgeId\": \"ee72318c-2d05-11e4-8abe-55b4f8f0cc4d\", \"supportId\": \"17PY1409046422625103-322720864\", \"httpStatus\": 201, \"detail\": \"Request accepted
#.\", \"pingAfterSeconds\": 420}"
echo "akamai response: "
echo $'\n'
echo $akamaiResponse
statusCode=$(echo "$akamaiResponse" | tr ',{}' '\n' | grep "httpStatus" | sed "s/.*: \(.*\).*/\1/")
progressUri=$(echo "$akamaiResponse" | tr ',{}' '\n' | grep "progressUri" | sed "s/.*: \"\(.*\)\".*/\1/")
pingAfter=$(echo "$akamaiResponse" | tr ',{}' '\n' | grep "pingAfterSeconds" | sed "s/.*: \(.*\).*/\1/")
echo status code - $statusCode
echo progressUri - $progressUri
echo ping after seconds - $pingAfter
if [[ $statusCode == '201' ]]
then
	echo "waiting for cache clearing $pingAfter seconds. Will check purge status every minute."
	purgeCheckUrl="https://api.ccu.akamai.com$progressUri"
	let "timeout = 2 * $pingAfter"
	echo timeout - $timeout
	progressTime=0
	while (( $progressTime < $timeout ))
	do
	echo "checking purge status $purgeCheckUrl"
	purgeRequestStatusResponse=$(curl $purgeCheckUrl -u $credentials)
	httpStatus=$(echo "$purgeRequestStatusResponse" | tr ',{}' '\n' | grep "httpStatus" | sed "s/.*: \(.*\).*/\1/")
	completionTime=$(echo "$purgeRequestStatusResponse" | tr ',{}' '\n' | grep "completionTime" | sed "s/.*: \"\(.*\)\".*/\1/")
	purgeStatus=$(echo "$purgeRequestStatusResponse" | tr ',{}' '\n' | grep "purgeStatus" | sed "s/.*: \"\(.*\)\".*/\1/")
	pingAfterSeconds=$(echo "$purgeRequestStatusResponse" | tr ',{}' '\n' | grep "pingAfterSeconds" | sed "s/.*: \(.*\).*/\1/")
	echo "akamai purge status check response: "
	echo $'\n'
	echo $purgeRequestStatusResponse
	echo httpStatus - $httpStatus
	echo completionTime - $completionTime
	echo purgeStatus - $purgeStatus
	echo pingAfterSeconds - $pingAfterSeconds
	if [[ ($httpStatus == '200') && ($completionTime != 'null') && ($purgeStatus == 'Done') ]]
	then
		echo "Cache on akamai was successfully cleared"
		exit 0
    fi
    if [[ ($httpStatus != '200') ]]
	then
		echo "Some wrong response was get from Akamai purge status check. Please check build logs to understand the issue."
		exit 1
	fi
	echo "Purge request wasn't completed yet. Will check it after minute."
	sleep 60
	let "progressTime += 60"
	echo progress time - $progressTime, timeout - $timeout
	done
	echo "Akamai cache still wasn't cleared. Timeout of checking purge request was reached. Please check build logs to understand the issue."
	exit 1
else
	echo "Error trying to submit purge request to akamai. Some wrong response was get. Please check build logs to understand the issue."
	exit 1
fi














