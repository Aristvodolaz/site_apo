const XLSX = require('xlsx');
const path = require('path');

const filePath = 'C:\\Users\\G15\\Desktop\\Книга1.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log('Total rows:', data.length);
    console.log('First 3 rows:', JSON.stringify(data.slice(0, 3), null, 2));
    console.log('Columns:', Object.keys(data[0] || {}));
} catch (error) {
    console.error('Error reading Excel file:', error.message);
}
