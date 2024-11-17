# Health Plan CRUD Service with Schema Validation

This project implements a server that provides endpoints for performing CRUD operations on health plans with schema validation. The data is stored in **Redis** for fast access and is also sent as a message to **RabbitMQ**. A consumer service listens to the RabbitMQ queue, processes the messages, and performs the required operation on the provided data in **Elasticsearch**. Before performing the operation, the data is recursively segregated and structured into parent-child relations dynamically, ensuring consistency and integrity in the Elasticsearch index.

## Features

- **CRUD Operations**: The API supports creating, reading, updating, and deleting health plans.
- **Schema Validation**: Validates the health plan data before storing it in Redis and Elasticsearch.
- **Data Segregation**: Recursively segregates the JSON data and dynamically establishes parent-child relationships.
- **Redis Integration**: Stores the health plan data in Redis for quick access and caching.
- **RabbitMQ Integration**: Publishes messages to RabbitMQ for further processing.
- **Elasticsearch Integration**: Consumes messages from RabbitMQ and performs CRUD operations on Elasticsearch, maintaining parent-child relationships using the `join` field.

## Getting Started

Follow the instructions below to set up and run the project locally.

### Prerequisites

- Node.js
- Redis
- RabbitMQ
- Elasticsearch
- Docker

### Installation
1. Create a .env file and pass in the required environment variables
   1. Producer
      1. REDIS_HOST
      2. REDIS_PORT
      3. PORT
      4. GOOGLE_CLIENT_ID
      5. GOOGLE_ISSUER
      6. RABBIT_MQ_HOST
      7. RABBIT_MQ_PORT
      8. RABBIT_MQ_QUEUE
   
   2. Consumer
      1. ES_HOST
      2. ES_PORT
      3. ES_USER
      4. ES_LOCAL_PASSWORD="" (leave this blank)
      5. ES_INDEX


2. Run Elastic Search with Kibana

    ```sh start_elastic_search.sh```
3. Run Redis

    ```sudo systemctl start redis```
4. Run RabbitMQ

    ```sudo systemctl start rabbitmq-server```
5. Run the server + publisher

    ```node index.js```
6. Run the consumer

    ```node consumer/consumer.js```
