pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
        sonarQube 'SonarScanner'
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

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    dir('backend') {
                        bat 'npx @sonar/scan --define sonar.projectKey=habit-tracker --define sonar.sources=. --define sonar.exclusions=node_modules/**,__tests__/** --define sonar.host.url=http://localhost:9000'
                    }
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck(
                    additionalArguments: '--scan backend/ --scan frontend/ --format HTML --format XML --out reports/',
                    odcInstallation: 'OWASP-DC'
                )
            }
            post {
                always {
                    dependencyCheckPublisher(
                        pattern: 'reports/dependency-check-report.xml'
                    )
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
                bat 'docker rm -f habit-backend habit-frontend || exit 0'
                bat 'docker-compose down --remove-orphans'
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
            echo 'Pipeline fallido'
        }
    }
}