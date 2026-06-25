import { mapData, parseCSV } from '../../utils/csvParser';
import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Loader2, FileText, Upload, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const BulkUpload = ({
    headerMap,
    onUpload,
    title = "Bulk Import Data",
    description = "Select a CSV file to import multiple records at once."
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const fileInputRef = useRef(null);

    const downloadTemplate = () => {
        // Create headers from the headerMap (using the first alias for each key)
        const headers = Object.keys(headerMap).map(key => {
            const aliases = headerMap[key];
            return Array.isArray(aliases) ? aliases[0] : key;
        });
        
        // Add some sample data
        let sampleRow = headers.map(h => {
            const lowerH = h.toLowerCase();
            if (lowerH.includes('price')) return '999';
            if (lowerH.includes('count')) return '10';
            if (lowerH.includes('fasting')) return 'Yes';
            if (lowerH.includes('mrp') || lowerH.includes('original')) return '1999';
            if (lowerH.includes('parameters') || lowerH.includes('params')) return 'HbA1c: % : 5.7-6.4, Glucose: mg/dL : 70-100';
            if (lowerH.includes('status')) return 'Active';
            if (lowerH.includes('tat') || lowerH.includes('time')) return '24 Hours';
            if (lowerH.includes('sample')) return 'Blood';
            return `Sample ${h}`;
        });

        const csvContent = [
            headers.join(','),
            sampleRow.join(',')
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_template.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileName = file.name.toLowerCase();
        const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
        const isCSV = fileName.endsWith('.csv');

        if (!isExcel && !isCSV) {
            setStatus({ type: 'error', message: 'Only CSV and Excel files are supported.' });
            return;
        }

        setIsUploading(true);
        setStatus({ type: '', message: '' });

        const reader = new FileReader();
        console.log("BulkUpload: FileReader instance created");

        reader.onloadstart = () => console.log("BulkUpload: reader.onloadstart triggered");
        reader.onprogress = (progress) => console.log(`BulkUpload: reader.onprogress: ${progress.loaded}/${progress.total}`);

        reader.onload = async (event) => {
            console.log("BulkUpload: reader.onload triggered", { 
                isExcel, 
                isCSV, 
                resultType: typeof event.target.result,
                resultLength: event.target.result?.length || event.target.result?.byteLength 
            });
            try {
                let mappedData = [];

                if (isExcel) {
                    console.log("BulkUpload: Processing Excel file");
                    const data = new Uint8Array(event.target.result);
                    if (typeof XLSX === 'undefined') {
                        console.error("BulkUpload: XLSX library is undefined!");
                        throw new Error("XLSX library is not loaded");
                    }
                    const workbook = XLSX.read(data, { type: 'array' });
                    console.log("BulkUpload: Workbook read success, sheets:", workbook.SheetNames);

                    workbook.SheetNames.forEach(sheetName => {
                        console.log(`BulkUpload: Processing sheet: ${sheetName}`);
                        const worksheet = workbook.Sheets[sheetName];
                        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        console.log(`BulkUpload: Sheet ${sheetName} has ${json.length} rows`);

                        if (json.length < 2) return;

                        // Smart header row detection
                        let headerIndex = -1;
                        for (let i = 0; i < Math.min(20, json.length); i++) {
                            const row = json[i];
                            if (Array.isArray(row) && row.length >= 2) {
                                const rowString = row.join(' ').toLowerCase();
                                if (rowString.includes('test') || rowString.includes('name') || rowString.includes('lab') || rowString.includes('price')) {
                                    headerIndex = i;
                                    break;
                                }
                            }
                        }

                        if (headerIndex === -1) {
                            console.warn(`BulkUpload: No header row found in sheet ${sheetName}`);
                            return;
                        }

                        const headers = json[headerIndex];
                        const dataRows = json.slice(headerIndex + 1);
                        console.log(`BulkUpload: Header row found at index ${headerIndex}, ${dataRows.length} data rows`);

                        const sheetMappedData = dataRows
                            .filter(row => Array.isArray(row) && row.length > 0 && row.some(cell => cell !== undefined && cell !== null && cell !== ''))
                            .map(row => {
                                const mappedRow = mapData(headers, row, headerMap);
                                // Add sheet name as a reference for lab partner fallback
                                return { ...mappedRow, _sheetName: sheetName };
                            })
                            .filter(item => {
                                // Generic check: ensure at least one mapped field has a value
                                // Ignore internal helper fields starting with underscore
                                const keys = Object.keys(item).filter(k => !k.startsWith('_'));
                                return keys.some(key => item[key] !== undefined && item[key] !== null && item[key] !== '' && item[key] !== 0);
                            });

                        console.log(`BulkUpload: Mapped ${sheetMappedData.length} records from ${sheetName}`);
                        mappedData = [...mappedData, ...sheetMappedData];
                    });
                } else {
                    const text = event.target.result;
                    console.log("BulkUpload: Processing CSV text, length:", text?.length);
                    const rows = parseCSV(text);
                    console.log("BulkUpload: CSV parsed into", rows?.length, "rows");

                    if (!rows || rows.length < 2) {
                        console.error("BulkUpload: CSV is empty or missing headers", rows);
                        setStatus({ type: 'error', message: 'CSV is empty or missing headers.' });
                        setIsUploading(false);
                        return;
                    }

                    // Smart header row detection for CSV as well
                    let headerIndex = 0;
                    for (let i = 0; i < Math.min(20, rows.length); i++) {
                        const row = rows[i];
                        if (Array.isArray(row) && row.length >= 2) {
                            const rowString = row.join(' ').toLowerCase();
                            console.log(`BulkUpload: Checking row ${i} for headers:`, rowString);
                            // Expanded keywords for better detection
                            const headerKeywords = [
                                'test', 'name', 'lab', 'price', 'cost', 'mrp', 
                                'category', 'type', 'tat', 'fasting', 'gender', 
                                'amount', 'item', 'title', 'partner'
                            ];
                            
                            if (headerKeywords.some(kw => rowString.includes(kw))) {
                                headerIndex = i;
                                console.log("BulkUpload: Header row found at index", i, "Headers:", row);
                                break;
                            }
                        }
                    }

                    const headers = rows[headerIndex];
                    const dataRows = rows.slice(headerIndex + 1);
                    console.log("BulkUpload: Detected CSV Headers:", headers, "Data Rows:", dataRows.length);

                    mappedData = dataRows
                        .filter(row => Array.isArray(row) && row.length > 0 && row.some(cell => cell !== undefined && cell !== null && cell !== ''))
                        .map(row => {
                            try {
                                return mapData(headers, row, headerMap);
                            } catch (e) {
                                console.error("BulkUpload: Error mapping row", row, e);
                                return null;
                            }
                        })
                        .filter(item => {
                            if (!item) return false;
                            // Generic check: ensure at least one mapped field has a value
                            const keys = Object.keys(item).filter(k => !k.startsWith('_'));
                            return keys.some(key => item[key] !== undefined && item[key] !== null && item[key] !== '' && item[key] !== 0);
                        });

                    console.log(`BulkUpload: Mapped ${mappedData.length} total records from CSV`);
                    if (mappedData.length > 0) console.log("Sample Mapped Row:", mappedData[0]);
                }

                if (mappedData.length > 0) {
                    console.log("BulkUpload: Calling onUpload with", mappedData.length, "mapped records");
                    await onUpload(mappedData);
                    console.log("BulkUpload: onUpload completed successfully");
                    setStatus({ type: 'success', message: `Successfully processed ${mappedData.length} records!` });
                } else {
                    console.warn("BulkUpload: No valid data mapped from file");
                    setStatus({ type: 'error', message: 'No valid records found matching your configuration.' });
                }
            } catch (err) {
                console.error("BulkUpload: Processing error caught in reader.onload", err);
                setStatus({ type: 'error', message: `Error: ${err.message || 'Failed to process file'}` });
            } finally {
                console.log("BulkUpload: Finally block in reader.onload triggered, setting isUploading to false");
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Safely reset input
                }
            }
        };

        if (isExcel) {
            console.log("BulkUpload: Starting readAsArrayBuffer for Excel file");
            reader.readAsArrayBuffer(file);
        } else {
            console.log("BulkUpload: Starting readAsText for CSV file");
            reader.readAsText(file);
        }
        
        reader.onerror = (error) => {
            console.error("BulkUpload: FileReader error occurred", error);
            setStatus({ type: 'error', message: 'Failed to read file. Please try again.' });
            setIsUploading(false);
        };
    };

    return (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-[32px] p-8 text-center space-y-4 hover:border-medical-green/40 transition-all group">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-400 group-hover:bg-soft-green group-hover:text-medical-green transition-all">
                {isUploading ? <Loader2 className="animate-spin" size={28} /> : <FileText size={28} />}
            </div>

            <div className="flex flex-col items-center">
                <h3 className="text-lg font-black text-dark-text uppercase tracking-tight">{title}</h3>
                <p className="text-[10px] text-grey-text font-bold uppercase tracking-widest mt-1 mb-4">{description}</p>
                <button 
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100 mb-2"
                >
                    <Download size={12} /> Download Template
                </button>
            </div>

            <div className="pt-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv, .xlsx, .xls"
                    className="hidden"
                />
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="h-12 w-full max-w-[240px] gap-2 border-gray-200 group-hover:border-medical-green group-hover:text-medical-green"
                    disabled={isUploading}
                >
                    {isUploading ? 'Processing File...' : <><Upload size={18} /> Choose CSV/Excel File</>}
                </Button>
            </div>

            <AnimatePresence>
                {status.message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${status.type === 'success' ? 'bg-soft-green text-medical-green' : 'bg-red-50 text-red-500'
                            }`}
                    >
                        {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        {status.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BulkUpload;
