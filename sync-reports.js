#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the user data path
const userDataPath = path.join(process.env.HOME, 'Library/Application Support/Wowworks AI Tools');
const dataPath = path.join(userDataPath, 'wowworks-ai-tools');
const reportsPath = path.join(dataPath, 'data/reports');

console.log('🔍 Checking for reports in file system...');
console.log('Data path:', dataPath);

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

// Create a simple HTML file to display the reports
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Recovered Reports</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .report { border: 1px solid #ccc; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .report h3 { margin-top: 0; color: #333; }
        .report-id { font-size: 12px; color: #666; }
        .report-prompt { background: #f5f5f5; padding: 10px; border-radius: 3px; margin: 10px 0; }
        .report-dates { font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <h1>Recovered Reports (${reports.length})</h1>
    <p>These reports were found in the file system and can be recovered.</p>

    ${reports.map(report => `
        <div class="report">
            <h3>${report.name}</h3>
            <div class="report-id">ID: ${report.id}</div>
            <div class="report-dates">
                Created: ${new Date(report.createdAt).toLocaleString()}<br>
                Updated: ${new Date(report.updatedAt).toLocaleString()}
            </div>
            <div class="report-prompt">
                <strong>Prompt:</strong><br>
                ${report.prompt.replace(/\n/g, '<br>')}
            </div>
        </div>
    `).join('')}

    <script>
        // Store reports in localStorage for the app to use
        const reports = ${JSON.stringify(reports, null, 2)};
        localStorage.setItem('reports', JSON.stringify(reports));
        console.log('✅ Reports synced to localStorage:', reports.length);

        // Also store in a global variable for easy access
        window.recoveredReports = reports;

        // Show success message
        document.body.insertAdjacentHTML('afterbegin',
            '<div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin-bottom: 20px;">' +
            '✅ Reports have been synced to localStorage! You can now close this window and your reports should appear in the app.' +
            '</div>'
        );
    </script>
</body>
</html>
`;

// Write the HTML file
const htmlPath = path.join(__dirname, 'recovered-reports.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log(`\n✅ Created recovery file: ${htmlPath}`);
console.log('🌐 Open this file in your browser to view and sync your reports to localStorage');
console.log('\n📝 To manually sync reports to localStorage, run this in the browser console:');
console.log('localStorage.setItem("reports", JSON.stringify(' + JSON.stringify(reports, null, 2) + '));');
