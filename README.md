# midigital test project

This project is a RESTful API that provides data related to general products. It's built with Node.js, Express and TypeScript and uses a MySQL database for data storage.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What you need to install the software and how to install them:

- Node.js
- npm
- MySQL

### Installation

1. Clone the repo

   ```bash
   git clone https://your-project-url.git

   ```

2. Install NPM packages

   ```bash
   npm install

   ```

3. Create a .env file in the root directory and add your environment variables

   ```bash
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
   ```

4. Run the project

   ```bash
   npm run start

   ```

5. Usage
   This project provides several endpoints for manipulating and retrieving products data. The partial API documentation can be found in the Swagger UI which is accessible at http://localhost:5000/api-docs.

6. Create SQL dump
   To start the project and make it works it's necessary to have the users table. It's stored in "src/config/dump"

7. Running Tests
   To run tests, use the following command:
   ```bash
   npm run test
   ```
