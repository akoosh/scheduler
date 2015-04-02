#!/usr/bin/python

import csv, sys, json, string, hashlib, os, subprocess, time, urllib2

from coursesToJson import main as cTJ
from studentsToJson import main as sTJ
from coursesToClassesJson import main as cTCJ

def meteorOn( url, port):
  result = False

  try:
    response = urllib2.urlopen('http://%s:%s'%(url,port), timeout=1)
    result = True
  except urllib2.URLError as err: 
    pass

  return result

def main():
  with open( "config.json", "r" ) as config:
    cfg = json.load( config )
    if meteorOn( cfg["MeteorAddress"], cfg["MeteorPort"] ):
      writeTime = str( int(time.time()) )

      if "CourseData" in cfg and "SupCourseData" in cfg:
        if os.path.isfile( cfg["CourseData"] ) and os.path.isfile( cfg["SupCourseData"] ):
          print "Generating course data..."
          cTJ( cfg["CourseData"], cfg["SupCourseData"] )
          print "Done."

          print "Generating class data..."
          cTCJ()
          print "Done."

          print "Importing class data into mongo..."
          os.system( "mongoimport -h %s:%s --drop --db %s --collection Classes --type json --jsonArray --file classes.json && mv classes.json bkup/classes.%s.json" % ( cfg["MeteorAddress"], cfg["MeteorMongoPort"], cfg["MeteorDB"], writeTime ) )
          print "Done."


      if "StudentData" in cfg:
        if os.path.isfile( cfg["StudentData"] ):
          print "Generating student data..."
          sTJ( cfg["StudentData"] )
          print "Done."

          print "Importing student data into mongo..."
          os.system( "mongoimport -h %s:%s --drop --db %s --collection Students --type json --jsonArray --file students.json && mv students.json bkup/students.%s.json" % ( cfg["MeteorAddress"], cfg["MeteorMongoPort"], cfg["MeteorDB"], writeTime ) )
          print "Done."

    else:
      print "The Meteor server needs to be running to allow access to the database"
    

if __name__ == "__main__":
  main()
