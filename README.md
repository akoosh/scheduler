ssu_scheduler
=============

Ssu Scheduler

To update DB with new data:

Get rid of old data:
meteor
meteor mongo
db.Courses.remove()

Import new data from json:
mongoimport -h localhost:3002 --db meteor --collection Courses --type json --jsonArray --file courses.json
