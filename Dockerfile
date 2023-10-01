# Use uma imagem Node.js oficial como imagem pai.
FROM node:16

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o resto do seu código para o contêiner
COPY . .

# Expõe a porta que o seu aplicativo usará
EXPOSE 3000

# O comando para iniciar o seu aplicativo
CMD ["node", "app.mjs"]
