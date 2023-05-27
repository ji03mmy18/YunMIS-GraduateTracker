FROM node:lts
LABEL author="YoMin Su <aaaa1234567891016@gmail.com>"

WORKDIR /app
COPY . .
RUN yarn install

EXPOSE 3000
CMD [ "yarn", "run", "start" ]
