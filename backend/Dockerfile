# ═══════════════════════════════════════════════════════════════
# Multi-stage build - Wedding Platform API
# ═══════════════════════════════════════════════════════════════

# Stage 1: Build with Gradle
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Install Gradle
ENV GRADLE_VERSION=8.5
RUN apt-get update && apt-get install -y --no-install-recommends unzip curl && \
    curl -fsSL "https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip" -o gradle.zip && \
    unzip -q gradle.zip -d /opt && \
    rm gradle.zip && \
    ln -s /opt/gradle-${GRADLE_VERSION}/bin/gradle /usr/bin/gradle && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy build files first (dependency cache layer)
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon 2>/dev/null || true

# Copy source and build
COPY src ./src
RUN gradle bootJar --no-daemon -x test

# Stage 2: Runtime
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN groupadd -r app && useradd -r -g app app
USER app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/actuator/health || exit 1
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
