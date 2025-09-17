#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the user data path
const userDataPath = path.join(process.env.HOME, 'Library/Application Support/Wowworks AI Tools');
const dataPath = path.join(userDataPath, 'wowworks-ai-tools');
const reportsPath = path.join(dataPath, 'data/reports');

console.log('🔍 Syncing reports from file system to localStorage...');

if (!fs.existsSync(reportsPath)) {
  console.log('❌ Reports directory does not exist');
  process.exit(1);
}

// Read the reports index
const indexPath = path.join(reportsPath, 'index.json');
if (!fs.existsSync(indexPath)) {
  console.log('❌ Reports index does not exist');
  process.exit(1);
}

const indexContent = fs.readFileSync(indexPath, 'utf8');
const index = JSON.parse(indexContent);

console.log('📋 Found reports index:', index);

// Read all report files
const reports = [];
for (const reportId of index.reports) {
  const reportPath = path.join(reportsPath, `report-${reportId}.json`);
  if (fs.existsSync(reportPath)) {
    const reportContent = fs.readFileSync(reportPath, 'utf8');
    const report = JSON.parse(reportContent);
    reports.push(report);
    console.log(`✅ Loaded report: ${report.name} (${report.id})`);
  } else {
    console.log(`❌ Report file not found: ${reportPath}`);
  }
}

console.log(`\n📊 Total reports found: ${reports.length}`);

// Create a script to run in the browser console
const browserScript = `
// Run this in the browser console to sync reports to localStorage
localStorage.setItem('reports', JSON.stringify(${JSON.stringify(reports, null, 2)}));
console.log('✅ Reports synced to localStorage:', ${reports.length});
`;

// Write the script to a file
const scriptPath = path.join(__dirname, 'browser-sync.js');
fs.writeFileSync(scriptPath, browserScript);

console.log(`\n✅ Created browser sync script: ${scriptPath}`);
console.log('📝 Copy and paste the content of browser-sync.js into your browser console to sync the reports');
console.log('\n🌐 Or open the app and run this in the browser console:');
console.log(browserScript);
