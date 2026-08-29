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
        cursor.execute("""
            UPDATE products 
            SET category_id = 2 
            WHERE name IN (
                'Ensure Nutrition Powder 400g', 
                'Horlicks Classic 500g', 
                'Protinex Original 400g', 
                'Pediasure Vanilla 400g'
            ) AND category_id = 1
        """)
        connection.commit()
        print(f"Updated {cursor.rowcount} rows.")
