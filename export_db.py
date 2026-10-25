import mysql.connector

def export_database():
    conn = mysql.connector.connect(host='localhost', user='root', password='Shweta@26', database='auth_db')
    cursor = conn.cursor()

    cursor.execute('SHOW TABLES')
    tables = [row[0] for row in cursor.fetchall()]

    with open('backup_auth_db.sql', 'w', encoding='utf-8') as f:
        f.write('-- Backup of auth_db for MS-PharmaCare\nSET FOREIGN_KEY_CHECKS = 0;\n\n')
        for table in tables:
            cursor.execute(f'SHOW CREATE TABLE `{table}`')
            create_sql = cursor.fetchone()[1]
            f.write(f'DROP TABLE IF EXISTS `{table}`;\n')
            f.write(create_sql + ';\n\n')
            
            cursor.execute(f'SELECT * FROM `{table}`')
            rows = cursor.fetchall()
            if rows:
                cursor.execute(f'DESCRIBE `{table}`')
                cols = [col[0] for col in cursor.fetchall()]
                col_names = ', '.join([f'`{c}`' for c in cols])
                
                for row in rows:
                    vals = []
                    for v in row:
                        if v is None:
                            vals.append('NULL')
                        elif isinstance(v, (int, float)):
                            vals.append(str(v))
                        else:
                            escaped = str(v).replace('\\', '\\\\').replace("'", "\\'")
                            vals.append(f"'{escaped}'")
                    val_str = ', '.join(vals)
                    f.write(f"INSERT INTO `{table}` ({col_names}) VALUES ({val_str});\n")
                f.write('\n')
        f.write('SET FOREIGN_KEY_CHECKS = 1;\n')
    print('Export complete! Generated backup_auth_db.sql')

if __name__ == '__main__':
    export_database()
