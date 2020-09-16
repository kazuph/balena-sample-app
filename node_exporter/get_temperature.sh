#!/bin/sh
met="node_hwmon_temp_celsius"  #出力するメトリクス名
dir="/app/customs/"   #出力ディレクトリ
ctemp=$( cat /sys/class/thermal/thermal_zone0/temp )  #CPU温度取得
otempa="`expr $ctemp / 1000`"
otempb="`expr $ctemp % 1000`"
otemp="${otempa}.${otempb}"
line1="# HELP ${met} CPU temperature"
line2="# TYPE ${met} gauge"
/bin/echo -e "${line1}\n${line2}\n${met} ${otemp}" > ${dir}${met}.prom.$$
/bin/mv ${dir}${met}.prom.$$ ${dir}${met}.prom
/bin/chmod 666 ${dir}${met}.prom    #出力ファイルのパーミッション指定
