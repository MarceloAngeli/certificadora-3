# Projeto Agenda (Entrega Parcial)

## Ferramentas necessárias (utilizadas pelo desenvolvedores)
node version v25.9.0		 
npm 11.13.0		   	
postgres (PostgreSQL) 18.3 	

Para instalação das ferramentas use o packet manager da sua distribuição.

## Bibliotecas usadas (incluidas no package.json)
 
### Back-end
prisma/client" "^5.10.0",
bcrypt: "^5.1.1",
cors: "^2.8.5",
dotenv: "^16.4.5",
express: "^4.18.3",
jsonwebtoken: "^9.0.2",
nodemon: "^3.1.0",
prisma: "^5.10.0"

### Front-end
axios: "^1.6.7",
react: "^18.3.1",
react-dom: "^18.3.1",
react-router-dom: "^6.22.3"
@types/react: "^18.3.1",
@vitejs/plugin-react: "^4.3.1",
vite: "^5.4.2"

## O Sistema

### Participantes
 
* Augusto Fioruci
* Marcelo Angeli
 
### Objetivo
Desenvolver um aplicativo similar ao google agenda para o gerenciamento de palestras/workshops do projeto Meninas Digitais.

### Funcionalidades
* Login
* Criação de Usuários
* Criação de Eventos
* Visualização dos Eventos Criados
 
## Instruções de Execução: 
 
### Clone o repositório 
git clone https://github.com/MarceloAngeli/certificadora-3.git

### Verifique se o node, npm e postgres estão instalados.
Caso não estejam instale-os dando preferência para as versões mencionadas no começo do documento.

### Configurar a base de dados:
Entre no terminal do postgres (sudo -u postgres psql) e execute os seguintes comandos:
	
	CREATE USER admin WITH PASSWORD 'admin';
	ALTER USER admin CREATEDB;
	CREATE DATABASE certificadora3 OWNER admin;
	\q

PS: lembre de que o DAEMON do postgres precisa estar funcionando, para isso execute: sudo systemctl enable --now postgresql 

### Crie os arquivos .env

No /backend crie um arquivo chamado .env e insira o texto.

	DATABASE_URL="postgresql://admin:admin@localhost:5432/certificadora3?schema=public"
	JWT_SECRET="9ae7add61b1cf22edc27c1280bd7502e2c5a4ed7b08289fd044543c8533ffe919a0c80bb823ca239d12bd0338c3c95405b5db9b2e8e0589b7a837ce863d25fb5"
	JWT_REFRESH_SECRET="9ae7add61b1cf22edc27c1280bd7502e2c5a4ed7b08289fd044543c8534ffa919a0c80bb823ca239d12bd0338c3c95405b5db9b2e8e0589b7a837ce863d21fb5"
	JWT_EXPIRES_IN="15m"
	JWT_REFRESH_EXPIRES_IN="7d"
	PORT=3001
 
Ainda na pasta /backend instale as bibliotecas necessárias (npm install) 

No /frontend crie um arquivo chamado .env e insira o texto.
	
	VITE_API_URL=http://localhost:3001

Ainda na pasta /frontend instale as bibliotecas necessárias (npm install) 

### Migre a base de dados:

Volte para a pasta /backend.

### Crie o banco:
npx prisma migrate dev --name init
### Popule o banco (valores de teste):
npm exec prisma db seed

### Execute os servidores
Execute (npm run dev) em ambas as pastas /frontend e /backend

### Acesse o navegador
Abra o seu navegador de preferência e digite (http://localhost:5173/)