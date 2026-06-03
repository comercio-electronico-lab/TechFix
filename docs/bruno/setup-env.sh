#!/bin/bash

# Script para configurar las variables de Bruno desde el .env del backend

set -a
source ../../backend/.env
set +a

# Crear configuración de Bruno con las variables del servidor
cat > bruno.json.tmp << EOF
{
  "version": "1",
  "name": "TechFix API",
  "type": "collection",
  "settings": {
    "preRequestScript": "",
    "postRequestScript": ""
  },
  "auth": {
    "basic": {
      "username": "",
      "password": ""
    },
    "bearer": "",
    "digest": {
      "username": "",
      "password": ""
    },
    "oauth2": {
      "clientId": "",
      "clientSecret": "",
      "accessTokenUrl": "",
      "authorizationUrl": "",
      "scope": "",
      "username": "",
      "password": "",
      "refreshToken": "",
      "accessToken": "",
      "grantType": "authorization_code"
    }
  },
  "variables": {
    "protocol": "http",
    "host": "localhost",
    "port": "$PORT",
    "base_url": "http://localhost:$PORT/api",
    "token": "",
    "user_id": "",
    "payment_id": ""
  }
}
EOF

# Reemplazar el archivo original
mv bruno.json.tmp bruno.json

echo "✅ Variables de Bruno configuradas desde .env"
echo "   - Host: localhost"
echo "   - Puerto: $PORT"
echo "   - Base URL: http://localhost:$PORT/api"
