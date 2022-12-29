## A boilerplate for authentication in nodejs
- register (fullname, email, password)
    - POST /auth/register
- login (email,password)
    - POST /auth/login
- logout
    - GET /auth/logout
- change-password(email, oldPassword, newPassword)
    - POST /auth/change-password
- refresh-token
    - GET /auth/refresh-token

### 1. npm install
### 2. create .env file
    - PORT=3000
    - LOCAL_DB=mongodb://localhost/db_name
    - ACCESS_SECRET_KEY=
    - REFRESH_SECRET_KEY=
    - ACCESS_EXPIRY='15m'
    - REFRESH_EXPIRY='1h'