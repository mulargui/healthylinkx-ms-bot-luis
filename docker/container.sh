sudo docker stop MSBOTLUIS
sudo docker rm MSBOTLUIS
sudo docker run -ti --name MSBOTLUIS -p 80:80 -v /vagrant/apps/healthylinkx-ms-bot-luis:/myapp --link NODEJSAPI:NODEJSAPI msbotluis /bin/bash

# for basic testing without external dependencies
#sudo docker run -ti --name MSBOTLUIS -p 80:80 -v /vagrant/apps/healthylinkx-ms-bot-luis:/myapp msbotluis /bin/bash