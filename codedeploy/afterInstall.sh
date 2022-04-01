#!/bin/bash

cd /home/ec2-user
pwd
ls -a
sudo unzip webservice.zip
pwd
cd /home/ec2-user/webservice
sudo npm install
sleep 30
ls -a