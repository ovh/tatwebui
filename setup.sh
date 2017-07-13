#!/bin/bash

cd /tat/dist

if [ ! -z $WRITE_CONFIG ]; then

echo "--------"
echo "prepare public/assets/config.json.prod..."

cat <<EOF > public/assets/config.json.prod
{
  "backend": {
    "scheme": "BACKEND_SCHEME",
    "host": "BACKEND_HOST",
    "port": BACKEND_PORT,
    "autologin": BACKEND_AUTOLOGIN
  },
  "releaseview": {
    "tracker": "RELEASEVIEW_TRACKER",
    "keyword": "RELEASEVIEW_KEYWORD"
  },
  "help" : {
    "signup" : [
      "HELP_SIGNUP"
    ]
  },
  "links" : {
    "home" : [
      {
        "caption": "LINK_HOME_LABEL_1",
        "url": "LINK_HOME_URL_1"
      },
      {
        "caption": "LINK_HOME_LABEL_2",
        "url": "LINK_HOME_URL_2"
      }
    ],
    "menu" : [
      {
        "caption": "LINK_MENU_LABEL_1",
        "url": "LINK_MENU_URL_1"
      },
      {
        "caption": "LINK_MENU_LABEL_2",
        "url": "LINK_MENU_URL_2"
      },
      {
        "caption": "LINK_MENU_LABEL_3",
        "url": "LINK_MENU_URL_3"
      }
    ]
  },
  "viewconfigs": {
    "standardview-list": {
      "filters": {
        "placeholder": {
          "text": "text",
          "label": "open,doing",
          "andLabel": "open,doing",
          "notLabel": "done"
        }
      }
    }
  }
}

EOF

echo "public/assets/config.json.prod:"
cat public/assets/config.json.prod
echo "--------"
fi;

cp app/config.json.prod app/config.json
cp public/assets/config.json.prod public/assets/config.json

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

if [ ! -z $RUNVIEW_TOPIC_ALERTS ]; then
  echo "replace RUNVIEW_TOPIC_ALERTS with $RUNVIEW_TOPIC_ALERTS";
  sed -i "s#RUNVIEW_TOPIC_ALERTS#$RUNVIEW_TOPIC_ALERTS#" public/assets/config.json
fi;

if [ ! -z $RUNVIEW_TAT2SHINKEN_URL ]; then
  echo "replace RUNVIEW_TAT2SHINKEN_URL with $RUNVIEW_TAT2SHINKEN_URL";
  sed -i "s#RUNVIEW_TAT2SHINKEN_URL#$RUNVIEW_TAT2SHINKEN_URL#" public/assets/config.json
fi;

if [ ! -z $UAT_US_URL ]; then
  echo "replace UAT_US_URL with $UAT_US_URL";
  sed -i "s#UAT_US_URL#$UAT_US_URL#" public/assets/config.json
fi;

if [ ! -z $RELEASEVIEW_TRACKER ]; then
  echo "replace RELEASEVIEW_TRACKER with $RELEASEVIEW_TRACKER";
  sed -i "s#RELEASEVIEW_TRACKER#$RELEASEVIEW_TRACKER#" public/assets/config.json
fi;

if [ ! -z $RELEASEVIEW_KEYWORD ]; then
  echo "replace RELEASEVIEW_KEYWORD with $RELEASEVIEW_KEYWORD";
  sed -i "s#RELEASEVIEW_KEYWORD#$RELEASEVIEW_KEYWORD#" public/assets/config.json
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
echo "file app/config.json : ";
cat app/config.json;
echo "#########"

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
