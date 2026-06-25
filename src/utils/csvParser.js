

export const parseCSV = (text) => {
    console.log("csvParser: parseCSV started");
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;

    if (!text) {
        console.warn("csvParser: Empty text provided");
        return [];
    }

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentCell += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (currentCell || currentRow.length > 0) {
                currentRow.push(currentCell.trim());
                rows.push(currentRow);
                currentRow = [];
                currentCell = '';
            }
            if (char === '\r' && nextChar === '\n') i++;
        } else {
            currentCell += char;
        }
    }

    if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
    }

    console.log("csvParser: parseCSV finished with", rows.length, "rows");
    return rows;
};

export const mapData = (headers, row, headerMap) => {
    const data = {};

    headers.forEach((rawHeader, index) => {
        if (rawHeader === undefined || rawHeader === null) return;

        const headerStr = rawHeader.toString().trim();
        const lowerHeader = headerStr.toLowerCase();
        const cleanHeader = lowerHeader.replace(/[^a-z0-9]/g, '');

        let targetKey = null;

        // 1. Exact match in headerMap
        if (headerMap[headerStr]) {
            targetKey = typeof headerMap[headerStr] === 'string' ? headerMap[headerStr] : null;
        } 
        
        // 2. Search for alias in headerMap where value might be an array
        if (!targetKey) {
            for (const [key, val] of Object.entries(headerMap)) {
                if (Array.isArray(val)) {
                    if (val.some(alias => alias.toLowerCase() === lowerHeader)) {
                        targetKey = key;
                        break;
                    }
                }
            }
        }

        // 3. Case-insensitive match in headerMap keys (fallback)
        if (!targetKey) {
            for (const key of Object.keys(headerMap)) {
                if (key.toLowerCase() === lowerHeader) {
                    targetKey = typeof headerMap[key] === 'string' ? headerMap[key] : key;
                    break;
                }
            }
        }

        // 4. Fuzzy match (clean strings)
        if (!targetKey) {
            const headerEntries = Object.entries(headerMap);
            // Sort by length descending to match longest mapping first
            headerEntries.sort((a, b) => b[0].length - a[0].length);
            
            for (const [key, val] of headerEntries) {
                // Handle both string and array mapping for fuzzy match
                const aliases = Array.isArray(val) ? val : [key];
                
                for (const alias of aliases) {
                    const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
                    if (!cleanAlias) continue;

                    const isMatch = cleanHeader.includes(cleanAlias) || cleanAlias.includes(cleanHeader);
                    
                    if (isMatch) {
                        // Anti-mismapping protection: 
                        // If we are looking for a name/test/title, but the header has "lab" in it, skip it unless it's an exact alias
                        const isNameKey = key.toLowerCase().includes('name') || key.toLowerCase() === 'test' || key.toLowerCase() === 'title';
                        if (isNameKey && cleanHeader.includes('lab') && !cleanAlias.includes('lab')) {
                            continue; 
                        }

                        // Also require short aliases to be a more significant part of the header
                        if (cleanAlias.length <= 4 && (cleanHeader.length > cleanAlias.length * 2.5)) {
                            continue;
                        }

                        targetKey = typeof val === 'string' ? val : key;
                        break;
                    }
                }
                if (targetKey) break;
            }
        }

        // Default to original if no mapping found
        const finalKey = targetKey || headerStr;

        let value = row[index];
        if (value === undefined || value === null) value = '';
        
        const valueStr = value.toString().trim();

        // Numeric cleaning for price/count fields (using finalKey OR original if it looks like a price)
        const isNumericField = finalKey.toLowerCase().includes('price') || 
                              finalKey.toLowerCase().includes('count') || 
                              finalKey === 'originalPrice' ||
                              lowerHeader.includes('price') ||
                              lowerHeader.includes('cost') ||
                              lowerHeader.includes('amount') ||
                              lowerHeader.includes('rate') ||
                              lowerHeader.includes('fee');

        const isBooleanField = finalKey.toLowerCase().includes('fasting') ||
                              finalKey.toLowerCase().includes('addon') ||
                              lowerHeader.includes('fasting') ||
                              lowerHeader.includes('addon');

        if (isNumericField) {
            // Remove currency symbols, commas, and other non-numeric chars except decimal
            const cleaned = valueStr.replace(/[^0-9.]/g, '');
            data[finalKey] = cleaned ? parseFloat(cleaned) : 0;
        } else if (isBooleanField) {
            const lowerVal = valueStr.toLowerCase();
            data[finalKey] = lowerVal === 'true' || lowerVal === 'yes' || lowerVal === 'y' || lowerVal === '1';
        } else {
            data[finalKey] = valueStr;
        }
    });

    return data;
};
