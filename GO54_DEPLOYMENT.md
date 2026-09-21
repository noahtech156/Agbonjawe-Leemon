# GO54 Deployment

This project runs as a Node.js/Express application. It is not a static-only upload because the scholarship forms, authentication, CMS, and admin pages use the API and database.

## Recommended GO54 setup

Use a GO54 Linux VPS or a hosting plan that provides **Node.js Application** support. If the hosting control panel does not provide Node.js application support, use a VPS or ask GO54 to enable Node.js for the account.

1. Create a MySQL database and database user in the GO54 control panel.
2. Upload the project files, including `package.json` and `package-lock.json`.
3. Set the Node.js application startup file to `server/index.js`.
4. Use the Node.js version supported by the GO54 plan, preferably Node.js 20 or newer.
5. Set the application mode to production and install dependencies with:

   ```bash
   npm ci --omit=dev
   ```

6. Copy `.env.example` to `.env` and set the real values for:
   - `BASE_URL`
   - `JWT_SECRET`
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   - SMTP values if email notifications are required
7. Set the public domain as the application URL. The app listens on `process.env.PORT`, which is supplied by the hosting panel.
8. Restart the Node.js application and check:

   ```text
   https://your-domain.example/health
   ```

   It should return `{"status":"ok"}`.

## Important production notes

- Keep `.env` private. Do not upload it to a public repository or expose it through the website.
- Use `DB_DIALECT=mysql` in production. SQLite is suitable for local testing but may not persist reliably on shared hosting.
- Change the seeded admin password immediately after the first login.
- The `uploads/` directory must be writable by the Node.js process because application documents and CMS images are stored there.
- Configure SMTP if students must receive application, acceptance, or password-reset emails.
- Point `BASE_URL` to the final HTTPS domain so email links use the correct address.

## Local production check

```bash
npm ci
npm start
```

Then open `http://localhost:5000/health`.