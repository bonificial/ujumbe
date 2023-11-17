# Kaende Ltd
## Ujumbe System

Welcome to the code repository for our project. This README provides essential information for code review and testing the application.

## Code Review Instructions


1. Examine the CI/CD pipeline defined in the GitHub Actions workflow. It triggers automatically on:
    - A pull request into the `develop` branch.
 

2. The pipeline consists of two main steps:
    - **Build and Run Tests**: It builds the project, runs unit tests, and stores the Docker image in Amazon ECR.
    - **Containerize, Deploy, and Run**: This step containerizes the application, deploys it to Amazon EKS, and starts the application.

## GitHub Secrets

Before testing, ensure the following secrets are correctly configured in GitHub Secrets:
- `SLACK_WEBHOOK`: Slack webhook for notifications.
- `MONGO_DB_URL`: MongoDB Atlas database connection URL.
- `MONGO_DB_NAME`: Name of the MongoDB database.
- `TEST_BUSINESS_NAME`: Business name for testing.
- `TEST_FROM_EMAIL`: Sender's email for testing.
- `TEST_TO_EMAIL`: Receiver's email for testing.
- `AWS_ACCESS_KEY_ID`: AWS Access Key ID.
- `AWS_SECRET_ACCESS_KEY`: AWS Secret Access Key.
- `AWS_ACCOUNT_ID`: AWS Account ID.
- `ECR_ENDPOINT`: Amazon Elastic Container Registry (ECR) endpoint.
- `ECR_REGION`: AWS region for ECR.

## Running Tests

To test the application and validate the CI/CD pipeline:
1. Push code to the `feature_branch` branch, create a pull request, or manually trigger the workflow.
2. The pipeline will build, run tests, and push the Docker image to Amazon ECR.
3. Ensure that the line `//await runNotificationCycle()` is uncommented in `src/index.js` to immediately invoke notifications or leave as it is to wait the run on interval cycle

## Database configuration

This application relies on MongoDB Atlas for its database. It contains sample business records and invoices. Some invoices include randomly generated email addresses. For cases without email addresses, invoice reminders are sent to the address in `TEST_TO_EMAIL`. For now, all reminders are sent to the slack channel also.

## Local Testing

For local testing and verification, a `.env` file with the required environment variables is available upon request. Feel free to reach out to us for this file to help test the application logic.

Thank you for reviewing our code!
