a boilerplate for authentication in nodejs
- register (fullname, email, password)
> post auth/register
- login (email,password)
> post auth/login
- logout
> get auth/logout
- change-password(email, oldPassword, newPassword)
> post auth/change-password
- refresh-token
> get auth/refresh-token

dont forget to create your .env file
> PORT=3000
> LOCAL_DB=mongodb://localhost/db_name