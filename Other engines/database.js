const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: '127.0.0.1',  
    port: 3307,         
    user: 'root',       
    password: 'Berzerker0552#47',   
    database: 'heathcare_appointments'   
});


connection.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL database:', error);
        return;  
    }
    console.log('Connected to MySQL database!');


    connection.end((endError) => {
            console.log('Connection closed successfully.');
    });
});

                                                                                                                                                                            


