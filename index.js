const mysql = require("mysql");
const inquirer = require("inquirer");
const consoletable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "emp_db"
});

function start() {
    inquirer
        .prompt(
            {
                name:"action",
                type: "list",
                message: "Please select from the list below",
                choices: ["Add Employee", "Add Department", "Add Role", "View Current Employees", "View Current Departments", "View Current Roles", "Update a Current Role", "Exit"]
            })
    .then(function (answer) {
        if (answer.action === "Add Employee") {
            addEmployee();
        }
        else if (answer.action === "Add Department") {
            addDept();
        }
        else if (answer.action === "Add Role") {
            addRole();
        }
        else if (answer.action === "View Current Employees") {
            viewEmployees();
        }
        else if (answer.action === "View Current Departments") {
            viewDepts();
        }
        else if (answer.action === "View Current Roles") {
            viewRoles();
        }
        else if (answer.action === "Update a Current Role") {
            updateRole();
        } else {
            connection.end();
        }
    });
};

function addEmployee() {
    connection.query("SELECT * FROM role", function (err, roleresults) {
        if (err) throw err;
        connection.query("SELECT * FROM employee", function (err, employeeresults) {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        name: "firstName",
                        type: "input",
                        message: "First Name ",
                    },
                    {
                        name: "lastName",
                        type: "input",
                        message: "Last Name ",
                    },
                    {
                        name: "role",
                        type: "list",
                        choices: function () {
                            const roleChoiceArray = roleresults.map(roleresults => roleresults.occupation);
                            return roleChoiceArray;
                        },
                        message: "New Role for New Employee ",
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Employee Manager",
                        choices: function () {
                            const employeeChoiceArray = employeeresults.map(employeeresults => employeeresults.first_name + " " + employeeresults.last_name)
                            employeeChoiceArray.push("None");
                            return (employeeChoiceArray);
                        }
                    }
                ])
                .then(function (answer) {
                    var roleId;

                    for (var i = 0; i < roleresults.length; i++) {
                        if (roleresults[i].occupation === answer.role) {
                            roleId = roleresults[i].id
                    }
                }

                if (answer.manager === "None") {
                    managerId = null
                } else {
                    for (var i = 0; i < employeeresults.length; i++) {
                        if (employeeresults[i].first_name + " " + employeeresults[i].last_name === answer.manager) {
                            managerId = employeeresults[i].id
                    }
                }

                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: roleId,
                        manager_id: managerId,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Employee successfully added!");
                        start();
                    }
                );
            };
        });
    })
});
};

function addRole() {
            connection.query("SELECT * FROM dept", function (err, deptresults) {
                if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                name: "rolename",
                                type: "input",
                                message: "Role Name: ",
                            },
                            {
                                name: "salary",
                                type: "input",
                                message: "Salary Amount (in numeric characters) ",
                                validate: (value) => {
                                    if (isNaN (value) === false) {
                                        return true;
                                    } 
                                    return false;
                                },
                            },
                            {
                                name: "dept",
                                type: "list",
                                message: "Employee Department ",
                                choices: function () {
                                    const deptChoiceArray = deptresults.map(deptresults => deptresults.occupation);
                                    return deptChoiceArray;
                                }
                            }
                        ])
                        .then(function (answer) {
                            for (var i = 0; i < deptresults.length; i++) {
                                if (deptresults[i].dept_name === answer.dept) {
                                    deptId = deptresults[i].id
                                }
                            }
        
                            connection.query(
                                "INSERT INTO role SET ?",
                            {
                                occupation: answer.roleName,
                                salary: answer.salary,
                                dept_id: deptId,
                            },
                            function (err) {
                                if (err) throw err;
                                console.log("Role successfully added!");
                                start();
                            }
                        );
                    });
            });
        
        }
        

                function addDept() {
                            inquirer
                                .prompt([
                                    {
                                        name: "deptname",
                                        type: "input",
                                        message: "Department Name "
                                    }
                                ])
                                .then(function (answer) {
                                    connection.query (
                                       "INSERT INTO dept SET ?",
                                    {   
                                        dept_name: answer.dept_name
                                    },
                                    function (err) {
                                        if (err) throw err;
                                        console.log("Department successfully added!")
                                        start ();
                        
                                    }
                                );
                            })
                }
                
                function viewEmployees() {
                    var query = "SELECT employee.first_name, employee.last_name, role.occupation, role.salary, dept.dept_name FROM employee INNER JOIN role INNER JOIN dept ON (employee.role_id = role_id AND role.dept_id = dept_id"
                
                    connection.query(query, function (err, employeeresponse) {
                        if (err) throw err;
                        console.table(employeeresponse);
                        start()
                    });
                }

                function viewRoles() {
                    var query = "SELECT role.occupation, role.salary, dept.dept_name FROM role INNER JOIN dept INNER JOIN dept ON (role.dept_id = dept_id)"
                
                    connection.query(query, function (err, roleresponse) {
                        if (err) throw err;
                        console.table(roleresponse);
                        start();
                    });
                }

                function viewDepts() {
                    connection.query("SELECT * FROM dept", function (err, roleresponse) {
                        if (err) throw err;
                        console.table(roleresponse);
                        start();
                    });
                }

        function updateRole () {
            connection.query("SELECT * FROM role", function (err, roleresults) {
                if (err) throw err;
                connection.query("SELECT * FROM emploees", function (err, employeeresults) {
                    if (err) throw err;
                    inquirer
                    .prompt([
                        {
                            name: "Employee",
                            type: "list",
                            message: "Select employee to update",
                            choices: function () {
                                const employeeChoices = employeeresults.map(employeeresults => employeeresults.first_name + " " + employeeresults.last_name)
                                return (employeeChoices);
                            }
                        },
                        {
                            name: "Role",
                            type: "list",
                            message: "Select employee to update",
                            choices: function () {
                                const roleChoices = roleresults.map(roleresults => roleresults.occupation);
                                return (roleChoices);
                            }
                        }
                    ])
                    .then(function (answer) {
    
                    for (var i = 0; i < employeeresults.length; i++) {
                        if (employeeresults[i].first_name + " " + employeeresults[i].last_name === answer.Employee) {
                            roleId = roleresults[i].id
                        }
                    }
    
                    
                    for (var i = 0; i < employeeresults.length; i++) {
                        if (roleresults[i].occupation === answer.Role) {
                            roleId = roleresults[i].id
                        }
                    }
    
                    connection.query(
                        `UPDATE employee SET ? WHERE ?`,
                        [
                            {
                                role_id: roleId
                            },
                            {
                                id: employeeUpdate
                            }
                        ],
                        function (err) {
                            if (err) throw err;
                            console.log("Employee successfully updated!");
                            start();
                        }
                    );
            
            });
        
        });
    });
}
    



start ();