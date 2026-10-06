const fs = require('fs');
const readline = require('readline');
const csvParse = require('csv-parse');
const { stringify } = require('csv-stringify/sync');

async function processFile() {
  const artifactDir = 'C:\\Users\\91971\\.gemini\\antigravity\\brain\\a11bd6a9-3ec3-4452-9e1a-5fbe0cbbbe8e';
  const fileContent = fs.readFileSync('D:\\hestiya-admin\\scratch\\all_companies.csv');
  
  csvParse.parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  }, (err, records) => {
    if (err) {
      console.error(err);
      return;
    }
    
    console.log('Total records:', records.length);
    
    // We do NOT filter out existing companies, so that their new columns get updated
    const finalRecords = records;
    
    // Convert back to CSV
    const csvString = stringify(finalRecords, {
      header: true
    });
    
    const outPath = artifactDir + '\\import_ready_all_companies.csv';
    fs.writeFileSync(outPath, csvString);
    console.log('Saved to', outPath);
  });
}

processFile();
