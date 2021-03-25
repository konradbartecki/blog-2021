---
title: Setting up CI/CD on GitLab for Java projects with Maven (2021)
date: '2021-03-25'
tags: ['devops', 'java']
draft: false
summary: Automate builds and unit testing on external machine for OpenJDK 15 + Maven 3.6
---

## Environment

- GitLab (free, managed)
- JUnit 5.4
- OpenJDK 15
- Java Lang 15
- IntelliJ
- Maven 3.6

## Preparing your project

Ensure you have `pom.xml` file ready.
You can add it using IntelliJ right click on project > Add Framework Support > Maven.

### Project tree

```java
├── pom.xml
| //important - marked as test directory below in pom.xml
├── src
│   ├── HumanResourcesStatistics.java
│   ├── builders
│   │   ├── DateBuilder.java
│   │   ├── IEmployeeBuilder.java
│   │   ├── ManagerBuilder.java
│   │   ├── TraineeBuilder.java
│   │   └── WorkerBuilder.java
│   ├── model
│   │   ├── Employee.java
│   │   ├── Manager.java
│   │   ├── PayrollEntry.java
│   │   ├── Person.java
│   │   ├── Trainee.java
│   │   └── Worker.java
│   └── utils
│       ├── FakeClock.java
│       ├── IClock.java
│       └── SystemClock.java
| //important - marked as test directory below in pom.xml
└── test
    ├── Utp2Test.java
    └── Utp3Test.java
```

### Telling Maven where sources and tests are located using `pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>XYZ</groupId>
    <artifactId>XYZ</artifactId>
    <version>1.0-SNAPSHOT</version>
    <build>
        <!-- important, set dir names to reflect your project directory tree as shown above -->
        <sourceDirectory>src</sourceDirectory>
        <testSourceDirectory>test</testSourceDirectory>
    </build>
    <dependencies>
        <dependency>
            <groupId>org.javatuples</groupId>
            <artifactId>javatuples</artifactId>
            <version>1.2</version>
            <scope>compile</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>RELEASE</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>RELEASE</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <properties>
        <maven.compiler.source>15</maven.compiler.source>
        <maven.compiler.target>15</maven.compiler.target>
    </properties>
```

### Ensuring your tests will run

In order for your tests to be run automatically, all of the following conditions must be met:

1. Tests are in a **test directory** marked in `pom.xml`
2. Test class ends with `Test` for example: `MyServiceTest.java`
3. Test class is public `public class MyServiceTest { }`
4. Test method is public
5. Test method is annotated with `@Test` attribute
6. Test method name starts with `test_`

For example:

```java
//file located in PROJECT_DIR/test/MyServiceTest.java

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class MyServiceTest.java
{
    @Test
    public void test_task8b_get_employees_with_totalSalary_biggerThan_1k(){
        var actualEmployees = HumanResourcesStatistics.getEmployeesWithTotalSalaryBiggerThan1k(HumanResourcesStatistics.getAllEmployees());
        var expectedSize = 20;
        assertEquals(expectedSize, actualEmployees.size());
    }
}
```

### Setting up GitLab CI/CD

Add following file named `.gitlab-ci.yml` to your git/project root:

```yml
variables:
  MAVEN_OPTS: '-Dhttps.protocols=TLSv1.2 -Dmaven.repo.local=$CI_PROJECT_DIR/.m2/repository -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=WARN -Dorg.slf4j.simpleLogger.showDateTime=true -Djava.awt.headless=true'
  MAVEN_CLI_OPTS: '--batch-mode --errors --fail-at-end --show-version -DinstallAtEnd=true -DdeployAtEnd=true'

# For other maven/openjdk versions see: https://hub.docker.com/_/maven/
image: maven:3.6.3-openjdk-15
cache:
  paths:
    - .m2/repository
.verify: &verify
  stage: test
  script:
    - 'mvn $MAVEN_CLI_OPTS verify'
verify:openjdk15:
  <<: *verify
```

### Testing Maven locally

You can use IntelliJ Maven window and run each target for example right click -> `test` target and see output:

```java
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running MyServiceTest
Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.068 sec

Results :

Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
```

### Result

Now commit and push your changes and on each commit you should see a GitLab pipleline starting that will compile and run unit tests.

![GitLab screenshot](/static/images/blog/maven2021.png)
