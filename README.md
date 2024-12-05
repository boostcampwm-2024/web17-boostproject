# 주춤주춤

![juchumjuchum](https://github.com/user-attachments/assets/08f462d3-3f47-4566-bb36-b96ccf320450)

<b>📊 초보 투자자를 위한 실시간 주식 정보 커뮤니티 서비스</b>

> 주춤주춤은 주식 초보자들이 투자를 하기 위한 정보를 번거로운 과정없이 알 수 있도록 해주는 서비스입니다.

<p align="center"><a href="https://juchum.info">✨ 서비스 바로가기</a></p>

<div align="center">
<a href="https://dev-sunghwki.notion.site/95d18b1ae29e4cd984d711426efe84f7?pvs=4">노션</a> &nbsp; | &nbsp; <a href="https://www.figma.com/design/g24Tzu1RQUtANxwSYyP8HA/%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85?node-id=11-2&t=O2Vt04TqwOkzH7A2-1">피그마</a> &nbsp; | &nbsp; <a href="https://juchum.info/api/">API 명세</a> &nbsp; | &nbsp; <a href="https://github.com/boostcampwm-2024/web17-juchumjuchum/wiki">위키</a>
</div>

<br/>

## 목차

[📢 서비스 특징](#📢-서비스-특징)
<br/>
[🚀 페이지 소개](#🚀-페이지-소개)
<br/>
[⚙ 시스템 아키텍쳐](#⚙-시스템-아키텍쳐)
<br/>
[🎯 기술 스택](#🎯-기술-스택)
<br/>
[💻 실행 방법](#💻-실행-방법)
<br/>
[👨‍🎓 팀원](#👨‍🎓-팀원)

<br/>

## 📢 서비스 특징

### 시간 단위로 확인하는 주식 차트

<img src="https://github.com/user-attachments/assets/2948a58f-c373-4d7e-b606-4f1077bbb21f" width="400"/>

주식마다 시간단위(일, 주, 월, 년)의 가격, 거래량을 확인할 수 있습니다.
<br/>
주식 그래프를 좌우로 움직였을 때 빠르게 이전 데이터를 불러올 수 있습니다.

#### 기술적 도전

1️⃣ 그래프의 스크롤 범위에 따라 일정량의 데이터를 받아오기 위해서 **무한스크롤**을 적용했습니다.

[📎 수많은 그래프 데이터 요청을 어떻게 줄일까](https://github.com/boostcampwm-2024/web17-juchumjuchum/wiki/%F0%9F%A7%AA-%EC%88%98%EB%A7%8E%EC%9D%80-%EA%B7%B8%EB%9E%98%ED%94%84-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%9A%94%EC%B2%AD%EC%9D%84-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%A4%84%EC%9D%BC%EA%B9%8C)

2️⃣ 제한된 요청 수를 조절하고 오류에 대응할 수 있도록, 생산자 소비자 패턴을 적용하였습니다.

[🧊 우선순위 큐로 요청 제어하기](https://github.com/boostcampwm-2024/web17-juchumjuchum/wiki/%F0%9F%A7%8A-%EC%9A%B0%EC%84%A0%EC%88%9C%EC%9C%84-%ED%81%90%EB%A1%9C-%EC%9A%94%EC%B2%AD-%EC%A0%9C%EC%96%B4%ED%95%98%EA%B8%B0)

3️⃣ 웹소켓을 관리할 때 오류를 대응하기 위해 큐를 통해 외부서비스에 대한 구독을 관리했습니다.

[🔌 websocket이 늦게 할당되어 발생되는 문제](https://github.com/boostcampwm-2024/web17-juchumjuchum/wiki/%F0%9F%94%8C-websocket%EC%9D%B4-%EB%8A%A6%EA%B2%8C-%ED%95%A0%EB%8B%B9%EB%90%98%EC%96%B4-%EB%B0%9C%EC%83%9D%EB%90%98%EB%8A%94-%EB%AC%B8%EC%A0%9C)

<br/>

### 실시간 채팅

<img src="https://github.com/user-attachments/assets/46397d2e-0202-45d9-bf20-9b00282737db" width="350" />

주식 종목마다 존재하는 채팅방에 접속하여 실시간 소통을 할 수 있습니다.
<br/>
공감이 가는 글에는 좋아요도 가능합니다.

#### 기술적 도전

- 웹소켓으로 받아오는 실시간 채팅 데이터와, REST API로 받아오는 누적 데이터를 다루기 위한 상태 관리 전략을 고민했습니다.

[👊 웹소켓의 채팅 데이터와 REST API의 채팅 데이터를 함께 관리하기](https://github.com/boostcampwm-2024/web17-juchumjuchum/wiki/%F0%9F%91%8A-%EC%9B%B9%EC%86%8C%EC%BC%93%EC%9D%98-%EC%B1%84%ED%8C%85-%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%99%80-REST-API%EC%9D%98-%EC%B1%84%ED%8C%85-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%A5%BC-%ED%95%A8%EA%BB%98-%EA%B4%80%EB%A6%AC%ED%95%98%EA%B8%B0)

<br/>

### 맞춤형 알림

| <img src="https://github.com/user-attachments/assets/aa53faa3-3b6b-4c0b-ab68-3220da7df71c" width="400" /> | <img src="https://github.com/user-attachments/assets/f02cae0f-5890-4192-957f-f92305e3cc6f" width="300"/> |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |

관심 있는 종목의 주요 변동 사항을 푸쉬 알림으로 즉시 확인할 수 있습니다.

#### 기술적 도전

- typeorm 이벤트 구조를 통한 FCM 알림 서비스를 구현하였습니다.

[🥳 typeorm을 이용한 FCM 알림 서비스](https://github.com/boostcampwm-2024/web17-juchumjuchum/wiki/%F0%9F%A5%B3-typeorm%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-FCM-%EC%95%8C%EB%A6%BC-%EC%84%9C%EB%B9%84%EC%8A%A4)

<br/>

### 초보자를 위한 주식 용어 설명

![tooltip](https://github.com/user-attachments/assets/6331f0ef-9361-497c-a41f-d7f62fcf64f4)

초보자에게는 어려운 주식 용어를 쉽게 설명하기 위한 툴팁을 제공합니다.

<br/>

## 🚀 페이지 소개

### 주식 메인

![](https://github.com/user-attachments/assets/409d700a-b83d-4f40-bbb6-97e3c251e878)

- 한국투자증권 API를 통해 데이터를 수집 했습니다.
- 지수 지표(코스피, 코스닥, 원 달러 환율)를 제공합니다.
- 조회수 순으로 종목을 추천합니다.
- 등락률 순으로 차트를 제공합니다.

<br/>

### 주식 상세

![](https://github.com/user-attachments/assets/2b447667-fda0-4f0a-9c25-9ddb97693b51)

- Trading View를 사용한 시간별 그래프로 쉽게 주식 정보를 확인할 수 있습니다.
- 해당 종목의 실시간 지표를 제공합니다.
- 즐겨찾기 개념의 주식을 모의로 보유할 수 있습니다.
- 주식 소유자들과 실시간 종목별 채팅을 할 수 있습니다.
- 자신이 원하는 주가, 거래량에 맞춰 개별주식마다 알림 설정을 할 수 있습니다.

<br/>

### 주식 종목 검색

<img src="https://github.com/user-attachments/assets/6d44d8d0-fac5-4d39-9355-d13fbdc2701d" width="350"/>

- 사이드바의 검색 버튼을 통한 간편한 검색을 지원합니다.
- 검색 결과 요청 시 로딩 인디케이터를 통한 UX적으로 미려한 로딩바를 보여줍니다.

<br/>

### 다크모드 지원

![](https://github.com/user-attachments/assets/6ac3506f-5db3-4054-801d-2e63eda5a72a)

- 모든 화면에 대해 다크모드 지원합니다.
- 로그인 된 사용자를 위한 라이트 / 다크모드를 저장할 수 있습니다.

<br/>

### 로그인 및 마이페이지

| ![](https://github.com/user-attachments/assets/dc1db8f6-bcdd-4999-ac94-1a157b73d0ef) | ![](https://github.com/user-attachments/assets/ed5a7f42-9e70-4e31-9ac4-db9dd6e19e84) |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |

- 구글 로그인과 게스트 로그인을 제공합니다.
- 마이페이지에서는 닉네임 수정, 알림 내역 확인, 소유 주식 확인 및 삭제가 가능합니다.

<br/>

## ⚙ 시스템 아키텍쳐

<img src="https://github.com/user-attachments/assets/f670f644-753c-4e49-ae6f-e3d1afa8fbe6" width="500" />

<br/>

## 🎯 기술 스택

| 분야   | 기술                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FE     | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/tailwind css-06B6D4?style=for-the-badge&logo=tailwind css&logoColor=white"> <img src="https://img.shields.io/badge/tanstack query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"> <img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white">                                                                                                                                                                                                                                                                                                                          |
| BE     | <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=NestJS&logoColor=white"> <img src="https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=TypeORM&logoColor=white"> <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=websocket&logoColor=white" alt="WebSocket Badge" />                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Infra  | <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions Badge" /> <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white"> <img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="NGINX Badge" /> <img src="https://img.shields.io/badge/Naver%20Cloud-03C75A?style=for-the-badge&logo=naver&logoColor=white" alt="Naver Cloud Badge" />                                                                                                                                                                                                                                            |
| DB     | <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Common | <img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge" /> <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint Badge" /> <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white" alt="Prettier Badge" /> <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge" /> <img src="https://img.shields.io/badge/yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white" alt="GitHub Badge" /> |

[🚩 FE 기술 선택 이유](https://github.com/boostcampwm-2024/web17-juchumjuchum/wiki/%F0%9F%9A%A9-FE-%EA%B8%B0%EC%88%A0-%EC%84%A0%ED%83%9D%EC%9D%B4%EC%9C%A0)

[📡 BE 기술 선택 이유](https://github.com/boostcampwm-2024/web17-juchumjuchum/wiki/%F0%9F%93%A1-BE-%EA%B8%B0%EC%88%A0-%EC%84%A0%ED%83%9D-%EC%9D%B4%EC%9C%A0)

[🛠️ 인프라 기술 선택 이유](https://github.com/boostcampwm-2024/web17-juchumjuchum/wiki/%F0%9F%9B%A0%EF%B8%8F-%EC%9D%B8%ED%94%84%EB%9D%BC-%EA%B8%B0%EC%88%A0-%EC%8A%A4%ED%83%9D-%EC%84%A0%ED%83%9D-%EC%9D%B4%EC%9C%A0)

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
