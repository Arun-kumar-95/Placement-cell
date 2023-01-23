
# Placement Cell

Hello there!! 
 
I designed an Web App for the companies to keep the track of all the student database. This project holds the functionality of download the data in csv format.

 


## How to setup project locally:

To setup the files locally on a system follow these simple steps.

step 1: 

- Visit this url: https://github.com/Arun-kumar-95/Placement-cell
- live DOC at https://arun-kumar-95.github.io/Placement-cell/

Step: 2

- Download the zip file and extract it 
- Open the file with your favourite editor

Step: 3

- Open the open and terminal, use "npm install" to install all dependencies or packages
- Then Go to the directory: src/config. There Create a file config.env. 


Note: file name must be same dont try to change it.


Step: 4

- Inside config.env set few parameters as
- PORT = 4000
- DATABASE_NAME = "your own database name"
- DATABASE_URL = 'mongodb://localhost:27017'
- JWT_SECRET = 'your own secret key'
- JWT_EXPIRES = '7d'


- TWILIO_SID = 'your twilio sid '
- TWILIO_AUTH_TOKEN = 'your twilio auth token'
- TWILIO_PHONE = 'your twilio phone number'

Note: don't try to change this  DATABASE_URL





## How to start server

- Go to package.json file
- Add script such as:  
"start": "nodemon ./src/index.js"

- Finally go on the terminal 
- To start the server use npm start which shows an message to listening on port ___
## Let's Talk About Routes

These are the routes which you will fing in this peoject ans their uses.

- localhost/4000/ => where you will login using email and password.
- /register => where you can register yourself
- /verify => once you are logged in using you email and password you will receice an 4 digit otp on your registered phone number.
enter your otp and if it is correct then you are authenticatd and token will be generated.
- /dashboard => once you are verified via otp ypu will be redirected to dashboard page.
- /dashboard/registerstudent => Here you can register a new student
- /dashboard/createinterview => Here you can create a new interview
- /dashboard/allstudents => Here you can filter student , and delete a student
- dashboard/registerstudent/id => Here you can update any student details
- /dashboard/profile/uid=id&name=name  =>  This route will send to the profile of the particular student andcheck his/her activity

On profile page you can apply fot the particular interview create the report of that interview for particulat student.

- /dashboard/interviews => Here you can see all the list of interview sorted in new to old order. Which student has applied for which company and what is the status of the student either placed or not placed.


## Authors

- Arun kumar: https://github.com/Arun-kumar-95

- It was an awesome exprerience :) to create an Placement cell web app for helping companied to keep the record of the student records.


