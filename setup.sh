#!/bin/sh

cd /tat/dist

cp app/config.json.prod app/config.json
cp public/assets/config.json.prod public/assets/config.json

if [ ! -z $PROXY_TATENGINE_SCHEME ]; then
  echo "replace PROXY_TATENGINE_SCHEME with $PROXY_TATENGINE_SCHEME";
  sed -i "s#PROXY_TATENGINE_SCHEME#$PROXY_TATENGINE_SCHEME#" app/config.json
fi;

if [ ! -z $PROXY_TATENGINE_HOST ]; then
  echo "replace PROXY_TATENGINE_HOST with $PROXY_TATENGINE_HOST";
  sed -i "s#PROXY_TATENGINE_HOST#$PROXY_TATENGINE_HOST#" app/config.json
fi;

if [ ! -z $PROXY_TATENGINE_PORT ]; then
  echo "replace PROXY_TATENGINE_PORT with $PROXY_TATENGINE_PORT";
  sed -i "s#PROXY_TATENGINE_PORT#$PROXY_TATENGINE_PORT#" app/config.json
fi;

if [ ! -z $PROXY_TATENGINE_INSECURE_SSL ]; then
  echo "replace PROXY_TATENGINE_INSECURE_SSL with $PROXY_TATENGINE_INSECURE_SSL";
  sed -i "s#PROXY_TATENGINE_INSECURE_SSL#$PROXY_TATENGINE_INSECURE_SSL#" app/config.json
fi;

if [ ! -z $PROXY_LISTEN_PORT ]; then
  echo "replace PROXY_LISTEN_PORT with $PROXY_LISTEN_PORT";
  sed -i "s#PROXY_LISTEN_PORT#$PROXY_LISTEN_PORT#" app/config.json
fi;

if [ ! -z $FILESYSTEM_LISTEN_PORT ]; then
  echo "replace FILESYSTEM_LISTEN_PORT with $FILESYSTEM_LISTEN_PORT";
  sed -i "s#FILESYSTEM_LISTEN_PORT#$FILESYSTEM_LISTEN_PORT#" app/config.json
fi;

if [ ! -z $PROCESS_NB_FORKS ]; then
  echo "replace PROCESS_NB_FORKS with $PROCESS_NB_FORKS";
  sed -i "s#PROCESS_NB_FORKS#$PROCESS_NB_FORKS#" app/config.json
fi;

if [ ! -z $BACKEND_SCHEME ]; then
  echo "replace BACKEND_SCHEME with $BACKEND_SCHEME";
  sed -i "s#BACKEND_SCHEME#$BACKEND_SCHEME#" public/assets/config.json
fi;

if [ ! -z $RUN_MT_URL ]; then
  echo "replace RUN_MT_URL with $RUN_MT_URL";
  sed -i "s#RUN_MT_URL#$RUN_MT_URL#" public/assets/config.json
fi;

if [ ! -z $RUNVIEW_ONCALL_SERVICES ]; then
  echo "replace RUNVIEW_ONCALL_SERVICES with $RUNVIEW_ONCALL_SERVICES";
  sed -i "s#RUNVIEW_ONCALL_SERVICES#$RUNVIEW_ONCALL_SERVICES#" public/assets/config.json
fi;

if [ ! -z $RUNVIEW_TOPIC_ALERTS ]; then
  echo "replace RUNVIEW_TOPIC_ALERTS with $RUNVIEW_TOPIC_ALERTS";
  sed -i "s#RUNVIEW_TOPIC_ALERTS#$RUNVIEW_TOPIC_ALERTS#" public/assets/config.json
fi;

if [ ! -z $UAT_US_URL ]; then
  echo "replace UAT_US_URL with $UAT_US_URL";
  sed -i "s#UAT_US_URL#$UAT_US_URL#" public/assets/config.json
fi;

if [ ! -z $BACKEND_HOST ]; then
  echo "replace BACKEND_HOST with $BACKEND_HOST";
  sed -i "s#BACKEND_HOST#$BACKEND_HOST#" public/assets/config.json
fi;

if [ ! -z $BACKEND_PORT ]; then
  echo "replace BACKEND_PORT with $BACKEND_PORT";
  sed -i "s#BACKEND_PORT#$BACKEND_PORT#" public/assets/config.json
fi;

if [ ! -z $BACKEND_AUTOLOGIN ]; then
  echo "replace BACKEND_AUTOLOGIN with $BACKEND_AUTOLOGIN";
  sed -i "s#BACKEND_AUTOLOGIN#$BACKEND_AUTOLOGIN#" public/assets/config.json
fi;

if [ ! -z $WS_SOCKET_SCHEME ]; then
  echo "replace WS_SOCKET_SCHEME with $WS_SOCKET_SCHEME";
  sed -i "s#WS_SOCKET_SCHEME#$WS_SOCKET_SCHEME#" public/assets/config.json
fi;

if [ ! -z $WS_SOCKET_PORT ]; then
  echo "replace WS_SOCKET_PORT with $WS_SOCKET_PORT";
  sed -i "s#WS_SOCKET_PORT#$WS_SOCKET_PORT#" public/assets/config.json
fi;

if [ ! -z $LINK_HOME_LABEL_1 ]; then
  echo "replace LINK_HOME_LABEL_1 with $LINK_HOME_LABEL_1";
  sed -i "s#LINK_HOME_LABEL_1#$LINK_HOME_LABEL_1#" public/assets/config.json
fi;

if [ ! -z $LINK_HOME_URL_1 ]; then
  echo "replace LINK_HOME_URL_1 with $LINK_HOME_URL_1";
  sed -i "s#LINK_HOME_URL_1#$LINK_HOME_URL_1#" public/assets/config.json
fi;

if [ ! -z $LINK_HOME_LABEL_2 ]; then
  echo "replace LINK_HOME_LABEL_2 with $LINK_HOME_LABEL_2";
  sed -i "s#LINK_HOME_LABEL_2#$LINK_HOME_LABEL_2#" public/assets/config.json
fi;

if [ ! -z $LINK_HOME_URL_2 ]; then
  echo "replace LINK_HOME_URL_2 with $LINK_HOME_URL_2";
  sed -i "s#LINK_HOME_URL_2#$LINK_HOME_URL_2#" public/assets/config.json
fi;

if [ ! -z $LINK_MENU_LABEL_1 ]; then
  echo "replace LINK_MENU_LABEL_1 with $LINK_MENU_LABEL_1";
  sed -i "s#LINK_MENU_LABEL_1#$LINK_MENU_LABEL_1#" public/assets/config.json
fi;

if [ ! -z $LINK_MENU_URL_1 ]; then
  echo "replace LINK_MENU_URL_1 with $LINK_MENU_URL_1";
  sed -i "s#LINK_MENU_URL_1#$LINK_MENU_URL_1#" public/assets/config.json
fi;

if [ ! -z $LINK_MENU_LABEL_2 ]; then
  echo "replace LINK_MENU_LABEL_2 with $LINK_MENU_LABEL_2";
  sed -i "s#LINK_MENU_LABEL_2#$LINK_MENU_LABEL_2#" public/assets/config.json
fi;

if [ ! -z $LINK_MENU_URL_2 ]; then
  echo "replace LINK_MENU_URL_2 with $LINK_MENU_URL_2";
  sed -i "s#LINK_MENU_URL_2#$LINK_MENU_URL_2#" public/assets/config.json
fi;

if [ ! -z $LINK_MENU_LABEL_3 ]; then
  echo "replace LINK_MENU_LABEL_3 with $LINK_MENU_LABEL_3";
  sed -i "s#LINK_MENU_LABEL_3#$LINK_MENU_LABEL_3#" public/assets/config.json
fi;

if [ ! -z $LINK_MENU_URL_3 ]; then
  echo "replace LINK_MENU_URL_3 with $LINK_MENU_URL_3";
  sed -i "s#LINK_MENU_URL_3#$LINK_MENU_URL_3#" public/assets/config.json
fi;

if [ ! -z $HELP_SIGNUP ]; then
  echo "replace HELP_SIGNUP with $HELP_SIGNUP";
  sed -i "s#HELP_SIGNUP#$HELP_SIGNUP#" public/assets/config.json
fi;

echo "#########"
echo "file public/assets/config.json : ";
cat public/assets/config.json;
echo "#########"

MCONF=`ls public/scripts/config*`;
echo "MCONF=$MCONF";
ls -lart $MCONF

echo "angular.module('tat.config', [])" > $MCONF;
echo ".constant('appConfiguration', " >> $MCONF;
cat public/assets/config.json >> $MCONF;
echo ");" >> $MCONF;

echo "file $MCONF : ";
cat $MCONF;

if [ ! -z ${BASE_URL} ]; then
    echo "replace base url with ${BASE_URL}"
    sed -i "s#base.*href.*#base href=\"${BASE_URL}\"\>#" public/index.html
fi;

echo "################"
echo "S.T.A.R.T.I.N.G"
echo "################"
node index.js
