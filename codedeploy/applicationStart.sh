#!/bin/bash

cd /home/ec2-user/webapp
sudo kill -9 $(sudo lsof -t -i:3000)
ls -a
source /etc/profile
ls -a
pm2 start dist/index.js
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user