// hashPassword.js
import bcrypt from 'bcrypt';

const users = [
  { email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { email: 'admin2@example.com', password: 'admin456', role: 'admin' },
  { email: 'admin3@example.com', password: 'admin789', role: 'admin' },
  { email: 'mahendergarh@district.com', password: 'Supervisor@123', role: 'supervisor_mahendergarh' },
  { email: 'supervisor.narnaul@district.com', password: 'SupervisorNarnaul@123', role: 'supervisor_narnaul' },
  { email: 'rewari@district.com', password: 'rewari123', role: 'supervisor_rewari' },
];

const saltRounds = 10;

(async () => {
  for (const user of users) {
    try {
      const hashed = await bcrypt.hash(user.password, saltRounds);
      console.log(
        `INSERT INTO users (email, password, role) VALUES ('${user.email}', '${hashed}', '${user.role}');`
      );
    } catch (err) {
      console.error(`❌ Error hashing password for ${user.email}:`, err);
    }
  }
})();
