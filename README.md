# Northcoders News API

Environment Setup
Important: Setting up Environment Variables

Since the .env.* files are included in .gitignore, they are not available in the GitHub repository. These environment files contain crucial configurations that are necessary for connecting to the databases. If you're cloning this repository to work on it locally, you will need to set up these environment variables on your own. Here's how you can do it:
Step 1: Create Environment Files

You'll need to create two environment files in your local project:

    .env.development
    .env.test

These files will contain the necessary environment variables for connecting to the development and test databases, respectively.
Step 2: Add Database Connection Variables

Open each file and add the following line:

    PGDATABASE=your_database_name_here

Replace your_database_name_here with the actual name of the database you're connecting to. Refer to the /db/setup.sql file in the project to find out the names of the development and test databases.
Step 3: Ensure Privacy

Make sure that these .env files are not tracked by Git. They should already be in the .gitignore file, but it's good to double-check. This step is crucial to keep your database credentials secure.
