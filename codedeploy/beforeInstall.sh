#!/bin/bash

cd /home/ec2-user
sudo rm -rf node_modules package-lock.json webapp
pm2 kill