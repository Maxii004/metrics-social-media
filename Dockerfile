FROM node:14-alpine

# Assumes your function is named "index.js", and there is a package.json file in the index directory 
COPY package*.json ./

# Install NPM dependencies for function
RUN npm install

COPY  . .

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "node","index.js" ] 