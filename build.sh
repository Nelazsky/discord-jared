#!/bin/bash
# Usage: Run after compilation
# Author: Ayrat "KunRAG" Mufazalov
# --------------------

# Define bash shell variable
PROJECT_PATH=$(dirname $(realpath -s $0))
ENV_FILE=$PROJECT_PATH/dist/.env

echo $PROJECT_PATH


#Run commands
cp .env dist/.env
cp config.json  dist/config.json


cd dist
mkdir -p src/storage

APP_ENV=''

# Проверяем, существует ли файл .env
if [ -f "$ENV_FILE" ]; then
  # Используем grep для поиска строки, содержащей APP_ENV
  app_env_line=$(grep "APP_ENV" "$ENV_FILE")

  # Если строка найдена, используем cut, чтобы извлечь значение переменной
  if [ -n "$app_env_line" ]; then
    app_env_value=$(echo "$app_env_line" | cut -d '=' -f 2)
    echo "Значение APP_ENV: $app_env_value"
    APP_ENV=$app_env_value
  else
    echo "Переменная APP_ENV не найдена в файле .env"
  fi
else
  echo "Файл .env не найден"
fi

# Остановить ранее запущенный процесс
pm2 stop chatwoot_adapter
# Запустить процесс с новым именем
pm2 start main.js --name chatwoot_adapter
