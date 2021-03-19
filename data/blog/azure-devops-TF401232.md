---
title: TF401232 - WorkItem XXX doesn’t exist – Azure DevOps
date: '2021-03-19'
tags: ['azure-devops']
draft: false
summary: How to fix TF401232 when importing CSV work items in Azure DevOps
---

When you are moving work items between projects/organizations then you should make ID column empty in your CSV file.

Let's say you have following csv file:

```bash
ID,Work Item Type,Title 1 ,Title 2,State,Effort,Business Value,Value Area,Tags
"1","Feature","DevOps",,"New",,,"Business",
"2","Feature","User account",,"New",,,"Business",
"3","User Story",,"As a User, I can create my own account","New",,,"Business",
"4","User Story",,"As a User, I can login to application","New",,,"Business",
"5","User Story",,"As a User, I can change my password","New",,,"Business",
"","User Story",,"As a User, I can logout from application","New",,,"Business",
```

**Make the ID column empty, so new IDs can be assigned automatically by DevOps** so it looks like this:

```bash
ID,Work Item Type,Title 1,Title 2,State,Effort,Business Value,Value Area,Tags
"","Feature","DevOps",,"New",,,"Business",
"","Feature","User account",,"New",,,"Business",
"","User Story",,"As a User, I can create my own account","New",,,"Business",
"","User Story",,"As a User, I can login to application","New",,,"Business",
"","User Story",,"As a User, I can change my password","New",,,"Business",
"","User Story",,"As a User, I can logout from application","New",,,"Business",
```