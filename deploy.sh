#!/bin/bash

localDir=/home/riajul/Documents/express/babur-hat/backend/
remoteDir=/home/riajul/baburhaatbd/backend/
baburhaatbd=riajul@103.148.15.24

node_modules=/home/riajul/Documents/express/babur-hat/backend/node_modules
dist=/home/riajul/Documents/express/babur-hat/backend/dist
demo=/home/riajul/Documents/express/babur-hat/backend/demo


# Sync local code to VPS
rsync -avz --exclude=${node_modules} --exclude=${dist} --exclude=${demo} ${localDir} ${baburhaatbd}:${remoteDir}

# Run build and restart commands on VPS
ssh ${baburhaatbd} "cd ${remoteDir} && yarn build && pm2 restart server"
