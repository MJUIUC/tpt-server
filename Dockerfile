FROM node:20.17.0-alpine3.19

WORKDIR /server

COPY package*.json /server/
COPY tsconfig.json /server/

COPY /prisma/schema.prisma /server/prisma/
COPY /src /server/src/

RUN npm install

RUN npx prisma generate

RUN npx tsc

EXPOSE 8080

# DATABASE_URL and MINIO credentials are injected by docker-compose for the tpt-server service
# Example:
#   DATABASE_URL=postgresql://devuser:devpassword@db:5432/tptdb
#   MINIO_ROOT_USER=minioadmin
#   MINIO_ROOT_PASSWORD=minioadmin123

CMD ["node", "dist/main/Index.js"]
