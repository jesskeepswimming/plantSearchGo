# plantSearchGo


## Visit the live site at 
https://plantsearchgo.herokuapp.com/

## How It Works:
1. Browse the map using shift + arrow keys. Click on red dots to see community plant submissions.
2. To add, identify, and track your plants, create an account.
3. Upload a picture of a plant at your map location and our software will identify the plant for you using computer vision!
4. Confirm your submission and your plant will appear on the map as a red dot!

## To run locally: 

backend:
1. cd server
2. add an .env file to the server directory
```
DB_USER="youruser"
DB_PASSWORD="yourpassword"
DB_HOST="your localhost"
DB_PORT="your database port"
DB_TEST="your test database"
 ``` 
3. nodemon index

frontend:
1. cd client
2. npm start

## Future Improvements

- front end will be hosted on mobile, take real time GPS location

Created using Node/Express, React, PostgresSQL, and Firebase Auth. 
