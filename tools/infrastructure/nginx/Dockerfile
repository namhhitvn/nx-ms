# Base Nginx HTTP/3 Image
FROM macbre/nginx-http3:1.23.1

# Copy your certs.
COPY ./ssl/ssl.decrypted.key /etc/ssl/private/ssl.decrypted.key
COPY ./ssl/ssl.crt /etc/ssl/ssl.crt

ENV DOLLAR=$

# Copy your configs.
COPY ./init.sh ./init.sh
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./templates /etc/nginx/templates

CMD ["tail", "-f", "/dev/null"]
ENTRYPOINT ["/bin/sh","./init.sh"]
