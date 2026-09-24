pipeline {
    agent any

    environment {
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        PREVIOUS_BUILD_TAG = "${env.BUILD_NUMBER.toInteger() - 1}"
        TRACKING_CERTS_API_KEY = credentials('tracking-certs-api-key')
        AVA_CHAT_API_KEY = credentials('ava-chat-api-key')
        STAGING_AVA_BASE_URL = credentials('staging-mom-base-url')
        PROD_AVA_BASE_URL = credentials('prod-ava-backend-base-url')
        STAGING_VALUATION_BASE_URL = credentials('staging-valuation-base-url')
        PROD_VALUATION_BASE_URL = credentials('prod-valuation-base-url')
        STAGING_FRAUD_DETECTION_BASE_URL = credentials('staging-fraud-detection-base-url')
        PROD_FRAUD_DETECTION_BASE_URL = credentials('prod-fraud-detection-base-url')
        STAGING_REGENT_MEDIA_STORAGE_BASE_URL = credentials('staging-regent-media-storage-base-url')
        PROD_REGENT_MEDIA_STORAGE_BASE_URL = credentials('prod-regent-media-storage-base-url')
        REGENT_TRACK_BASE_URL = credentials('regent-track-base-url')
        REGENT_TRACK_CERTS_BASE_URL = credentials('regent-track-certs-base-url')
        STAGING_AI_CHAT_BASE_URL = credentials('staging-ai-chat-base-url')
        PROD_AI_CHAT_BASE_URL = credentials('prod-ai-chat-base-url')
        PROD_IPRS_BASE_URL = credentials('prod-iprs-base-url')
        PROD_IPRS_API_KEY = credentials('iprs-api-key')
        COLV_PASS_KEY = credentials('corp-colv-key-passkey')
        COLV_API_KEY_SECRET = credentials('corp-colv-api-secret')
        COLV_CLIENT_ID = credentials('corp-colv-cid')
        LEGACY_VALUATION_BASE_URL = credentials('legacy-api-base-url')
        LEGACY_VALUATION_API_KEY = credentials('legacy-api-staff-key')
        GOOGLE_MAPS_API_KEY = credentials('google-maps-api-key')
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'github-credentials-id',
                    branch: env.BRANCH_NAME,
                    url: "${CORPORATE_PORTAL_GITHUB_REPO}"
            }
        }

        stage('Build Docker Image - Staging') {
            when {
                branch 'rewrite-start'
            }
            steps {
                script {
                    docker.build("${CORPORATE_PORTAL_DOCKER_IMAGE}:${DOCKER_TAG}", """--build-arg NUXT_PUBLIC_AVA_BASE_URL='${STAGING_AVA_BASE_URL}' \
                        --build-arg NUXT_PUBLIC_VALUATION_BASE_URL='${STAGING_VALUATION_BASE_URL}' \
                        --build-arg NUXT_PUBLIC_FRAUD_DETECTION_BASE_URL='${STAGING_FRAUD_DETECTION_BASE_URL}' \
                        --build-arg NUXT_PUBLIC_REGENT_MEDIA_STORAGE_BASE_URL='${STAGING_REGENT_MEDIA_STORAGE_BASE_URL}' \
                        --build-arg NUXT_PUBLIC_GOOGLE_MAPS_GEOFENCING_COUNTRY='${NUXT_PUBLIC_GOOGLE_MAPS_GEOFENCING_COUNTRY}' \
                        --build-arg NUXT_PUBLIC_APP_VERSION='${NUXT_PUBLIC_APP_VERSION}' \
                        --build-arg NUXT_PUBLIC_COPYRIGHT_YEAR='${NUXT_PUBLIC_COPYRIGHT_YEAR}' \
                        --build-arg NUXT_PUBLIC_BUILD_TAG='${DOCKER_TAG}' .""")
                }
            }
        }

        stage('Build Docker Image - Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.build("${CORPORATE_PORTAL_DOCKER_IMAGE}:${DOCKER_TAG}", """--build-arg NUXT_PUBLIC_AVA_BASE_URL='${PROD_AVA_BASE_URL}' \
                        --build-arg NUXT_PUBLIC_VALUATION_BASE_URL='${PROD_VALUATION_BASE_URL}' \
                        --build-arg NUXT_PUBLIC_FRAUD_DETECTION_BASE_URL='${PROD_FRAUD_DETECTION_BASE_URL}' \
                        --build-arg NUXT_PUBLIC_REGENT_MEDIA_STORAGE_BASE_URL='${PROD_REGENT_MEDIA_STORAGE_BASE_URL}' \
                        --build-arg NUXT_PUBLIC_GOOGLE_MAPS_GEOFENCING_COUNTRY='${NUXT_PUBLIC_GOOGLE_MAPS_GEOFENCING_COUNTRY}' \
                        --build-arg NUXT_PUBLIC_APP_VERSION='${NUXT_PUBLIC_APP_VERSION}' \
                        --build-arg NUXT_PUBLIC_COPYRIGHT_YEAR='${NUXT_PUBLIC_COPYRIGHT_YEAR}' \
                        --build-arg NUXT_PUBLIC_BUILD_TAG='${DOCKER_TAG}' .""")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials-id') {
                        docker.image("${CORPORATE_PORTAL_DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'rewrite-start'
            }
            steps {
                script {
                    sshagent(credentials: ['ssh-staging']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${SERVER_SSH_USERNAME}@${STAGING_SERVER_IP} << EOF
                            echo "Stopping and removing existing container..."
                            docker stop corporate-portal || true
                            docker rm corporate-portal || true

                            echo "Removing previous image..."
                            docker rmi ${CORPORATE_PORTAL_DOCKER_IMAGE}:${PREVIOUS_BUILD_TAG} || true

                            echo "Pulling new image..."
                            docker pull ${CORPORATE_PORTAL_DOCKER_IMAGE}:${DOCKER_TAG}

                            echo "Running new container on staging..."
                            docker run -d \\
                                --restart always \\
                                --name corporate-portal \\
                                --network internal-network \\
                                -p ${CORPORATE_PORTAL_PORT}:${CORPORATE_PORTAL_PORT} \\
                                -e NUXT_PUBLIC_SETTINGS_SUPPORTED_THEMES='light,black' \\
                                -e NUXT_PUBLIC_COPYRIGHT_YEAR='2026' \\
                                -e NUXT_PUBLIC_PAGE_SIZE='20' \\
                                -e NUXT_VALUATION_BASE_URL='${STAGING_VALUATION_BASE_URL}' \\
                                -e NUXT_PUBLIC_GOOGLE_MAPS_GEOFENCING_COUNTRY='ke' \\
                                -e NUXT_PUBLIC_GOOGLE_MAPS_API_KEY='${GOOGLE_MAPS_API_KEY}' \\
                                -e NUXT_REGENT_TRACKING_BASE_URL='${REGENT_TRACK_BASE_URL}' \\
                                -e NUXT_REGENT_TRACKING_CERTIFICATES_BASE_URL='${REGENT_TRACK_CERTS_BASE_URL}' \\
                                -e NUXT_REGENT_TRACKING_CERTIFICATES_API_KEY='${TRACKING_CERTS_API_KEY}' \\
                                -e NUXT_COLV_BASE_URL='${PROD_IPRS_BASE_URL}' \\
                                -e NUXT_COLV_KEY_PASSKEY='${COLV_PASS_KEY}' \\
                                -e NUXT_COLV_API_KEY_SECRET='${COLV_API_KEY_SECRET}' \\
                                -e NUXT_COLV_CID='${COLV_CLIENT_ID}' \\
                                -e NUXT_IPRS_BASE_URL='${PROD_IPRS_BASE_URL}' \\
                                -e NUXT_IPRS_API_KEY='${PROD_IPRS_API_KEY}' \\
                                -e NUXT_AVA_BASE_URL='${STAGING_AVA_BASE_URL}' \\
                                -e NUXT_LEGACY_VALUATION_BASE_URL='${LEGACY_VALUATION_BASE_URL}' \\
                                -e NUXT_LEGACY_VALUATION_API_KEY='${LEGACY_VALUATION_API_KEY}' \\
                                -e NUXT_PUBLIC_RUN_ENV='prod' \\
                                -e NUXT_RUN_URL='staging.corporate.regentautovaluers.com' \\
                                ${CORPORATE_PORTAL_DOCKER_IMAGE}:${DOCKER_TAG}
EOF
                        """
                    }
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                       script {
                    sshagent(credentials: ['ssh-ava-prod']) {
                        withCredentials([usernamePassword(
                            credentialsId: 'dockerhub-credentials-id',
                            usernameVariable: 'DOCKER_USER',
                            passwordVariable: 'DOCKER_PASS'
                        )]) {
                            sh """
                                ssh -o StrictHostKeyChecking=no ${SERVER_SSH_USERNAME}@${AVA_SERVER_IP} << 'EOF'
                                echo "Logging into DockerHub..."
                                echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin

                                echo "Stopping and removing existing container..."
                                docker stop corporate-portal || true
                                docker rm corporate-portal || true

                                echo "Removing previous image..."
                                // docker rmi ${CORPORATE_PORTAL_DOCKER_IMAGE}:${PREVIOUS_BUILD_TAG} || true

                                echo "Pulling new image..."
                                docker pull ${CORPORATE_PORTAL_DOCKER_IMAGE}:${DOCKER_TAG}

                                echo "Running new container on production..."
                                docker run -d \\
                                    --restart always \\
                                    --name corporate-portal \\
                                    -p ${CORPORATE_PORTAL_PORT}:${CORPORATE_PORTAL_PORT} \\
                                    -e NUXT_PUBLIC_SETTINGS_SUPPORTED_THEMES='light,black' \\
                                    -e NUXT_PUBLIC_COPYRIGHT_YEAR=2026 \\
                                    -e NUXT_PUBLIC_PAGE_SIZE=20 \\
                                    -e NUXT_VALUATION_BASE_URL='${PROD_VALUATION_BASE_URL}' \\
                                    -e NUXT_PUBLIC_GOOGLE_MAPS_GEOFENCING_COUNTRY='ke' \\
                                    -e NUXT_PUBLIC_GOOGLE_MAPS_API_KEY='${GOOGLE_MAPS_API_KEY}' \\
                                    -e NUXT_REGENT_TRACKING_BASE_URL='${REGENT_TRACK_BASE_URL}' \\
                                    -e NUXT_REGENT_TRACKING_CERTIFICATES_BASE_URL='${REGENT_TRACK_CERTS_BASE_URL}' \\
                                    -e NUXT_REGENT_TRACKING_CERTIFICATES_API_KEY='${TRACKING_CERTS_API_KEY}' \\
                                    -e NUXT_COLV_BASE_URL='${PROD_IPRS_BASE_URL}' \\
                                    -e NUXT_COLV_KEY_PASSKEY='${COLV_PASS_KEY}' \\
                                    -e NUXT_COLV_API_KEY_SECRET='${COLV_API_KEY_SECRET}' \\
                                    -e NUXT_COLV_CID='${COLV_CLIENT_ID}' \\
                                    -e NUXT_IPRS_BASE_URL='${PROD_IPRS_BASE_URL}' \\
                                    -e NUXT_IPRS_API_KEY='${PROD_IPRS_API_KEY}' \\
                                    -e NUXT_AVA_BASE_URL='${PROD_AVA_BASE_URL}' \\
                                    -e NUXT_LEGACY_VALUATION_BASE_URL='${LEGACY_VALUATION_BASE_URL}' \\
                                    -e NUXT_LEGACY_VALUATION_API_KEY='${LEGACY_VALUATION_API_KEY}' \\
                                    -e NUXT_PUBLIC_RUN_ENV='prod' \\
                                    -e NUXT_RUN_URL='corporate.regentautovaluers.com' \\
                                    ${CORPORATE_PORTAL_DOCKER_IMAGE}:${DOCKER_TAG}
EOF
                        """
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                def targetEnv = env.BRANCH_NAME == 'main' ? 'Production' : 'Staging'
                emailext(
                    subject: "Jenkins Pipeline Success - Corporate Portal [${env.BRANCH_NAME}]",
                    body: "Deployment of corporate-portal (Build: ${BUILD_NUMBER}) to ${targetEnv} was successful.",
                    to: "${RECIPIENT_EMAIL}"
                )
            }
        }
        failure {
            script {
                def targetEnv = env.BRANCH_NAME == 'main' ? 'Production' : 'Staging'
                emailext(
                    subject: "Jenkins Pipeline Failed - Corporate Portal [${env.BRANCH_NAME}]",
                    body: "Deployment of corporate-portal (Build: ${BUILD_NUMBER}) to ${targetEnv} failed. Please check Jenkins logs.",
                    to: "${RECIPIENT_EMAIL}"
                )
            }
        }
    }
}