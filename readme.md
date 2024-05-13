### Требования к окружению
* NodeJS >= 16
* npm 8.15.0
* ESLint
* docker && docker-compose

### Запуск на лайв
* Склонировать репозиторий на сервере
* `cp .env.example .env` - задать переменные окружения
* `cp config.json.example config.json` - задать переменные окружения
* `npm install`
* `docker-compose up -d`
* `npm run start`

### Запуск локально
* `cp .env.example .env`  - задать переменные окружения
* `cp config.json.example config.json` - задать переменные окружения
* `npm install`
* `docker-compose up -d` - расскоментировать always:restart
* `npm run dev`