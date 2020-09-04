## mocha nodejs rabbitmq mongo docker tdd js template

### clone

`git clone https://github.com/celalertug/js-rabbitmq-mongo-docker.git`

### build

`yarn docker`

### run

`yarn docker-run`

### init rabbitmq docker 

```bash
docker run -d --rm --name rabbitmq -p 8080:15672 -p 5672:5672 rabbitmq:3-management
```

### init mongodb docker 

```bash
docker run -d --rm --name mongodb -p 27017:27017 mongo
```
