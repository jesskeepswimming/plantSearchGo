# plant-sta
Fall 2021 Shopify Developer Challenge

Visit the live site at https://plant-sta-client.herokuapp.com/

Server documentation: https://documenter.getpostman.com/view/11692926/TzRSfSTH

To run tests: 

1. log in + make a test database in postgreSQL
2. cd server
3. add an .env file to the server directory
```
DB_USER="youruser"
DB_PASSWORD="yourpassword"
DB_HOST="your localhost"
DB_PORT="your database port"
DB_TEST="your test database"
 ``` 
 4. npm test
