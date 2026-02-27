FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /workspace

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw -q -DskipTests dependency:go-offline

COPY src ./src
RUN ./mvnw -q -DskipTests package

RUN JAR_FILE="$(find target -maxdepth 1 -type f -name '*.jar' ! -name '*.jar.original' | head -n 1)" \
    && test -n "$JAR_FILE" \
    && mkdir -p /workspace/extracted \
    && cd /workspace/extracted \
    && jar -xf "/workspace/${JAR_FILE}" \
    && mv BOOT-INF/classes /workspace/classes \
    && mv BOOT-INF/lib /workspace/lib

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /workspace/classes ./classes
COPY --from=build /workspace/lib ./lib

EXPOSE 8080

ENTRYPOINT ["java", "-cp", "/app/classes:/app/lib/*", "org.isaclarsen.backend.BackendApplication"]
