$env:DB_PASSWORD = 'Shweta@26'
$env:DB_URL = 'jdbc:mysql://localhost:3306/authdb?useSSL=false&allowPublicKeyRetrieval=true'
java -jar D:\signupPage\registerPage\backend\target\auth-service-0.0.1-SNAPSHOT.jar 2>&1 | Tee-Object -FilePath D:\signupPage\registerPage\backend\app2.log
