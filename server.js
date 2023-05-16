const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');


const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '1102',
    database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const mainMenu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'mainPage',
                message: 'What would you like to do?',
                choices: [`View all departments`, 'View all roles', 
                'view all employees', 'Add a department', 'Add a role', 
                'Add an employee', 'Update an employee role','Update employee manager',
                'View employees by department', 'View Total Budget', 'Quit']
            }
        ])
        .then((data) => {
            switch (data.mainPage) {
            case 'View all departments':
                db.query('SELECT * FROM department;', function (err, results) {
                    if (err) {
                        console.error('Error executing query: ', err);
                        return;
                    }
                    console.log(results);
                    mainMenu();
                });
                break;
        
            case 'View all roles':
                db.query('SELECT * FROM role;', function (err, results) {
                    if (err) {
                    console.error('Error executing query: ', err);
                    return;
                }
                console.log(results);
                });
                break;
        
            case 'view all employees':
                db.query(
                `SELECT 
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
                    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`,
                function (err, results) {
                    if (err) {
                        console.error('Error executing query: ', err);
                        return;
                    }
                    console.table(results);
                    mainMenu();
                    }
                );
                
                break;
            
                case 'Add a department':
                    inquirer
                        .prompt([
                        {
                            type: 'input',
                            name: 'deptName',
                            message: 'What do you want the new Department to be called?',
                        },
                    ])
                    .then((data) => {
                        const departmentName = data.deptName;
                        db.query('INSERT INTO department (name) VALUES (?)', [departmentName], function (err, results) {
                            if (err) {
                            console.error('Error executing query: ', err);
                            return;
                        }
                        console.log('Department added successfully.');
                        mainMenu();
                        });
                        
                    });
                    break;
    
                    case 'Add a role':
                        // Retrieve the current departments from the database
                        db.query('SELECT id, name FROM department', function (err, departments) {
                            if (err) {
                            console.error('Error executing query: ', err);
                            return;
                        }
                    
                          // Map the department data to generate the choices array for the prompt
                        const departmentChoices = departments.map((department) => ({
                            value: department.id,
                            name: department.name,
                        }));
                        
                          // Prompt the user for role details, including the department selection
                        inquirer
                            .prompt([
                            {
                                type: 'input',
                                name: 'roleName',
                                message: 'What do you want the new Role to be called?',
                            },
                            {
                                type: 'input',
                                name: 'salary',
                                message: 'How much does this new role make?',
                            },
                            {
                                type: 'list',
                                name: 'deptNumber',
                                message: 'Select the department for the new role:',
                                choices: departmentChoices,
                            },
                            ])
                            .then((data) => {
                                const roleName = data.roleName;
                                const salary = data.salary;
                                const departmentId = data.deptNumber;
                                
                                db.query(
                                'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
                                [roleName, salary, departmentId],
                                function (err, results) {
                                    if (err) {
                                    console.error('Error executing query: ', err);
                                    return;
                                }
                                console.log('Role added successfully.');
                                }
                                );
                            });
                            mainMenu();
                        });
                        break;
                        
                        case 'Add an employee':
                            // Retrieve the current managers from the database
                            db.query('SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM employee', function (err, managers) {
                                if (err) {
                                console.error('Error executing query: ', err);
                                return;
                                }
    
                                // Map the manager data to generate the choices array for the manager prompt
                                const managerChoices = managers.map((manager) => ({
                                value: manager.id,
                                name: manager.manager_name,
                                }));
    
                                // Retrieve the current roles from the database
                                db.query('SELECT id, title FROM role', function (err, roles) {
                                if (err) {
                                    console.error('Error executing query: ', err);
                                    return;
                                }
    
                                // Map the role data to generate the choices array for the role prompt
                                const roleChoices = roles.map((role) => ({
                                    value: role.id,
                                    name: role.title,
                                }));
    
                                // Prompt the user for employee details, including the manager and role selection
                                inquirer
                                    .prompt([
                                    {
                                        type: 'input',
                                        name: 'firstName',
                                        message: 'Enter the first name of the employee:',
                                    },
                                    {
                                        type: 'input',
                                        name: 'lastName',
                                        message: 'Enter the last name of the employee:',
                                    },
                                    {
                                        type: 'list',
                                        name: 'managerId',
                                        message: 'Select the manager for the employee:',
                                        choices: managerChoices,
                                    },
                                    {
                                        type: 'list',
                                        name: 'roleId',
                                        message: 'Select the role for the employee:',
                                        choices: roleChoices,
                                    },
                                    ])
                                    .then((data) => {
                                    const firstName = data.firstName;
                                    const lastName = data.lastName;
                                    const managerId = data.managerId;
                                    const roleId = data.roleId;
    
                                    db.query(
                                        'INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?, ?, ?, ?)',
                                        [firstName, lastName, managerId, roleId],
                                        function (err, results) {
                                        if (err) {
                                            console.error('Error executing query: ', err);
                                            return;
                                        }
                                        console.log('Employee added successfully.');
                                        }
                                    );
                                    });
                                });
                                mainMenu();
                            });
                        break;
                    
                        case 'Update an employee role':
                            // Retrieve the current employees from the database
                            db.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee', function (err, employees) {
                                if (err) {
                                console.error('Error executing query: ', err);
                                return;
                            }
                            
                                // Map the employee data to generate the choices array for the employee prompt
                            const employeeChoices = employees.map((employee) => ({
                                value: employee.id,
                                name: employee.full_name,
                            }));
                        
                                // Retrieve the current roles from the database
                            db.query('SELECT id, title FROM role', function (err, roles) {
                                if (err) {
                                console.error('Error executing query: ', err);
                                return;
                                }
                        
                                // Map the role data to generate the choices array for the role prompt
                                const roleChoices = roles.map((role) => ({
                                    value: role.id,
                                    name: role.title,
                                }));
                        
                                // Prompt the user to select an employee and a new role
                                inquirer
                                    .prompt([
                                    {
                                        type: 'list',
                                        name: 'employeeId',
                                        message: 'Select the employee to update:',
                                        choices: employeeChoices,
                                    },
                                    {
                                        type: 'list',
                                        name: 'roleId',
                                        message: 'Select the new role for the employee:',
                                        choices: roleChoices,
                                    },
                                ])
                                .then((data) => {
                                    const employeeId = data.employee_Id;
                                    const roleId = data.role_Id;
                                    
                                    // Update the employee's role in the database
                                    db.query(
                                        'UPDATE employee SET role_id = ? WHERE id = ?',
                                        [roleId, employeeId],
                                        function (err, results) {
                                        if (err) {
                                            console.error('Error executing query: ', err);
                                            return;
                                        }
                                        console.log('Employee role updated successfully.');
                                        });
                                    });
                                });
                                mainMenu();
                            });
                            break;
                        
                            case 'Update employee manager':
                                // Retrieve the current employees from the database
                                db.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee', function (err, employees) {
                                    if (err) {
                                    console.error('Error executing query: ', err);
                                    return;
                                }
                            
                                    // Map the employee data to generate the choices array for the employee prompt
                                    const employeeChoices = employees.map((employee) => ({
                                    value: employee.id,
                                    name: employee.full_name,
                                }));
                            
                                    // Prompt the user to select an employee and a new manager
                                inquirer
                                    .prompt([
                                    {
                                        type: 'list',
                                        name: 'employeeId',
                                        message: 'Select the employee to update:',
                                        choices: employeeChoices,
                                    },
                                    {
                                        type: 'list',
                                        name: 'managerId',
                                        message: 'Select the new manager for the employee:',
                                        choices: employeeChoices,
                                    },
                                    ])
                                    .then((data) => {
                                        const employeeId = data.employeeId;
                                        const managerId = data.managerId;
                                        
                                        // Update the employee's manager in the database
                                        db.query(
                                        'UPDATE employee SET manager_id = ? WHERE id = ?',
                                        [managerId, employeeId],
                                        function (err, results) {
                                            if (err) {
                                                console.error('Error executing query: ', err);
                                            return;
                                        }
                                        console.log('Employee manager updated successfully.');
                                        });
                                    });
                                    mainMenu();
                                });
                                break;
                            
                                case 'View employees by department':
                                    // Retrieve the current departments from the database
                                    db.query('SELECT id, name FROM department', function (err, departments) {
                                        if (err) {
                                        console.error('Error executing query: ', err);
                                        return;
                                    }
                                
                                        // Map the department data to generate the choices array for the department prompt
                                        const departmentChoices = departments.map((department) => ({
                                        value: department.id,
                                        name: department.name,
                                    }));
                                
                                        // Prompt the user to select a department
                                    inquirer
                                        .prompt([
                                        {
                                            type: 'list',
                                            name: 'departmentId',
                                            message: 'Select the department to view employees:',
                                            choices: departmentChoices,
                                        },
                                        ])
                                        .then((data) => {
                                            const departmentId = data.departmentId;
                                
                                            // Retrieve the employees by department from the database
                                            db.query(
                                            `SELECT 
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
                                                LEFT JOIN employee AS manager ON employee.manager_id = manager.id
                                            WHERE
                                                department.id = ?`,
                                            [departmentId],
                                            function (err, results) {
                                            if (err) {
                                                console.error('Error executing query: ', err);
                                                return;
                                            }
                                            
                                            console.table(results);
                                            });
                                        });
                                        mainMenu();
                                    });
                                    break;
                                
                                    case 'View Total Budget':
                                        // Retrieve the total salary from the database
                                        db.query(
                                            `SELECT SUM(role.salary) AS total_salary
                                            FROM employee
                                            INNER JOIN role ON employee.role_id = role.id`,
                                        function (err, results) {
                                            if (err) {
                                                console.error('Error executing query: ', err);
                                                return;
                                            }
                                            
                                            const totalSalary = results[0].total_salary;
                                            console.log(`Total Salary: $${totalSalary}`);
                                        }
                                        
                                        );
                                        mainMenu();
                                        break;
                                    
                        
                        case 'Quit':
                        console.log('Exiting...');
                        process.exit(0);
                    }
    });

};

mainMenu();





