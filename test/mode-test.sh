#!/bin/bash

TRIES=0

function testApi {
  echo "Test HTTP request"
  while true; do
    TRIES=$((TRIES + 1))
    echo $TRIES
    curl 'http://192.168.178.186:1337/api/executeCommand?command=MANUAL&role=switchMode' -H 'Pragma: no-cache' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: en-US,en;q=0.8,de;q=0.6,ru;q=0.4,pt;q=0.2' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36' -H 'Accept: */*' -H 'Referer: http://192.168.178.186:1337/' -H 'X-Requested-With: XMLHttpRequest' -H 'Cookie: sails.sid=s%3Ac-9mUOsGh-jIRPOvrZy4R6TgumiJeuCN.nbJBmdOpd%2FTskUvhUcvYt0H08pNNFKdOJZwjOh9zHpg' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed
    sleep 1
    curl 'http://192.168.178.186:1337/api/executeCommand?command=ON&role=setPump' -H 'Pragma: no-cache' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: en-US,en;q=0.8,de;q=0.6,ru;q=0.4,pt;q=0.2' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36' -H 'Accept: */*' -H 'Referer: http://192.168.178.186:1337/' -H 'X-Requested-With: XMLHttpRequest' -H 'Cookie: sails.sid=s%3Ac-9mUOsGh-jIRPOvrZy4R6TgumiJeuCN.nbJBmdOpd%2FTskUvhUcvYt0H08pNNFKdOJZwjOh9zHpg' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed
    sleep 1
    curl 'http://192.168.178.186:1337/api/executeCommand?command=OFF&role=setPump' -H 'Pragma: no-cache' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: en-US,en;q=0.8,de;q=0.6,ru;q=0.4,pt;q=0.2' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36' -H 'Accept: */*' -H 'Referer: http://192.168.178.186:1337/' -H 'X-Requested-With: XMLHttpRequest' -H 'Cookie: sails.sid=s%3Ac-9mUOsGh-jIRPOvrZy4R6TgumiJeuCN.nbJBmdOpd%2FTskUvhUcvYt0H08pNNFKdOJZwjOh9zHpg' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed
    sleep 1
    curl 'http://192.168.178.186:1337/api/executeCommand?command=AUTOMATIC&role=switchMode' -H 'Pragma: no-cache' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: en-US,en;q=0.8,de;q=0.6,ru;q=0.4,pt;q=0.2' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36' -H 'Accept: */*' -H 'Referer: http://192.168.178.186:1337/' -H 'X-Requested-With: XMLHttpRequest' -H 'Cookie: sails.sid=s%3Ac-9mUOsGh-jIRPOvrZy4R6TgumiJeuCN.nbJBmdOpd%2FTskUvhUcvYt0H08pNNFKdOJZwjOh9zHpg' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed
  done
}

function testPI {
  echo "Test PI script"
  while true; do
    TRIES=$((TRIES + 1))
    echo $TRIES
    switch_mode.sh SET MANUAL
    sleep 1
    interface.sh SET_PUMPON
    sleep 1
    interface.sh SET_PUMPOFF
    sleep 1
    switch_mode.sh SET AUTOMATIC
  done
}

if [ "$1" = "pi" ];
  then
    testPI
  else
    testApi
fi
