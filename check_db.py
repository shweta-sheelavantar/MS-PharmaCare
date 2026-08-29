import pymysql

connection = pymysql.connect(
    host='localhost',
    user='root',
    password='Shweta@26',
    database='auth_db',
    cursorclass=pymysql.cursors.DictCursor
)

with connection:
    with connection.cursor() as cursor:
        cursor.execute("SELECT product_id, name, category_id, price FROM products ORDER BY product_id")
        for row in cursor.fetchall()[:70]:
            print(row)
