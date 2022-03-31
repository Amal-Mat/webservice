#!/bin/bash

cd /home/ec2-user
pwd
ls -a
sudo unzip webapp.zip
pwd
cd /home/ec2-user/webapp
sudo npm install
ls -a