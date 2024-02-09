# Northcoders News API

## Project Summary

The Northcoders News API is a backend service designed to provide a platform for news discussion. It offers a range of endpoints for accessing and manipulating articles, comments, and
user data programmatically.

## Hosted Version

The API is hosted at [api.nc-news.viktorkhasenko.com/api](https://api.nc-news.viktorkhasenko.com/api). Feel free to interact with the live version of the API.

## Getting Started

### Step 1: Cloning or Forking the Repository

To clone the repository and work on it locally, run:

    git clone https://github.com/Flammans/be-nc-news.git

### Step 2: Installing Dependencies

To install the necessary dependencies, run:

    npm install

### Step 3: Seeding Local Database

To seed the local database:

    npm run seed

## Environment Setup

**Important: Setting up Environment Variables**

Since the .env.* files are included in .gitignore, they are not available in the GitHub repository. These environment files contain crucial configurations that are necessary for connecting to the databases. If you're
cloning this repository to work on it locally, you will need to set up these environment variables on your own. Here's how you can do it:

### Step 1: Create Environment Files

You'll need to create two environment files in your local project:

    .env.development
    .env.test

These files will contain the necessary environment variables for connecting to the development and test databases, respectively.

### Step 2: Add Database Connection Variables

Open each file and add the following line:

    PGDATABASE=your_database_name_here

Replace your_database_name_here with the actual name of the database you're connecting to. Refer to the /db/setup.sql file in the project to find out the names of the development and test databases.

### Step 3: Ensure Privacy

Make sure that these .env files are not tracked by Git. They should already be in the .gitignore file, but it's good to double-check. This step is crucial to keep your database credentials secure.

## Running Tests

To run the test suite:

    npm test

## System Requirements

- Node.js: version 18.18.2 or higher
- PostgreSQL: version 14.10 or higher



