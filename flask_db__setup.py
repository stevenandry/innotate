import sys
import psycopg2
 
con = None
 
try:
    cur = con.cursor()
    cur.execute("CREATE TABLE files(id serial, name TEXT, data TEXT, canvas_image TEXT)")
     
    con.commit()
 
except psycopg2.DatabaseError, e:
    print 'Error %s' %e
    sys.exit(1)
 
finally:
    if con:
        con.close()