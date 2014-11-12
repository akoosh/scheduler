import sys, json

def main():
  with open( "courses.json" ) as jsonData:
    courses = json.load( jsonData )
    cSet = set()
    result = []
    for course in courses:
      for c in course["classes"]:
        if c["number"] in cSet:
          print( "DUPLICATE class with number: " + str(c) )
        else:
          cSet.add( c["number"] )
          result.append( c )

    f = open('classes.json', 'w')
    f.write( json.dumps( result ) )
        

main()
