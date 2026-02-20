#!/bin/bash

apt update -y
apt install -y git curl

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

npm install -g pm2

cd /home/ubuntu

git clone https://github.com/PriyanshuValiya/coderat-ast.git
cd coderat-ast

npm install

pm2 start ast.js --name coderat-ast

pm2 save

pm2 startup systemd -u ubuntu --hp /home/ubuntu