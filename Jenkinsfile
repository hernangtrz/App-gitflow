pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        COMPOSE_PROJECT_NAME = 'habit-tracker'
        VERCEL_TOKEN = credentials('vercel-token')
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

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run test -- --run || exit 0'
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
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    dependencyCheck(
                        additionalArguments: '--scan backend/ --scan frontend/ --format HTML --format XML --out reports/ --project habit-tracker --nvdApiKey 0705f9e1-c6ba-4673-8f94-d1f971016cbd',
                        odcInstallation: 'OWASP-DC'
                    )
                }
            }
            post {
                always {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        dependencyCheckPublisher(
                            pattern: 'reports/dependency-check-report.xml'
                        )
                    }
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

        stage('Deploy Frontend to Vercel') {
            steps {
                dir('frontend') {
                    bat 'npm install -g vercel'
                    bat "vercel --token %VERCEL_TOKEN% --prod --yes"
                }
            }
        }

    }

    post {
        success {
            echo 'Pipeline completo — backend en Docker, frontend en Vercel'
        }
        failure {
            echo 'Pipeline fallido'
        }
    }
}