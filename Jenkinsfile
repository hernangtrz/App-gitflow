pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        COMPOSE_PROJECT_NAME = 'habit-tracker'
    }

    stages {

        stage('Install Backend') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    bat 'npm test'
                }
            }
        }

        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker-compose build'
            }
        }

        stage('Deploy Containers') {
            steps {
                bat 'docker-compose down'
                bat 'docker-compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                bat 'ping -n 6 127.0.0.1 > nul'
                bat 'curl -f http://localhost:3000/health'
            }
        }

    }

    post {
        success {
            echo 'Pipeline completo — app corriendo en Docker'
        }
        failure {
            bat 'docker-compose down'
            echo 'Pipeline fallido — contenedores detenidos'
        }
    }
}