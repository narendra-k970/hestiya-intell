const fs = require('fs');
const readline = require('readline');
const csvParse = require('csv-parse');
const { stringify } = require('csv-stringify/sync');

async function processFile() {
  const artifactDir = 'C:\\Users\\91971\\.gemini\\antigravity\\brain\\a11bd6a9-3ec3-4452-9e1a-5fbe0cbbbe8e';
  const fileContent = fs.readFileSync('D:\\hestiya-admin\\scratch\\all_companies.csv');
  
  // Use csv-parse library for robust parsing
  csvParse.parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  }, (err, records) => {
    if (err) {
      console.error(err);
      return;
    }
    
    console.log('Total records:', records.length);
    
    // Filter out existing companies
    const filteredRecords = records.filter(record => {
      const alreadyIn = record['Already in Hestiya Dashboard?'];
      // Only keep records where 'Already in Hestiya Dashboard?' is 'No'
      return alreadyIn === 'No';
    });
    
    console.log('Filtered records:', filteredRecords.length);
    
    // Convert back to CSV
    const csvString = stringify(filteredRecords, {
      header: true
    });
    
    // Use the correct artifact directory path
    const outPath = artifactDir + '\\import_ready_companies.csv';
    fs.writeFileSync(outPath, csvString);
    console.log('Saved to', outPath);
  });
}

processFile();
