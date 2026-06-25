import * as XLSX from 'xlsx';

/**
 * Downloads JSON data as an Excel (.xlsx) file using the xlsx library.
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Output filename (default: export.xlsx)
 * @param {string} sheetName - Name of the worksheet (default: Data)
 */
export const downloadExcel = (data, filename = 'export.xlsx', sheetName = 'Data') => {
    if (!data || !data.length) return;

    // Create worksheet from JSON data
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Write the workbook to a file and trigger browser download
    XLSX.writeFile(workbook, filename);
};

/**
 * Downloads JSON data as a CSV file.
 * (Legacy/Fallback method)
 */
export const downloadCSV = (data, filename = 'export.csv') => {
    if (!data || !data.length) return;

    // Extract headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV rows
    const csvRows = [];
    
    // Header row
    csvRows.push(headers.join(','));
    
    // Data rows
    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header];
            // Escape quotes and wrap in quotes
            const escaped = ('' + (val === undefined || val === null ? '' : val)).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    
    // Create blob and download link
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
