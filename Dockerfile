FROM maven:3.8.6-openjdk-8
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package

EXPOSE 8080
ENTRYPOINT ["java","-jar","/home/app/target/Planner.jar"]
