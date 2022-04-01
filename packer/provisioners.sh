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

# mkdir /home/ec2-user/node-app
# chown ec2-user:ec2-user /home/ec2-user/node-app

#Install CodeDeploy Agent
sudo yum update
sleep 10
sudo yum install ruby
sleep 10
sudo yum install wget
sleep 10
cd /home/ec2-user
wget https://csye6225-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
sleep 10
chmod +x ./install
sudo ./install auto
sleep 10
sudo service codedeploy-agent status
sudo service codedeploy-agent start
sudo service codedeploy-agent status

# ls
# cd /tmp/
# echo "$(pwd)"
# ls
# cp webservice.zip /home/ec2-user/
# cd /home/ec2-user/
# unzip -q webservice.zip
# ls -ltr
# chown ec2-user:ec2-user /home/ec2-user/webservice
# cd webservice
# ls -ltr
