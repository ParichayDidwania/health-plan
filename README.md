# Health Plan Indexer

This project showcases advanced techniques for handling and indexing large-scale data efficiently. It leverages **Redis** for fast access, **RabbitMQ** for message-driven processing, and **Elasticsearch** for hierarchical indexing using dynamic parent-child relationships. While the current implementation uses health plans as a use case, the design is adaptable for various big data domains.

## Key Features

- **Big Data Indexing**: Handles large-scale JSON data with recursive segregation into parent-child relationships in Elasticsearch.
- **Schema Validation**: Ensures data integrity and consistency before storage and processing.
- **Event-Driven Architecture**: Uses RabbitMQ for asynchronous, message-driven data processing.
- **Redis Integration**: Offers fast data access and caching for improved performance.
- **Elasticsearch Integration**: Supports scalable and hierarchical data indexing using the `join` field.

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
