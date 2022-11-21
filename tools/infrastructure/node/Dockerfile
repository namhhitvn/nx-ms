FROM node:16-alpine

ENV WORKDIR /app
ENV WORKSPACE_DIR /app
ENV NODE_ENV production
ENV PATH /app/node_modules/.bin:$PATH

WORKDIR ${WORKDIR}

COPY ./entrypoint.sh /entrypoint.sh

RUN apk update
RUN apk add curl bash g++ make py3-pip

ENTRYPOINT ["bash", "/entrypoint.sh"]
