## Rodando o projeto

### Para rodar o banco local

Instale o Docker [aqui](https://www.docker.com) caso ainda não tenha.

```bash
docker --version
```

Com o docker funcionando e rodando, crie um arquivo .env e declare as seguintes variáveis.

```env
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
```

Após a declaração basta rodar `docker compose up -d`.  
Assim ele irá baixar a imagem do mongo, criar e rodar um container com o mongo.
Agora você pode acessar o mongo em:

```
"mongodb://{{MONGO_INITDB_ROOT_USERNAME}}:{{MONGO_INITDB_ROOT_PASSWORD}}@localhost:27017/?authSource=admin"
```

E com essa url de acesso defina a env `MONGO_URL`.

### Para rodar o backend

Com as envs definidas, basta executar:

```bashrc
npm i && npm run dev
```

## Sobre a redefinição de senha

Para você conseguir enviar um e-mail de maneira gratuita é necessário que você siga as instruções de criação de senha de aplicativo na sua conta do Google.  
[Aqui](https://medium.com/@aman.ahmed1897/sending-mail-from-a-typescript-node-js-application-5866bf1b3030) você pode consulta copmo fazer isso.

Ao criar a senha de aplicativo, defina as envs:

```env
NODEMAILER_USER={{seu_email}}
NODEMAILER_PASSWORD="{{senha_gerada}}"
```
