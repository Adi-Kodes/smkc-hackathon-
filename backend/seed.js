const bcrypt = require('bcrypt');
const db = require('./database');

const seedDatabase = async () => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('password123', saltRounds);

    const users = [
        { name: 'Rajesh Kumar', username: 'supervisor1', password: passwordHash, role: 'supervisor' },
        { name: 'Amit Singh', username: 'worker1', password: passwordHash, role: 'worker' },
        { name: 'Priya Sharma', username: 'worker2', password: passwordHash, role: 'worker' },
        { name: 'Ravi Patel', username: 'worker3', password: passwordHash, role: 'worker' }
    ];

    db.serialize(() => {
        // Clear existing data
        db.run('DELETE FROM users');
        db.run('DELETE FROM tasks');
        db.run('DELETE FROM attendance');
        
        // Reset sqlite autoincrement
        db.run('DELETE FROM sqlite_sequence');

        const stmt = db.prepare('INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)');
        for (const user of users) {
            stmt.run(user.name, user.username, user.password, user.role);
        }
        stmt.finalize();

        console.log('Database seeded successfully with 1 Supervisor and 3 Workers.');
        console.log('All passwords are: password123');
    });

    // Close the DB connection after short delay to ensure inserts finish
    setTimeout(() => {
        db.close();
    }, 1000);
};

seedDatabase();
