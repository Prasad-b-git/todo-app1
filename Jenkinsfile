pipeline {
    agent { label "gcp-vm" }
    
    environment {
        NODE_ENV = 'development'
        DOCKER_IMAGE = 'todo-app'
        DOCKER_TAG = "v${BUILD_NUMBER}"
        DOCKER_USERNAME = 'prasadsb' // Your Docker Hub username
    }
    
    stages {
        stage("Code") {
            steps {
                echo "Cloning the repo"
                git url: 'https://github.com/Prasad-b-git/todo-app1.git', branch: 'master'
            }
        }
        
        stage("Dependencies") {
            steps {
                echo "Installing dependencies"
                sh '''
                    npm cache clean --force
                    npm install
                '''
            }
        }
        
        stage("Test") {
            steps {
                echo "Running the tests"
                sh '''
                    fuser -k 3000/tcp || true
                    npm test
                '''
            }
        }
        
        stage('Build Docker') {
    steps {
        echo "Building Docker image"
        sh '''
            # Build Docker image
            docker build -t ${DOCKER_USERNAME}/${DOCKER_IMAGE}:${DOCKER_TAG} .
            
            # Tag as latest
            docker tag ${DOCKER_USERNAME}/${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_USERNAME}/${DOCKER_IMAGE}:latest
        '''
    }
}

stage('Run Docker') {
    steps {
        echo "Running Docker container"
        sh '''
            # Stop and remove any existing container
            docker ps -q --filter "name=todo-app" | xargs -r docker stop
            docker ps -aq --filter "name=todo-app" | xargs -r docker rm
            
            # Run the new container
            docker run -d \
                --name todo-app \
                -p 3000:3000 \
                ${DOCKER_USERNAME}/${DOCKER_IMAGE}:${DOCKER_TAG}
        '''
    }
}
        
        stage("Push to Docker Hub") {
            steps {
                echo "Pushing the image to Docker Hub"
                withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh '''
                        echo "$PASSWORD" | docker login --username "$USERNAME" --password-stdin
                        docker push ${DOCKER_USERNAME}/${DOCKER_IMAGE}:${DOCKER_TAG}
                        docker push ${DOCKER_USERNAME}/${DOCKER_IMAGE}:latest
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed!"
            // Cleanup Docker containers
            sh '''
                docker ps -q --filter 'name=todo-app' | xargs -r docker stop
                docker ps -aq --filter 'name=todo-app' | xargs -r docker rm
            '''
            // Send failure email notification
            emailext (
                to: 'prasadsb240801@gmail.com',
                subject: "Build failed: ${env.JOB_NAME} - Build # ${env.BUILD_NUMBER}",
                body: """
                    The build for ${env.JOB_NAME} - Build # ${env.BUILD_NUMBER} has failed.
                    
                    Check the build logs for more details: ${env.BUILD_URL}
                """
            )
        }
    }
}
