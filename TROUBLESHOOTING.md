# Troubleshooting Build Errors

If you're encountering TypeScript errors about missing modules (`@/lib/db` or `@/lib/topic-analyzer`), follow these steps:

## Step 1: Generate Prisma Client
\`\`\`bash
npx prisma generate
\`\`\`

This generates the Prisma client based on your schema, which is required for the `@/lib/db` imports to work.

## Step 2: Install Dependencies
\`\`\`bash
npm install
\`\`\`

Ensure all dependencies are properly installed.

## Step 3: Clear Build Cache
\`\`\`bash
rm -rf .next
rm -rf node_modules/.cache
\`\`\`

## Step 4: Restart TypeScript Server
If using VS Code:
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "TypeScript: Restart TS Server"
3. Press Enter

## Step 5: Rebuild
\`\`\`bash
npm run build
\`\`\`

## Common Issues

### "Cannot find module '@/lib/db'"
- Make sure `tsconfig.json` has the path alias: `"@/*": ["./*"]`
- Run `npx prisma generate` to create the Prisma client
- Restart your TypeScript server

### "Module not found: Can't resolve '@prisma/client'"
- Run `npm install @prisma/client`
- Run `npx prisma generate`

### Database Connection Issues
- Verify your `.env` file has the correct `DATABASE_URL`
- Test the connection with: `npx prisma db pull`
