## 과제 요약

- 콘서트 티켓팅 서비스를 구현합니다.
- 유저들이 효과적으로 예약 서비스를 이용할 수 있게 대기열 시스템을 구축하고, 가용 가능한 인원들만 예약 서비스를 이용할 수 있게 합니다.
- 동일한 좌석에 접근하는 유저의 동시성을 고려하고, 이미 선점한 좌석에 대해 다른 유저들이 접근할 수 없도록 합니다.
  

## 주요 구현 내용

- 콘서트 예약 가능한 날짜/좌석 조회, 좌석 예약을 하기 위해서는 토큰 검증을 거쳐야 합니다.
- 토큰 발급 시 예약 서비스를 이용할 수 있는 시각과 토큰 만료 시각을 함께 저장합니다.
- 예약 서비스로의 접근을 효과적으로 제어하기 위해 유저들을 사이클 별로 관리합니다.
    - 분당 예약을 처리할 수 있는 건수를 10개로 가정합니다
        - 시스템 성능과 같은 사항을 고려해야 할 것 같지만 관련 경험이 없어 일단 위의 숫자로 가정했습니다.
    - 한 사이클 당 예약 가능한 시간을 5분으로 설정하면 5분에 50개의 예약을 처리할 수 있다고 가정하여 한 사이클 당 50명씩 접근 가능하도록 하고, 초과했을 경우 다음 사이클에 배정시킵니다.
- 따라서, 유저는 토큰을 발급 받을 때, 대기열의 인원수를 통해 아래와 같이 서비스 이용 시작 시각과 만료 시각을 계산하여 토큰과 함께 정보를 저장합니다.
    - 서비스 이용 가능 시각: 요청 시각 + 대기열 인원 수 // 50 * 5분
    - 토큰 만료 시각: 서비스 이용 시각 + 5분
- 대기열 인원 수가 커질수록(사이클 번호가 커지기 때문에) 의미 없이 대기해야 하는 시간이 높아지기 때문에 대기열 인원 수를 갱신할 때, 마지막 토큰의 만료 시각에 대기열 인원 수를 초기화 할 수 있도록 합니다.
- 유저는 polling을 통해 자신의 토큰 정보를 조회하여 서비스를 이용할 수 있는 유효한 상태인지 확인하고, 유효할 경우 예약 가능 날짜 및 좌석 조회, 예약 요청을 할 수 있습니다.
    - 아직 이용 가능한 시각에 도달하지 못했을 경우 대기해야 하는 시간과 함께 클라이언트에게 반환합니다.
- 대기열 인원 수와 token 정보는 redis에서 관리하여 유저들의 많은 수의 polling 요청이 데이터베이스에 도달하기 전에 어플리케이션 레벨에서 처리할 수 있도록 할 생각입니다.
    - token과 같이 휘발성 데이터에 대해 빠른 속도로 처리해야 하는 것의 특성상 redis에 저장하는 것이 유효하다고 판단함.
    - token에는 예약 서비스 이용 가능 시각과 만료 시각을 같이 저장합니다. 따라서, 유저는 토큰을 조회해서 자신이 예약 서비스를 이용할 수 있는 상태인지 여부를 판단하게 됩니다.
- 포인트 충전 및 사용은 user 별 요청이 매우 잦게 올 것이라고 판단하지 않기 때문에 낙관적 락을 통해 구현할 생각입니다.
- 좌석에 대한 예약은 동일한 좌석으로의 요청이 다수 있을 것으로 판단되어 비관적 락으로 구현할 계획입니다.
  

## 시퀀스 다이어그램
1. 토큰 유효성 검증
   
   ```mermaid
   sequenceDiagram
    autonumber
    actor cl as Client
    participant Server
    participant Redis

    cl ->> Server: 토큰 유효성 검증 요청
    activate Server

    Server ->> Redis: 토큰 조회

    Redis -->> Server: 토큰 정보(대기열 정보)

    deactivate Server

    alt 토큰이 존재하지 않는 경우
        Server -->> cl: TokenNotFoundException
        cl ->> Server: 토큰 발급 요청
        Server -->> cl: 발급한 토큰 반환
    else 이용 시간 이전인 경우
        Server -->> cl: 대기중 및 대기시간 반환
    else 토큰이 만료된 경우
        Server -->> cl: TokenExpiredException
    end
   ```

2. 예약 서비스

   ```mermaid
       sequenceDiagram
        autonumber
        actor cl as Client
        participant Server
        
        note over cl, Server: 예약 가능한 날짜 조회
    
        cl ->> Server: 토큰 유효성 검증
        Server -->> cl: 유효한 토큰 응답
    
        note over Server: 토큰 유효성 검증 성공 가정, 실패 시 토큰 유효성 검증 flow에 따라 대기
    
        cl ->> Server: 예약 가능 날짜 조회
        Server -->> cl: 예약 가능한 날짜를 배열 형태로 반환하고, 없을 경우 빈 배열 반환
    
    
        note over cl, Server: 예약 가능한 좌석 조회
    
        cl ->> Server: 토큰 유효성 검증
        Server -->> cl: 유효한 토큰 응답
    
        note over Server: 토큰 유효성 검증 성공 가정, 실패 시 토큰 유효성 검증 flow에 따라 대기
    
        cl ->> Server: 예약 가능 좌석 조회
        Server -->> cl: 예약 가능한 좌석을 배열 형태로 반환하고, 없을 경우 빈 배열 반환
    
        note over cl, Server: 좌석 예약 요청
    
        cl ->> Server: 토큰 유효성 검증
        Server -->> cl: 유효한 토큰 응답
    
        note over Server: 토큰 유효성 검증 성공 가정, 실패 시 토큰 유효성 검증 flow에 따라 대기
    
        cl ->> Server: 좌석 예약 요청
        
        alt 좌석 예약이 가능한 경우
            Server -->> cl: true를 반환하고, 5분간 좌석 임시 배정
        else 이미 좌석이 선점된 경우
            Server -->> cl: AlreadyAssignedSeatsException
        end
   ```

3. 결제 요청

   ```mermaid
       sequenceDiagram
        autonumber
        actor cl as Client
        participant Server
        
        note over cl, Server: 잔액 조회
    
        cl ->> Server: 잔액 조회 요청
        Server -->> cl: 잔액 반환
    
        note over cl, Server: 잔액 충전
    
        cl ->> Server: 잔액 충전 요청
        Server -->> cl: 갱신된 잔액 반환
    
        note over cl, Server: 결제 요청
    
        cl ->> Server: 결제 요청
    
        alt 결제 성공
            Server ->> cl: true 반환
        else 잔액 부족
            Server -->> cl: 잔액 부족 exception
        else 결제 유효 시간이 지난 경우
            Server -->> cl: 유효 시간 만료 exception
        end
   ```


## API 명세

1. 토큰 발급 요청, POST
    1. 경로: /reservations/token
    2. 요청 데이터:
        
        ```jsx
        {
            userId: number,
            concertId: number,
        }
        ```
        
    3. 응답 데이터: token

1. 토큰 유효성 검증 요청, GET
    1. 경로: /reservations/token/validation?reservationToken=Token
    2. 응답 데이터:
        
        ```jsx
        {
            status: 'avaliable' | 'pending'
            waitingTime: number | null
        }
        ```
        
    3. 예외 케이스
        1. 토큰이 존재하지 않는 경우
            - TokenNotFoundException 발생
        2. 이용 시간 이전인 경우
            - status: pending, watingTime: 대기시간 응답
        3. 토큰이 만료된 경우
            - TokenExpiredException 발생
2. 예약 가능 날짜 조회, GET
    1. 토큰 유효성 검증을 통과한 후에 요청 가능
    2. 경로: /reservations/:consertId/available-dates
    3. 응답 데이터:
        
        ```jsx
        {
            concertEventId: number,
            startDate: Date,
            maxSeatCapacity: number,
            currentSeatCount: number,
        }[]
        // 예약 가능한 날짜가 없는 경우 빈 배열을 반환함.
        ```
        

1. 예약 가능 좌석 조회, GET
    1. 토큰 유효성 검증을 통과한 후에 요청 가능
    2. 경로: /reservations/:concertEventId/available-seats
    3. 응답 데이터:
        
        ```jsx
        {
            concertEventId: number;
            availableSeats: {
                        seatsId: number;
                        seatsNumber: number;
                    }[];
        }
        // 예약 가능한 좌석이 없는 경우 빈 배열을 반환함.
        ```
        
    

1. 좌석 예약 요청, POST
    1. 토큰 유효성 검증을 통과한 후에 요청 가능
    2. 경로: /reservations/seats/:seatsId/assign
    3. 요청 데이터:
        
        ```jsx
        {
            concertEventId: number;
        }
        ```
        
    4. 응답 데이터: boolean
    5. 예외 케이스
        1. 해당 좌석이 이미 선점된 경우 AlreadyAssignedSeatsException

1. 잔액 조회, GET
    1. 경로: /points/users/:userId
    2. 응답 데이터: number

1. 잔액 충전, POST
    1. 경로: /points/users/:userId/charge
    2. 요청 데이터:
        
        ```jsx
        {
            amount: number;
        }
        ```
        
    3. 응답 데이터: number

1. 결제, POST
    1. 경로: /payment/:reservationId
    2. 응답 데이터: boolean
    3. 예외 케이스:
        1. 결제 유효 시간이 지난 경우
        2. 잔액이 부족한 경우
