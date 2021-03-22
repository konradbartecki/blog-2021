---
title: How to test simple cpp programs and fake standard input/output
date: '2021-03-22'
tags: ['cpp', 'testing']
draft: false
summary: Faking `cout` and `cin` in C++ with Google Test
---

### TL:DR

Assuming you will go through JetBrains unit testing tutorial:
https://www.jetbrains.com/help/clion/unit-testing-tutorial.html#adding-framework

`MyLib/TaskTwo.cpp`

```cpp
//Write a program reading integers until zero is entered and printing the length of the longest sequence of consecutive numbers of the same value (and this value).


#include "TaskTwoResult.h"
#include <iostream>
using namespace std;

class TaskTwo { ;
public:
    TaskTwo() {

    }

    TaskTwoResult getLongestSequence(istream &std_input,
                                     ostream &std_output,
                                     ostream &result_output) {
        int largestToken = 0;
        int largestTokenOccurences = 0;
        int currentToken = 0;
        int currentOccurences = 0;

        std_output << "Please enter an integer value or enter 0 to stop" << endl;

        while (true) {
            int token = 0;
            std_output << "Enter value:";
            std_input >> token;
            if (token == 0) {
                result_output << "Longest sequence: " << largestTokenOccurences << " times " << largestToken;
                return {
                    largestToken,
                    largestTokenOccurences
                };
            }

            const bool isNewToken = token != currentToken;
            if (isNewToken) {
                currentToken = token;
                currentOccurences = 1;
            } else {
                currentOccurences++;
            }

            if (currentOccurences > largestTokenOccurences) {
                largestTokenOccurences = currentOccurences;
                largestToken = currentToken;
            }
        };
    }
};

```

### `Google_Test/MyTests.cpp`
```cpp
#include <gtest/gtest.h>
#include "TaskTwo.cpp"

using namespace std;



//This is just a group -> test name so it will later be reflected in your IDE unit testing window as a tree:
// getLongestSequence
//   | - Test1
//   | - Test2
//   | - Test3
TEST(getLongestSequence, Test1){
    //for input: 22 22 22 22 3 3 3 2 -6 -6 -6 0
    string test_input = "22\n22\n22\n22\n3\n3\n3\n2\n-6\n-6\n-6\n0";
    string expected = "Longest sequence: 4 times 22";

    stringstream fake_input(test_input);
    ostringstream fake_output;
    ostringstream fake_result_output;

    TaskTwoResult result = TaskTwo().getLongestSequence(fake_input, fake_output, fake_result_output);

    string actual = fake_result_output.str();
    EXPECT_EQ(expected, actual);
}
```

## See also:
- Source code: https://github.com/konradbartecki/cpp-stdin-out-tests
- https://www.jetbrains.com/help/clion/unit-testing-tutorial.html#adding-framework

