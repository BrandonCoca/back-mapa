const XLSX = require('xlsx');
const path = require('path');
const filePath = path.join(__dirname, '../RecintosCiudadOruro.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);
if (data.length) console.log(Object.keys(data[0]).join(', '));
