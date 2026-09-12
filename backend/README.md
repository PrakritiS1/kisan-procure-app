# KisanProcure Spring Boot Backend

Spring Boot 3.5.16 + Java 21 + Spring Security/JWT + Spring Data JPA + MySQL.

## Run
1. Create/update MySQL credentials in `src/main/resources/application.yml`.
2. Ensure database user/password are correct.
3. Run: `mvn spring-boot:run`

Demo farmer: `9876543210` / `123456`

## Project structure
- controller: REST endpoints
- dto: request/response contracts
- entity: JPA database models
- repository: Spring Data repositories
- service: business logic and transactions
- security: JWT generation/filter
- config: security/CORS/data seed
- exception: API error handling

## Important behavior
`POST /api/bookings` performs the capacity check and increments `slots.booked_capacity` inside a transaction. In production, use pessimistic locking or another atomic reservation strategy on the slot row to prevent race-condition overbooking under concurrent requests.

The two `/ai/*` endpoints currently use a simple local implementation so the backend runs without a Python service. Replace `AiService` with a WebClient/Feign call to your FastAPI ML service when the ML model is ready.
