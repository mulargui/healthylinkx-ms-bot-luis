FROM ubuntu:latest

# Install node.js, and supplementary programs
RUN DEBIAN_FRONTEND=noninteractive apt-get -qq update && apt-get -y -qq install \
	nodejs \
	nodejs-legacy \
	npm
	
RUN npm install --save \
	botbuilder \
	promise \
	restify

ENV NODE_PATH=/usr/local/lib/node_modules
 
EXPOSE 80

# By default, simply start the app
#CMD exec ../run.sh
