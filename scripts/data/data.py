import csv, json, string, sys

# Returns the first matched key from a dict based on the passed values array
def get( row, values, default='' ):

  result = default
  if not isinstance( values, list ):
    values = [values]

  for value in values:
    if value in row:
      result = row[value]
      break

    
  return result

def sameM( objs ):
  result = same( objs[0], objs[-1] )
  objs.pop()
  while len(objs) > 1:
    result = same( objs[0], objs[-1] )
    objs.pop()
  return result 

def same( a, b ):
  result = {}

  for p in a:
    if p in b and b[p] == a[p]:
      result[p] = a[p]
  return result

def isSame( a, b, errors=0 ):
  result = True

  for p in a:
    if p not in b:
      if errors == 0:
        result = False
        break
      else:
        errors -= 1
    else:
      if a[p] != b[p]:
        if errors == 0:
          result = False
          break
        else:
          errors -= 1


  return result


#def main(arg1=None,arg2=None):
with open( "campus_2015_spring.csv", "r" ) as f:
  classes = []
  reader = csv.DictReader(f, delimiter=',', quotechar='"')
  for row in reader:
    classes.append( row )

  schools = {}
  for s in [ x for x in classes if x["Comb Sect"] != "" ]:
    if s["Descr"] not in schools:
      schools[s["Descr"]] = []
    schools[s["Descr"]].append( s )

  cs = {}
  for school in schools:
    cs[school] = {}
    for c in schools[school]:
      if c["CS Number"] not in cs[school]:
        cs[school][c["CS Number"]] = []
      cs[school][c["CS Number"]].append( c )

  for school in cs:
    for csN in cs[school]:
      l = [ x["Class Nbr"] for x in cs[school][csN] ]
      l.sort()

  sameObj = sameM( [ x for x in classes if x["Class Nbr"] in sys.argv ] )
  for c in classes:
    if isSame( sameObj, same( sameObj, c ), 1 ):
      print c["Class Nbr"]

    
    
    



    

#if __name__ == "__main__":
#  main()
