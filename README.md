# ALIKPEA Foundation Website

A Node.js web application for the ALIKPEA Foundation, providing scholarship management, event handling, and more.

## Features

- User authentication and authorization
- Scholarship application system
- Event management
- Contact form
- Admin dashboard
- File uploads

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- PM2 for process management (optional but recommended for production)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/noahtech156/Agbonjawe-Leemon.git
   cd Agbonjawe-Leemon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required values:
     ```
     PORT=3000
     JWT_SECRET=your_secure_jwt_secret
     DB_HOST=your_database_host
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_NAME=your_database_name
     DB_PORT=3306
     CORS_ORIGIN=https://yourdomain.com
     ```

4. Set up the database:
   - Create a MySQL database
   - Run the migrations:
     ```bash
     mysql -u your_db_user -p your_db_name < config/migrations.sql
     ```

## Development

To run the application in development mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## Production Deployment on GO54

### Step 1: Choose a Hosting Plan
- Sign up for GO54 VPS hosting (recommended for Node.js applications)
- GO54 offers VPS plans that support custom applications

### Step 2: Server Setup
1. Access your VPS via SSH (GO54 provides SSH credentials)
2. Update the system:
   ```bash
   sudo apt update && sudo apt upgrade
   ```

3. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. Install MySQL:
   ```bash
   sudo apt install mysql-server
   sudo mysql_secure_installation
   ```

5. Create a database and user:
   ```bash
   sudo mysql
   CREATE DATABASE alikpeafoundation;
   CREATE USER 'alikpea_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON alikpeafoundation.* TO 'alikpea_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

### Step 3: Upload and Configure Application
1. Upload your code to the server (using FTP, SCP, or git clone)
2. Navigate to your project directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Run database migrations:
   ```bash
   mysql -u alikpea_user -p alikpeafoundation < config/migrations.sql
   ```

5. Configure environment variables:
   - Edit `.env` with production values
   - Set `DB_HOST=localhost`, `DB_USER=alikpea_user`, etc.
   - Set `CORS_ORIGIN` to your domain
   - Generate a secure `JWT_SECRET`

6. Create uploads directory:
   ```bash
   mkdir -p public/uploads
   chmod 755 public/uploads
   ```

### Step 4: Install PM2 and Start Application
1. Install PM2 globally:
   ```bash
   sudo npm install -g pm2
   ```

2. Start the application:
   ```bash
   pm2 start server.js --name alikpeafoundation
   ```

3. Set up PM2 to start on boot:
   ```bash
   pm2 startup
   pm2 save
   ```

### Step 5: Configure Web Server (Nginx)
1. Install Nginx:
   ```bash
   sudo apt install nginx
   ```

2. Create a new site configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/alikpeafoundation
   ```

   Add the following content:
   ```
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/alikpeafoundation /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Step 6: SSL Certificate (Optional but Recommended)
- Use Let's Encrypt for free SSL:
  ```bash
  sudo apt install certbot python3-certbot-nginx
  sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
  ```

### Step 7: Domain Configuration
- Point your domain's DNS to GO54's nameservers
- Configure the domain in GO54's control panel

## File Structure

```
alikpeafoundation/
├── admin/                 # Admin interface files
├── config/                # Database configuration and migrations
├── controllers/           # Route controllers
├── middleware/            # Express middleware
├── models/                # Database models
├── public/                # Static files and HTML pages
├── routes/                # API routes
├── uploads/               # Uploaded files
├── utils/                 # Utility functions
├── package.json           # Dependencies and scripts
├── server.js              # Main application file
└── tailwind.config.js     # Tailwind CSS configuration
```

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post (admin)
- `GET /api/scholarships` - Get scholarships
- `POST /api/scholarships` - Apply for scholarship
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin)
- `POST /api/contact` - Send contact message

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC