#!/bin/bash

echo "Nginx starting..."

for f in /etc/nginx/templates/*.conf.template
do
  if [ -f "$f" ]; then
    envsubst < $f > "/etc/nginx/conf.d/$(basename ${f%.template})"
  fi
done

nginx -g "daemon off;"
