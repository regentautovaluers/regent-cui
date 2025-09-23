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
                            docker run \
                            -d --restart always \ 
                            --name corporate-portal \
                            -e "NUXT_PUBLIC_AVA_BASE_URL=https://apis.ava.ke" \
                            -e "NUXT_PUBLIC_VALUATION_BASE_URL=https://api.regentautovaluers.com" \
                            -e "NUXT_PUBLIC_FRAUD_DETECTION_BASE_URL=https://service.regentfraud.ava.ke" \
                            -e "NUXT_PUBLIC_REGENT_TRACK_BASE_URL=https://regenttrack.com" \
                            -e "NUXT_PUBLIC_REGENT_TRACK_CERTS_BASE_URL=http://portal.regenttrack.co.ke" \
                            -e "NUXT_PUBLIC_REGENT_AUTOMATIONS_BASE_URL=https://automations.regentautovaluers.com" \
                            -e "NUXT_PUBLIC_REGENT_MEDIA_STORAGE_BASE_URL=https://media.regentautovaluers.com" \
                            -e "GOOGLE_MAPS_GEOFENCING_COUNTRY=ke" \
                            -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}
                            EOF
                        """
                    }
                }
            }
        }
    }
   post {
        success {
          emailtext (
            subject: "Jenkins Pipeline Success - Corporate Client Portal",
            body: "The deployment of the corporate client portal container (Build: ${BUILD_NUMBER}) to DigitalOcean was successful.",
            to: "${RECIPIENT_EMAIL}"
            )
            echo 'Deployment successful!'
        }

        failure {
          emailtext (
            subject: "Jenkins Pipeline Failed - Corporate Client Portal",
            body: "The deployment of the corporate client portal container (Build: ${BUILD_NUMBER}) to DigitalOcean failed. Please check the Jenkins logs.",
            to: "${RECIPIENT_EMAIL}"
        )
            echo 'Deployment failed!'
        }
    }
}
