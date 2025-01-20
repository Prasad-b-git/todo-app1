
# CI/CD Pipeline for Todo App

This project demonstrates the implementation of a CI/CD pipeline for a Node.js-based Todo application using both Jenkins and GitHub Actions. The pipeline includes automated steps for code checkout, dependency installation, testing, Docker image creation, and deployment.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Pipeline Overview](#pipeline-overview)
- [Jenkins Pipeline](#jenkins-pipeline)
  - [Stages](#jenkins-stages)
  - [Post Actions](#jenkins-post-actions)
- [GitHub Actions Pipeline](#github-actions-pipeline)
  - [Jobs](#github-actions-jobs)
- [Environment Variables](#environment-variables)
- [Prerequisites](#prerequisites)
- [Usage Instructions](#usage-instructions)
- [Conclusion](#conclusion)

---

## Technologies Used

- Jenkins
- GitHub Actions
- Docker
- Node.js
- npm
- GitHub Repository

---

## Pipeline Overview

### Features

1. Code checkout from a GitHub repository.
2. Installation of project dependencies.
3. Running unit tests.
4. Building a Docker image.
5. Deploying the Docker container.
6. Pushing Docker images to Docker Hub.
7. Sending failure notifications.

---

## Jenkins Pipeline

The Jenkins pipeline uses a Groovy script for automating the CI/CD process.

### Jenkins Stages

1. **Code:**

   - Clones the repository `https://github.com/Prasad-b-git/todo-app1.git` from the `master` branch.

2. **Dependencies:**

   - Clears the npm cache and installs dependencies using `npm install`.

3. **Test:**

   - Runs the unit tests using `npm test`.
   - Ensures that no process is using port `3000` before starting tests.

4. **Build Docker:**

   - Builds a Docker image and tags it with the build number and `latest` tag.

5. **Run Docker:**

   - Stops and removes any existing container named `todo-app`.
   - Deploys the Docker container with the newly built image.

6. **Push to Docker Hub:**

   - Logs into Docker Hub using credentials stored in Jenkins.
   - Pushes the Docker image to Docker Hub.

### Post Actions

- **Success:**
  - Outputs a success message.
- **Failure:**
  - Stops and removes any running containers.
  - Sends a failure notification email with build logs.

---

## GitHub Actions Pipeline

The GitHub Actions pipeline is defined in a YAML file to automate the CI/CD process for the same Todo application.

### GitHub Actions Workflow

#### Trigger

- Executes on:
  - Pushes to the `master` branch.
  - Pull requests targeting the `master` branch.

#### Jobs

1. **Build:**
   - Runs on a self-hosted runner (`self-hosted`).
   - Steps:
     - **Checkout Code:** Uses `actions/checkout@v3` to clone the repository.
     - **Set Up Node.js:** Configures Node.js version `16` using `actions/setup-node@v3`.
     - **Install Dependencies:** Installs project dependencies using `npm install`.
     - **Run Tests:** Ensures port `3000` is not in use and executes tests.
     - **Build and Run Docker Container:**
       - Builds a Docker image.
       - Tags the image with the GitHub Actions run number and `latest` tag.
       - Stops and removes existing containers named `todo-app`.
       - Deploys the newly built Docker container.
     - **Send Email on Failure:** Uses `dawidd6/action-send-mail@v3` to notify failure via email.

---

## Environment Variables

The following environment variables are used:

- **NODE\_ENV:** Specifies the environment (development).
- **DOCKER\_IMAGE:** Docker image name.
- **DOCKER\_TAG:** Docker image tag (build/run number).
- **DOCKER\_USERNAME:** Docker Hub username.
- **USERNAME:** Docker Hub credentials (from Jenkins).
- **PASSWORD:** Docker Hub credentials (from Jenkins).
- **EMAIL\_USERNAME:** Email for sending notifications.
- **EMAIL\_PASSWORD:** App password for the email account.

---

## Prerequisites

1. Docker installed on the build machine.
2. Jenkins server configured with necessary plugins.
3. GitHub repository: [todo-app1](https://github.com/Prasad-b-git/todo-app1.git).
4. Self-hosted runner for GitHub Actions.
5. Email account configured for notifications (Gmail recommended).
6. Docker Hub account with repository access.

---

## Usage Instructions

### For Jenkins:

1. Set up a Jenkins pipeline project.
2. Copy the provided Groovy script into the pipeline configuration.
3. Configure Docker credentials (`docker-registry-credentials`).
4. Run the pipeline and monitor the stages for successful deployment.

### For GitHub Actions:

1. Create a `.github/workflows` directory in the repository.
2. Save the YAML pipeline script as `ci-pipeline.yml` in the directory.
3. Ensure secrets are configured in the GitHub repository:
   - **EMAIL\_USERNAME**
   - **EMAIL\_PASSWORD**
4. Push changes to the `master` branch to trigger the pipeline.

---

## Conclusion

This project showcases the implementation of robust CI/CD pipelines for a Todo application using Jenkins and GitHub Actions. By automating repetitive tasks, the pipeline ensures consistency, improves efficiency, and reduces deployment time.

