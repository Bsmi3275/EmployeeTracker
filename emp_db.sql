DROP DATABASE IF EXISTS emp_db;
CREATE DATABASE emp_db;
USE emp_db;

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NULL,
    manager_id INT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL,
    occcupation VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    dept_id INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE dept (
    id INT AUTO_INCREMENT NOT NULL,
    dept_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);




