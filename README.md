# CarParkingAPIs

#### Simple carparking management APIs built using NodeJS, Express Framework and MongoDB as database

## Installation

1. Change termial directory to where _package.json_ file is located and Run following command

    ```sh
    npm install
    ```

2. To start the server

    ```sh
    npm start
    ```

3. To start the server in dev mode

    ```sh
    npm run dev
    ```

4. To start the server in testing mode

    ```sh
    npm start
    ```

## API points

### 1. First Task API end point is POST on "/parkCar"

This end point excepts a Car number as input and if there is any Parking Slot available the allot that Slot to this car.

Input format (`carNo`)
    

### 2. Second Task API end point is POST on "/unparkCar"

This end point excepts a Slot number as input and if any car is parked on that slot then remove that car and make that slot available for other cars.

Input format (`slotNo`)

### 3. Third Task API end point is GET on "/"

This end point excepts either Slot number or Car number and returns a both Car Number and Slot Number both for the input.

Input format (`carNo/slotNo`)

## .ENV

.env file contains two variables

1. ParkingCapacity
2. MongoURI :- I am give my MongoDB Atlas UIR for assesment, if you want you can put your MongoDB URI here.
3. PORT :- If not mentioned the server will run on _localhost:5000_ by default

## Created by
 Aditya
 LinkedIn(`https://www.linkedin.com/in/adityakumawat51/`)
 Email(`adityakumawat51@gmail.com`)