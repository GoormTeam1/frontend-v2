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

# 1. npm install
echo "📦 npm install 실행 중..."
npm install || { echo "❌ npm install 실패"; exit 1; }

# 2. npm run build
echo "⚙️ next build 실행 중..."
npm run build || { echo "❌ 빌드 실패"; exit 1; }

# 3. npm run start
echo "🚀 서버 실행 중 (npm run start)..."
npm run start
