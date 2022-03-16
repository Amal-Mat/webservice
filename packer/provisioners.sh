#!/bin/bash

sleep 30

sudo yum update -y
sleep 10
sudo yum install git make gcc -y
sleep 10
sudo amazon-linux-extras install epel
sleep 10
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash ~/.nvm/nvm.sh
sudo yum install -y gcc-c++ make
sleep 10
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install -y nodejs
sleep 10
sudo npm install -g pm2
sleep 10

mkdir /home/ec2-user/node-app
chown ec2-user:ec2-user /home/ec2-user/node-app