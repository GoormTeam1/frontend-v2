pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'cicd', url: 'https://github.com/your-org/your-repo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Archive Artifacts by Timestamp') {
            steps {
                script {
                    def buildTimestamp = new Date().format("yyyyMMdd-HHmmss")
                    def buildVersion = "v${buildTimestamp}"
                    def targetDir = "/var/lib/jenkins/artifacts/nextjs/${buildVersion}"

                    sh """
                    mkdir -p ${targetDir}
                    cp -r .next ${targetDir}/
                    cp package.json ${targetDir}/
                    cp -r public ${targetDir}/ || true
                    cp .env.production ${targetDir}/ || true
                    """
                    echo "📦 빌드 결과물이 ${targetDir}에 저장되었습니다."
                }
            }
        }
    }

    post {
        success {
            echo '🎉 빌드 성공'
        }
        failure {
            echo '❌ 빌드 실패'
        }
    }
}
