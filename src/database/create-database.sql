CREATE DATABASE
    [authentication - api] GO
USE [authentication - api] GO
CREATE TABLE
    "users" (
        "email" nvarchar(255) NOT NULL,
        "password" nvarchar(255) NOT NULL,
        "verifyCode" nvarchar(255) NOT NULL,
        "isVerified" bit NOT NULL,
        CONSTRAINT "PK_97672ac88f789774dd47f7c8be3" PRIMARY KEY ("email")
    )