# Spring Boot Hello World Example – Thymeleaf



## 1. How to start locally
1. Install maven - https://maven.apache.org/download.cgi
2. Run the following command in this folder:
```
$ mvn clean install
```
3. Run the following command in this folder:
```
$ mvn spring-boot:run
```

## How to deploy to server (server already set up)

1. rsync -r ./src root@185.80.0.191:/root/reklamni-materiali

2. ssh root@185.80.0.191

2.1 cd reklamni-materiali