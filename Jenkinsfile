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
        RECIPIENT_EMAIL = 'martbikathi@gmail.com'
        TRACKING_CERTS_API_KEY = credentials('tracking-certs-api-key')
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
                            docker stop corporate-portal || true
                            docker rm corporate-portal || true
            
                            echo "Removing existing image..."
                            docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true
                            
                            echo "Pulling new image..."
                            docker pull ${DOCKER_IMAGE}:${DOCKER_TAG}

                            echo "Running new container..."
                            docker run \
                            -d --restart always --name corporate-portal \
                            -e "NUXT_PUBLIC_AVA_BASE_URL=https://apis.ava.ke" \
                            -e "NUXT_PUBLIC_VALUATION_BASE_URL=https://api.regentautovaluers.com" \
                            -e "NUXT_PUBLIC_FRAUD_DETECTION_BASE_URL=https://service.regentfraud.ava.ke" \
                            -e "NUXT_PUBLIC_REGENT_TRACK_CERTS_BASE_URL=http://portal.regenttrack.co.ke" \
                            -e "NUXT_PUBLIC_REGENT_AUTOMATIONS_BASE_URL=https://automations.regentautovaluers.com" \
                            -e "NUXT_PUBLIC_REGENT_MEDIA_STORAGE_BASE_URL=https://media.regentautovaluers.com" \
                            -e "REGENT_TRACK_BASE_URL=https://regenttrack.com" \
                            -e "REGENT_TRACKING_CERTS_BASE_URL=https://portal.regenttrack.co.ke" \
                            -e "GOOGLE_MAPS_GEOFENCING_COUNTRY=ke" \
                            -e "TRACKING_CERTS_API_KEY=${TRACKING_CERTS_API_KEY}" \
                            -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}
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
