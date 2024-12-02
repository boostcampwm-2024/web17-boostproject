# 주춤주춤

![juchumjuchum](https://github.com/user-attachments/assets/e0912acf-d0cf-4137-ac88-02bd5694ef5f)

> 📊 초보 투자자를 위한 실시간 주식 정보 커뮤니티 서비스

<p align="center"><a href="https://juchum.info">✨ 서비스 바로가기</a></p>

<div align="center">
<a href="https://dev-sunghwki.notion.site/95d18b1ae29e4cd984d711426efe84f7?pvs=4">노션</a> &nbsp; | &nbsp; <a href="https://www.figma.com/design/g24Tzu1RQUtANxwSYyP8HA/%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85?node-id=11-2&t=O2Vt04TqwOkzH7A2-1">피그마</a> &nbsp; | &nbsp; <a href="https://juchum.info/api/">API 명세</a> &nbsp; | &nbsp; <a href="https://github.com/boostcampwm-2024/web17-juchumjuchum/wiki">위키</a>
</div>

<br/>

## 💡 서비스 개요

주춤주춤은 주식 초보자들이 투자를 하기 위한 정보를 번거로운 과정없이 알 수 있도록 해주는 서비스입니다.

실시간 채팅과 푸시 알림을 통해 투자 정보를 쉽게 확인하고 소통할 수 있도록 돕습니다.

직관적인 UI를 통해 번거로움 없이 주식 투자에 필요한 정보를 제공합니다.

<br/>

## 📢 서비스 특징

> **실시간 소통**

실시간 채팅을 통해 투자자들과 즉각적인 정보 교환

> **맞춤형 알림**

관심 있는 종목의 주요 변동 사항을 푸쉬 알림으로 즉시 확인

> **직관적인 차트**

TradingView 차트를 활용한 전문적이고 이해하기 쉬운 시각화

> **초보자 친화적**

복잡한 용어와 차트를 알기 쉽게 설명하는 툴팁 제공

<br/>

## 🚀 주요 기능

### 주식 메인

![](https://github.com/user-attachments/assets/fe8b03c0-f910-483d-b186-d4bba038c73f)

- 한국투자 API를 통한 데이터 수집
- 지수 지표 제공 (코스피, 코스닥, 원 달러 환율)
- 조회수 순으로 종목 추천
- 등락률 순으로 차트 제공

<br/>

### 주식 상세

| ![](https://github.com/user-attachments/assets/8d8a2f15-3e36-486c-9ba6-737c5fdd1618) | ![](https://github.com/user-attachments/assets/20712960-a813-4edc-a9e2-3658f95d2866) |
| :----------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: |
|                                    주식 소유 모달                                    |                                     주식 상세창                                      |

- Trading View를 사용한 시간별 그래프
- 해당 종목의 실시간 지표 제공
- 즐겨찾기 개념의 주식 소유 기능
- 주식 소유자들과 실시간 종목별 채팅
- 알림 설정

<br/>

### 주식 종목 검색

| ![](https://github.com/user-attachments/assets/f3be4732-ab8d-4e2e-a05e-9b7343806da4) | ![](https://github.com/user-attachments/assets/056d0f87-0d93-4c05-bced-16a9543a57af) |
| :----------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: |
|                                    검색 결과 로딩                                    |                                      검색 결과                                       |

- 사이드바의 검색 버튼을 통한 간편한 검색
- 검색 결과 요청 시 로딩 인디케이터를 통한 UX 개선

<br/>

### 다크모드 지원

![](https://github.com/user-attachments/assets/fa983582-0a54-4ea6-bed4-2121a3a785dc)

- 모든 화면에 대해 다크모드 지원

<br/>

### 로그인

![](https://github.com/user-attachments/assets/87284301-ea28-41f9-8b05-679595ade83c)

- 구글 로그인 제공
- 게스트 로그인 제공: 한번의 버튼 클릭으로 간편한 로그인

<br/>

### 마이페이지

| ![](https://github.com/user-attachments/assets/9af726ab-7756-4f9a-8dc2-a2da9ce9e875) | ![](https://github.com/user-attachments/assets/00d96d86-b5b3-49fd-95d5-f15af578b827) |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| 미로그인                                                                             | 로그인 상태                                                                          |

- 로그인, 로그아웃
- 닉네임 수정 기능
- 알림 내역 확인
- 소유 주식 확인 및 삭제 기능

<br/>

## ⚙ 시스템 아키텍쳐

<img src="https://github.com/user-attachments/assets/f670f644-753c-4e49-ae6f-e3d1afa8fbe6" width="500" />

<br/>

## 🎯 기술스택

| 분야   | 기술                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FE     | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/tailwind css-06B6D4?style=for-the-badge&logo=tailwind css&logoColor=white"> <img src="https://img.shields.io/badge/tanstack query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"> <img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white">                                                                                                                                                                                                                                                                                                                          |
| BE     | <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=NestJS&logoColor=white"> <img src="https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=TypeORM&logoColor=white"> <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=websocket&logoColor=white" alt="WebSocket Badge" />                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Infra  | <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions Badge" /> <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white"> <img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="NGINX Badge" /> <img src="https://img.shields.io/badge/Naver%20Cloud-03C75A?style=for-the-badge&logo=naver&logoColor=white" alt="Naver Cloud Badge" />                                                                                                                                                                                                                                            |
| DB     | <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Common | <img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge" /> <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint Badge" /> <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white" alt="Prettier Badge" /> <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge" /> <img src="https://img.shields.io/badge/yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white" alt="GitHub Badge" /> |

<br/>

## 💻 실행 방법

### 실행

```bash
git clone https://github.com/boostcampwm-2024/web17-juchumjuchum.git

yarn install

yarn client run
```

### docker compose

```bash
# deploy/template.env 수정
# 이후 deploy/.env로 수정
# deploy 폴더 내에서 실행

docker compose up -d

```

<br/>

## 👨‍🎓 팀원

|                 Backend                 |                           Backend                            |                  Backend                   |                 Frontend                 |
| :-------------------------------------: | :----------------------------------------------------------: | :----------------------------------------: | :--------------------------------------: |
| ![img](https://github.com/xjfcnfw3.png) | ![img](https://avatars.githubusercontent.com/u/52474291?v=4) | ![img](https://github.com/demian-m00n.png) | ![img](https://github.com/baegyeong.png) |
|  [김민수](https://github.com/xjfcnfw3)  |           [김성환](https://github.com/swkim12345)            |  [문설민](https://github.com/demian-m00n)  |  [조배경](https://github.com/baegyeong)  |
