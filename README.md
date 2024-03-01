# RealChat Advanced

RealChat Advanced is a highly scalable chat application designed for robust performance. It utilizes Redis for the pub-sub mechanism, Turbo Repo for efficient data management, Kafka as a message broker, PostgreSQL as the database, Prisma for data management, and is built with Next.js for the frontend, ensuring a smooth user experience even under heavy loads.

## Features

- **Scalability:** RealChat Advanced is designed to scale effortlessly, allowing you to add or remove servers as needed without impacting performance. It utilizes a pub-sub architecture with Redis, where servers publish messages to Redis and all servers subscribe to receive them. This ensures that all messages are distributed efficiently across the application, making it highly scalable.

- **PostgreSQL Integration:** PostgreSQL is used as the database for RealChat Advanced, providing a reliable and efficient data storage solution. By utilizing PostgreSQL, RealChat Advanced ensures data consistency and reliability, even under heavy usage.

- **Kafka Integration:** Kafka is used as a message broker in RealChat Advanced, enabling efficient communication between servers and clients. Messages are first published to Kafka and then consumed by server, ensuring reliable message delivery and scalability.

- **Prisma Integration:** Prisma is used for data management in RealChat Advanced, providing an ORM (Object-Relational Mapping) layer for interacting with the PostgreSQL database. Prisma simplifies database operations and improves development efficiency.

- **Redis Integration for Pub-Sub:** Redis is used for the pub-sub mechanism in RealChat Advanced. When a server emits data, it publishes it to Redis. All servers and clients subscribe to Redis to receive these messages. This architecture allows RealChat Advanced to scale effortlessly by adding or removing servers without impacting performance.

- **Real-time Chat:** Users can engage in real-time conversations with each other, with messages delivered instantly. RealChat Advanced uses WebSockets to enable real-time communication, ensuring that users can chat with each other without any delays.

- **High Performance:** RealChat Advanced is optimized for performance, providing a seamless chat experience even under heavy loads. By using efficient data storage solutions like PostgreSQL and Kafka, and leveraging Prisma for data management, RealChat Advanced ensures that it remains responsive and fast, even when handling a large number of users.


## Scalability

RealChat Advanced is designed for high scalability, ensuring smooth operation even under heavy loads. Here's how it achieves scalability:

- **Pub-Sub Architecture with Redis:** RealChat Advanced uses Redis for its pub-sub mechanism. When a server emits data, it publishes it to Redis. All servers subscribe to Redis to receive these messages. This architecture allows RealChat Advanced to scale effortlessly by adding or removing servers without impacting performance. 

- **Efficient Data Handling with Kafka:** To prevent overwhelming the PostgreSQL database with a large number of writes, servers first provide all data to Kafka, a message broker. Consumers then take the data from Kafka and store it in PostgreSQL. This approach ensures that the database server can handle a large number of writes without crashing, improving the overall scalability and reliability of the application.

By utilizing Redis for pub-sub and Kafka for efficient data handling, RealChat Advanced ensures high scalability and performance, making it suitable for large-scale deployments.
## Getting Started

To get started with RealChat Advanced, follow these steps:

1. **Clone the Repository:** `git clone https://github.com/rishabhpandey106/realchat-advanced.git`
2. **Install Dependencies:** `npm install`
3. **Configure Environment Variables:** Set up the required environment variables, including Redis and Turbo Repo configurations.
4. **Start the Server:** `npm start`
5. **Start:** `npm run dev`
6. **Access the Application:** Open your web browser and navigate to the application's URL.

## Folder Structure

The project follows the following folder structure:

- **/app:** Contains both server-side and frontend files.
  - **/server:** Contains server-related files.
  - **/web:** Contains frontend files.

## Contributing

Contributions are welcome! If you'd like to contribute to RealChat Advanced, please follow these guidelines:

- Fork the repository.
- Create a new branch (`git checkout -b feature/your-feature-name`).
- Make your changes.
- Commit your changes (`git commit -am 'Add new feature'`).
- Push to the branch (`git push origin feature/your-feature-name`).
- Create a new Pull Request.

## License

RealChat Advanced is licensed under the MIT License. See `LICENSE` for more information.
