# Deploying Family Christmas List to Hostgator

This guide will walk you through deploying the Family Christmas List application to Hostgator shared hosting.

## Prerequisites

1. A Hostgator hosting account (Shared, VPS, or Dedicated)
2. Node.js installed on your local machine
3. FTP client (like FileZilla)
4. Access to Hostgator cPanel

## Step 1: Prepare Your Application

1. Build your application locally:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist` directory.

## Step 2: Set Up MySQL Database

1. Log in to your Hostgator cPanel
2. Find "MySQL Databases" in the "Databases" section
3. Create a new database:
   - Enter a database name
   - Click "Create Database"
4. Create a database user:
   - Enter a username and password
   - Click "Create User"
5. Add the user to the database:
   - Select the database and user
   - Grant all privileges
   - Click "Add"

## Step 3: Configure Environment Variables

1. Create or edit the `.htaccess` file in your public_html directory:
   ```apache
   SetEnv DATABASE_URL "mysql://username:password@localhost:3306/database_name"
   SetEnv AUTH_SECRET "your-secret-key"
   ```

2. Replace the placeholders:
   - `username`: Your MySQL username
   - `password`: Your MySQL password
   - `database_name`: Your MySQL database name
   - `your-secret-key`: A secure random string for JWT signing

## Step 4: Upload Files

### Using FTP:
1. Open your FTP client
2. Connect to your Hostgator server:
   - Host: Your domain or FTP hostname
   - Username: Your Hostgator username
   - Password: Your Hostgator password
3. Navigate to the `public_html` directory
4. Upload the contents of your `dist` directory

### Using cPanel File Manager:
1. Log in to cPanel
2. Open File Manager
3. Navigate to `public_html`
4. Upload the contents of your `dist` directory

## Step 5: Configure Node.js

1. Log in to your Hostgator cPanel
2. Find "Node.js" in the "Software" section
3. Click "Create Application"
4. Configure your application:
   - Application mode: Production
   - Application URL: Your domain
   - Application root: public_html
   - Application startup file: entry.mjs
   - Node.js version: Select the latest LTS version
   - Environment variables: Add the same variables from Step 3
5. Click "Create"

## Step 6: Set Up Database Schema

1. Connect to your database using phpMyAdmin in cPanel
2. Import the database schema:
   ```sql
   -- Run your Prisma migrations
   npx prisma migrate deploy
   ```

## Step 7: Configure Domain and SSL

1. In cPanel, go to "SSL/TLS Status"
2. Install Let's Encrypt SSL certificate for your domain
3. Enable "Force HTTPS" in .htaccess:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

## Step 8: Test Your Deployment

1. Visit your domain in a web browser
2. Test all main features:
   - User registration/login
   - Creating wishlists
   - Family group management
   - Account settings

## Troubleshooting

### Common Issues:

1. **500 Internal Server Error**
   - Check error logs in cPanel
   - Verify environment variables
   - Check file permissions

2. **Database Connection Issues**
   - Verify database credentials
   - Check if database user has correct privileges
   - Ensure database host is correct

3. **Node.js Application Not Starting**
   - Check Node.js logs in cPanel
   - Verify startup file path
   - Check for port conflicts

### Accessing Logs

1. In cPanel:
   - Error Log: `error_log` file in your home directory
   - Node.js Log: Available in Node.js application manager
   - Access Log: Available in "Raw Access" under "Metrics"

## Maintenance

### Regular Tasks:

1. **Database Backup**
   - Use cPanel's backup wizard
   - Schedule regular backups
   - Keep local copies

2. **Updates**
   - Regularly update Node.js version
   - Keep dependencies updated
   - Monitor security advisories

3. **SSL Certificate**
   - Monitor SSL expiration
   - Renew certificates when needed

### Performance Optimization:

1. **Enable Caching**
   ```apache
   <IfModule mod_expires.c>
       ExpiresActive On
       ExpiresByType image/jpeg "access plus 1 year"
       ExpiresByType image/png "access plus 1 year"
       ExpiresByType text/css "access plus 1 month"
       ExpiresByType application/javascript "access plus 1 month"
   </IfModule>
   ```

2. **Compress Static Files**
   ```apache
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/plain
       AddOutputFilterByType DEFLATE text/html
       AddOutputFilterByType DEFLATE text/css
       AddOutputFilterByType DEFLATE application/javascript
       AddOutputFilterByType DEFLATE application/json
   </IfModule>
   ```

## Security Considerations

1. **File Permissions**
   - Set directories to 755
   - Set files to 644
   - Keep sensitive files outside public_html

2. **Database Security**
   - Use strong passwords
   - Limit database user privileges
   - Regular security audits

3. **Application Security**
   - Keep dependencies updated
   - Monitor error logs
   - Regular security scans

## Support

If you encounter issues:
1. Check Hostgator's knowledge base
2. Contact Hostgator support
3. Review application logs
4. Check GitHub issues

Remember to always maintain backups before making any significant changes to your deployment.
