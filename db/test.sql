--Selects all departments.
SELECT* FROM department;

--Selects all roles
SELECT * FROM role;

--Selects all Employees data
SELECT 
    employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    department.name AS department_name,
    role.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
FROM 
    employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;

--Adds a Department
INSERT INTO department (name) 
    VALUES  ('Dairy');

--Adds a Role
INSERT INTO role (title, salary, department_id)
    VALUES  ('Meat Cleaner', 25000, 3);

--Adds an Employee
INSERT INTO employee (first_name, last_name, role_id)
VALUES  ('Gerald', 'McPherson', 9);

--Updates an employees role.
UPDATE employee
SET role_id = 7
WHERE id = 12;

--Updates an employees manager.
UPDATE employee
SET manager_id = 8
WHERE id = 12;

--Views only from certian Depts
SELECT 
    employee.first_name,
    employee.last_name
FROM 
    employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
WHERE 
    department.name = 'Frozen';


--Deletes Depts
DELETE FROM department
WHERE id= 1;

--Deletes Roles
DELETE FROM role
WHERE id= 1;

--Deletes employees
DELETE FROM employee
WHERE id= 1;

--Views the total salary!

SELECT 
    department.name AS department_name,
    SUM(role.salary) AS total_salary
FROM 
    employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
WHERE 
    department.name = 'Your Department Name'
GROUP BY 
    department.name;

