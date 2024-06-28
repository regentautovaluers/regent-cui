pipeline {
    agent any

    environment {
        GITHUB_CREDENTIALS_ID = 'github-credentials-id'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials-id' 
        DOCKER_IMAGE = 'bensongathu/avaluation-corporate-portal'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        SERVER_IP = '64.225.109.172'
        SSH_USERNAME = 'root'
        SSH_CREDENTIALS_ID = 'your-ssh-credentials-id'
        DEV_TIME_HOST = 'http://localhost:4000'
        GOOGLE_MAPS_APIKEY = 'AIzaSyB8XLhNAJQbKA5N3PRyYNpnbUtgF36lyNQ'
        VALUATION_BASE_URL = 'http://192.168.18.20'
        AVA_BASE_URL = 'http://app.ava.ke'
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: "${env.GITHUB_CREDENTIALS_ID}", branch: 'main', url: 'https://github.com/bikathi/regent-cui.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    def image = docker.build("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}")
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        def image = docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}")
                        image.push()
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${SSH_USERNAME}@${SERVER_IP} << 'EOF'
                            echo "Stopping and removing existing container..."
                            docker stop valuation-portal || true
                            docker rm valuation-portal || true
            
                            echo "Removing existing image..."
                            docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true
                            
                            echo "Pulling new image..."
                            docker pull ${DOCKER_IMAGE}:${DOCKER_TAG}

                            echo "Creating .env file..."
                            cat <<EOT > .env
DEV_TIME_HOST=${DEV_TIME_HOST}
GOOGLE_MAPS_APIKEY=${GOOGLE_MAPS_APIKEY}
VALUATION_BASE_URL=${VALUATION_BASE_URL}
AVA_BASE_URL=${AVA_BASE_URL}
EOT

                            echo "Contents of .env file:"
                            cat .env

                            echo "Running new container..."
                            docker run -d --name valuation-portal --env-file .env -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}
EOF
                        """
                    }
                }
            }
        }
    }
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
