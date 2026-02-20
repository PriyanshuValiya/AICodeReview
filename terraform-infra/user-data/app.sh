#!/bin/bash
set -e

apt update -y
apt install -y docker.io nginx git curl unzip

systemctl enable docker
systemctl start docker
systemctl enable nginx
systemctl start nginx

usermod -aG docker ubuntu

mkdir -p /usr/libexec/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/libexec/docker/cli-plugins/docker-compose
chmod +x /usr/libexec/docker/cli-plugins/docker-compose

cd /tmp
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -o awscliv2.zip
./aws/install

APP_DIR="/home/ubuntu/AICodeReview"

if [ -d "$APP_DIR" ]; then
  cd $APP_DIR
  git pull origin main
else
  cd /home/ubuntu
  git clone https://github.com/PriyanshuValiya/AICodeReview.git
  cd $APP_DIR
fi

aws ssm get-parameter \
  --name "/coderat/prod/env" \
  --with-decryption \
  --query Parameter.Value \
  --output text > $APP_DIR/.env

echo "AST_PUBLIC_DNS=http://${AST_IP}:4000/parse" >> $APP_DIR/.env

cd $APP_DIR

docker compose up -d --build
