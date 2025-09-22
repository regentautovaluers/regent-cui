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
        GOOGLE_MAPS_API_KEY = 'AIzaSyDMGtdKrUaAiV_xXpNv4Ktshpe-NbDUpjY'
        VALUATION_BASE_URL = 'http://64.226.89.245:8100'
        AVA_BASE_URL = 'http://64.225.109.172:4000'
        RECIPIENT_EMAIL = 'martbikathi@gmail.com'
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: "${env.GITHUB_CREDENTIALS_ID}", branch: 'main', url: 'https://github.com/regentautovaluers/regent-cui.git'
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

GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
VALUATION_BASE_URL=${VALUATION_BASE_URL}
AVA_BASE_URL=${AVA_BASE_URL}
EOT

                            echo "Contents of .env file:"
                            cat .env

                            echo "Running new container..."
                            docker run -d --restart always --name valuation-portal --env-file .env -p 3000:3000 -v /var/www/valuation-portal/public-assets:/app/.output/public ${DOCKER_IMAGE}:${DOCKER_TAG}
EOF
                        """
                    }
                }
            }
        }
    }
   post {
        success {
          emailext (
    subject: "Jenkins Pipeline Success - Corporate Client Portal",
    body: "The deployment of the corporate client portal container (Build: ${BUILD_NUMBER}) to DigitalOcean was successful.",
    to: "${RECIPIENT_EMAIL}"
)

            echo 'Deployment successful!'
        }

        failure {
          emailext (
    subject: "Jenkins Pipeline Failed - Corporate Client Portal",
    body: "The deployment of the corporate client portal container (Build: ${BUILD_NUMBER}) to DigitalOcean failed. Please check the Jenkins logs.",
    to: "${RECIPIENT_EMAIL}"
)

            echo 'Deployment failed!'
        }
    }
}
