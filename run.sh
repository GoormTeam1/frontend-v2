#!/bin/bash

echo "✅ Next.js 앱 실행 스크립트 시작"

# Node 설치 확인
if ! command -v node &> /dev/null; then
  echo "❌ Node.js가 설치되어 있지 않습니다. 먼저 설치해주세요."
  exit 1
fi

# npm 설치 확인
if ! command -v npm &> /dev/null; then
  echo "❌ npm이 설치되어 있지 않습니다. Node.js 설치가 필요합니다."
  exit 1
fi

# 의존성 설치 (node_modules 없을 때만 실행)
if [ ! -d "node_modules" ]; then
  echo "📦 npm install 실행 중..."
  npm install
else
  echo "📦 의존성(npm modules) 이미 설치됨"
fi

# .next 폴더 없으면 build
if [ ! -d ".next" ]; then
  echo "⚙️ next build 실행 중..."
  npm run build
else
  echo "⚙️ 이미 빌드 완료됨 (.next 존재)"
fi

# 앱 실행
echo "🚀 서버 실행 중 (npm run start)..."
npm run start
