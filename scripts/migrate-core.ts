import { execSync } from 'child_process';

try {
  console.log('Running core schema migration...');
  execSync(
    'npx prisma migrate dev --schema=./prisma/schema.prisma --name init',
    {
      stdio: 'inherit',
    },
  );
  console.log('Core schema migration completed!');
} catch (error) {
  console.error('Core migration failed:', error);
  process.exit(1);
}
