FROM node:14-alpine

RUN apt-get update \
    && apt-get install -y wget gnupg ca-certificates \
    && wget -qO - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/* \
    && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/local/bin/wait-for-it.sh \
    && chmod +x /usr/local/bin/wait-for-it.sh
# Assumes your function is named "index.js", and there is a package.json file in the index directory 
COPY package*.json ./

# Install NPM dependencies for function
RUN npm install

COPY  . .

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "node","index.js" ] 