// seedUsers.js
const bcrypt = require('bcrypt');
const { pool } = require('./config/db'); // Adjust path if needed

const users = [
  { email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { email: 'admin2@example.com', password: 'admin456', role: 'admin' },
  { email: 'admin3@example.com', password: 'admin789', role: 'admin' },
  { email: 'mahendergarh@district.com', password: 'Supervisor@123', role: 'supervisor_mahendergarh' },
  { email: 'supervisor.narnaul@district.com', password: 'SupervisorNarnaul@123', role: 'supervisor_narnaul' },
  { email: 'rewari@district.com', password: 'rewari123', role: 'supervisor_rewari' },
];

(async () => {
  try {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const existing = await pool.query('SELECT * FROM users WHERE email = $1', [user.email]);
      if (existing.rows.length === 0) {
        await pool.query(
          'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
          [user.email, hashedPassword, user.role]
        );
        console.log(`✅ Inserted: ${user.email}`);
      } else {
        console.log(`⚠️ Already exists: ${user.email}`);
      }
    }
    console.log("✅ Seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
})();
