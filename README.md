ssu_scheduler
=============

Installation(ubuntu)
============

Installation is pretty simple

  1. Get nodejs:
  ```
    sudo apt-get update
    sudo apt-get install nodejs
  ```

  2. Get meteor:
  ```
    curl https://install.meteor.com/ | sh
  ```
    This will install meteor and the meteor package manager on your machine.

  3. Get Mongodb
  ```
    sudo apt-get install mongodb
  ```

  4. Download the scheduler app
    ```
    git clone https://github.com/Alfwich/ssu_scheduler.git
    ```

  5. Insert classes into the mongodb database
  First you need to have the meteor application to access the mongo database. So from the root of the project repo run the following command
  ```
    meteor
  ```

  This will run the meteor package manager ( similar to doing a apt-get update ) then spin up the scheduler application.
  The app should build and start without any problem; however, there will be no course data yet. Run the following commands to insert the data
  ```
  cd scripts
  mongoimport -h localhost:3001 --db meteor --collection Courses --type json --jsonArray --file courses.json
  ```
Installation(osx)
============
  Installation is similar to ubuntu

  0. Get Brew:
    https://github.com/Homebrew/homebrew
    Package manager for osx.

  1. Get nodejs:
  ```
    brew install node
  ```

  2. Get meteor:
  ```
    curl https://install.meteor.com/ | sh
  ```
    This will install meteor and the meteor package manager on your machine.

  3. Get Mongodb
  ```
    brew install mongodb
  ```

  4. Same as Ubuntu
  5. Same as Ubuntu

Update Database
===============

To update DB with new data:

Get rid of old data:
meteor
meteor mongo
db.Courses.remove()

Import new data from json:
mongoimport -h localhost:3002 --db meteor --collection Courses --type json --jsonArray --file courses.json

