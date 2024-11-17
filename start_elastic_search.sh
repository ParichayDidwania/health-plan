#!/bin/bash

curl -fsSL https://elastic.co/start-local | sh

ES_LOCAL_PASSWORD=$(grep 'ES_LOCAL_PASSWORD' ./elastic-start-local/.env | cut -d '=' -f2)
sed -i "s/^ES_LOCAL_PASSWORD=.*/ES_LOCAL_PASSWORD=\"$ES_LOCAL_PASSWORD\"/" .env
