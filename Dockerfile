FROM --platform=linux/amd64 node:18
RUN apt-get update -y && apt-get upgrade -y

RUN apt-get install -y unzip sudo build-essential

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN sudo ./aws/install

COPY ./cors.json ./cors.json

WORKDIR /home/app