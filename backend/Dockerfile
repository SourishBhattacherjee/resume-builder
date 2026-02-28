FROM node:18-bullseye-slim

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /usr/src/app

COPY package*.json ./
RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates curl build-essential python3 \
	   texlive-latex-recommended texlive-latex-extra texlive-fonts-recommended texlive-font-utils \
	   ghostscript poppler-utils \
	&& rm -rf /var/lib/apt/lists/*

RUN npm ci --production

COPY . .

ENV PORT=7000
EXPOSE 7000

CMD ["node", "index.js"]
