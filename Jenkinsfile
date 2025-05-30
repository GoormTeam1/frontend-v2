pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Git 저장소에서 cicd 브랜치만 체크아웃!
                git branch: 'cicd', url: 'https://github.com/GoormTeam1/frontend-v2.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 npm install 시작...'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo '⚙️ next build 시작...'
                sh 'npm run build'
            }
        }

        stage('Verify Build Artifacts') {
            steps {
                script {
                    if (!fileExists('.next')) {
                        error("❌ 빌드 실패: .next 폴더 없음")
                    }
                }
                echo '✅ 빌드 성공: .next 폴더 확인'
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
