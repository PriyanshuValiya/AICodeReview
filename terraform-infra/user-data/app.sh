#!/bin/bash
set -e

export DEBIAN_FRONTEND=noninteractive

echo "===== SYSTEM SETUP ====="
apt update -y
apt install -y docker.io nginx git curl unzip ca-certificates

systemctl enable docker
systemctl start docker

systemctl enable nginx
systemctl start nginx

usermod -aG docker ubuntu

echo "===== INSTALL DOCKER COMPOSE PLUGIN ====="
mkdir -p /usr/libexec/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/libexec/docker/cli-plugins/docker-compose
chmod +x /usr/libexec/docker/cli-plugins/docker-compose

echo "===== INSTALL AWS CLI ====="
cd /tmp
curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -o awscliv2.zip
./aws/install

APP_DIR="/home/ubuntu/AICodeReview"

echo "===== CLONE OR UPDATE REPO ====="
if [ -d "$APP_DIR" ]; then
  cd $APP_DIR
  git pull origin main
else
  cd /home/ubuntu
  git clone https://github.com/PriyanshuValiya/AICodeReview.git
  cd $APP_DIR
fi

echo "===== FETCH ENV FROM SSM ====="
aws ssm get-parameter \
  --name "/coderat/prod/env" \
  --with-decryption \
  --query Parameter.Value \
  --output text > $APP_DIR/.env

echo "AST_PUBLIC_DNS=http://${AST_IP}:4000/parse" >> $APP_DIR/.env

echo "===== FETCH SSL FROM SSM ====="
mkdir -p /etc/nginx/ssl

aws ssm get-parameter \
  --name "/coderat/nginx/cert" \
  --with-decryption \
  --query Parameter.Value \
  --output text > /etc/nginx/ssl/coderat.crt

aws ssm get-parameter \
  --name "/coderat/nginx/key" \
  --with-decryption \
  --query Parameter.Value \
  --output text > /etc/nginx/ssl/coderat.key

chmod 600 /etc/nginx/ssl/*

echo "===== BUILD & START DOCKER APP ====="
cd $APP_DIR
docker compose down || true
docker compose up -d --build

echo "===== CONFIGURE NGINX ====="

# remove default nginx site (important)
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-available/default

cat <<EOF > /etc/nginx/sites-available/coderat
server {
    listen 80;
    listen [::]:80;
    server_name coderat.priyanshuvaliya.dev;

    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name coderat.priyanshuvaliya.dev;

    ssl_certificate     /etc/nginx/ssl/coderat.crt;
    ssl_certificate_key /etc/nginx/ssl/coderat.key;

    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;

        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

ln -sf /etc/nginx/sites-available/coderat /etc/nginx/sites-enabled/coderat

nginx -t
systemctl restart nginx

echo "===== DEPLOYMENT COMPLETE ====="