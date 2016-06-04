FROM node:0.10.40

COPY . /data
COPY setup.sh /usr/bin/setup.sh

RUN chmod +rx /usr/bin/setup.sh && \
    apt-get -y update && apt-get -y install make && \
    npm install -g bower grunt-cli && \
    mkdir -p /home/tatUser /tat && \
    useradd -d /home/tatUser tatUser && \
    chown -R tatUser:tatUser /data /home/tatUser /tat && \
    apt-get clean autoclean purge && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /data
USER tatUser
RUN make dockerImage && \
  mv /data/.dist /tat/dist && \
  rm -rf /data/* && \
  rm -rf /data/.git*

USER root
WORKDIR /tat
CMD ["/usr/bin/setup.sh"]
