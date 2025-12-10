const XLSX = require('xlsx');
const path = require('path');

try {
    const filePath = path.join(__dirname, '../RecintosCiudadOruro.xlsx');
    console.log(`Reading file from: ${filePath}`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (data.length === 0) {
        console.log('No data found in the Excel file.');
    } else {
        console.log('Headers:', Object.keys(data[0]));
        
        // Search for potential prison entries
        const potentialPrisons = data.filter(r => {
            const rowStr = JSON.stringify(r).toLowerCase();
            return rowStr.includes('carcel') || 
                   rowStr.includes('penal') ||
                   rowStr.includes('san pedro') ||
                   rowStr.includes('merced');
        });
        console.log('Potential Prisons found:', potentialPrisons.length);
        potentialPrisons.forEach(p => console.log(JSON.stringify(p, null, 2)));
    }
} catch (error) {
    console.error('Error reading file:', error);
}
