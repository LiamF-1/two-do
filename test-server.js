// Quick test to check if all imports work
const { execSync } = require('child_process');

try {
  console.log('Testing Next.js build...');
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
