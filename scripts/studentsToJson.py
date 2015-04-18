import csv, sys, json, string, hashlib

def strip_whitespace(row):
    for k in row.keys():
        row[k] = row[k].strip()

# Returns the first matched key from a dict based on the passed values array
def getValue( row, values, default='' ):

  result = default
  if not isinstance( values, list ):
    values = [values]

  for value in values:
    if value in row:
      result = row[value]
      break

    
  return result

def main( arg1 ):

  if arg1 == None:
    arg1 = sys.argv[1]

  with open(arg1) as csvfile:
    result = []
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')

    for row in reader:
      strip_whitespace( row )
      
      studentId = getValue(row, ["StudentId"] ).zfill(9);
      hasher = hashlib.md5(  )
      result.append( {
        "access" : True,
        "id"     : hasher.hexdigest()
      })

    with open("students.json", "w" ) as f:
      f.write( json.dumps(result) ) 

if __name__ == "__main__":
  main(None)
