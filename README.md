# Blog API

Welcome to the Blog API! This API provides endpoints to manage user authentication, blog posts, and messages.

## Contributing

We welcome contributions to enhance the functionality or fix any issues with the API. To contribute, please follow these steps:

1. Fork the repository and clone it to your local machine.
2. Install the project dependencies using `pnpm install`.
3. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/your-bug-fix`.
4. Make your changes, ensuring that the code follows the project's coding style and conventions.
5. Write tests to cover the changes you made, ensuring that existing tests pass.
6. Commit your changes with descriptive commit messages.
7. Push your branch to your forked repository: `git push origin feature/your-feature-name`.
8. Open a pull request in this repository, describing your changes and referencing any relevant issues.

Please note that all contributions will be reviewed, and constructive feedback may be provided to ensure the quality and compatibility of the codebase.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository to your local machine: `https://github.com/musllim/my_brand_be.git`.
2. Install the project dependencies using `pnpm install`.
3. Configure the environment variables:
   - Create a `.env` file in the project's root directory.
   - Copy the content of `.env.example` into the `.env` file.
   - Modify the values in the `.env` file to match your local environment setup.
4. Set up the database:
   - Create a local or remote database instance for redis and mongodb.
   - Update the database connection details in the `.env` file.
   - Run database migrations using `pnpm run migrate`.
5. Start the server locally using `pnpm start`.
6. The API will be available at `http://localhost:3000`.

## API Documentation

The API provides the following routes:

- Authentication Routes: Endpoints for user authentication.
- Blog Routes: Endpoints for managing blog posts.
- Message Routes: Endpoints for managing messages.

For detailed information about each route, please refer to the [API documentation](http://localhost:3000/api/v1/docs).

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Redis
- JWT for authentication

## License

This project is licensed under the [MIT License](LICENSE).

Feel free to explore and enhance the API based on your requirements. If you encounter any issues or have suggestions, please open an issue in this repository.

Happy coding!
