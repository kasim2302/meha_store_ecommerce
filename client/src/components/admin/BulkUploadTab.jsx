import React, { useState, useRef } from 'react';
import axios from '../../api/axios';
import { Upload, Download, FileText, CheckCircle2, AlertTriangle, Play, RefreshCw, XCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const BulkUploadTab = () => {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [uploadResults, setUploadResults] = useState([]); // Array of { name, status, error }
  const [dragActive, setDragActive] = useState(false);

  // Download Sample CSV template
  const downloadSampleCSV = () => {
    const csvContent = 
      "name,description,price,quantity,category,imageUrl\n" +
      "Classic Toy Car,A high quality red toy car,299,15,Toys,https://images.unsplash.com/photo-1581235720704-06d3acfcb36f\n" +
      "Elegant Coffee Mug,Ceramic blue coffee mug,199,25,Fancy,https://images.unsplash.com/photo-1514228742587-6b1558fcca3d\n";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Robust CSV parser
  const parseCSVText = (text) => {
    const lines = [];
    let row = [""];
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i+1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          row[row.length - 1] += '"';
          i++; // skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push('');
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++; // skip \n
        }
        lines.push(row);
        row = [''];
      } else {
        row[row.length - 1] += char;
      }
    }
    
    if (row.length > 1 || row[0] !== '') {
      lines.push(row);
    }
    
    return lines;
  };

  // Handle file import
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a valid CSV file.', 'Invalid File Type');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parsed = parseCSVText(text);
      if (parsed.length <= 1) {
        toast.error('The CSV file is empty or has only headers.', 'Parsing Failed');
        return;
      }

      const headers = parsed[0].map(h => h.trim().toLowerCase());
      const expectedHeaders = ['name', 'description', 'price', 'quantity', 'category', 'imageurl'];
      
      // Check if headers align
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        toast.error(`Missing CSV headers: ${missingHeaders.join(', ')}`, 'Incorrect Format');
        return;
      }

      const rows = parsed.slice(1).map((row, index) => {
        const item = {};
        headers.forEach((header, colIdx) => {
          item[header] = row[colIdx] ? row[colIdx].trim() : '';
        });

        // Perform client-side validation
        const errors = [];
        if (!item.name) errors.push('Name is required');
        
        const priceNum = parseFloat(item.price);
        if (isNaN(priceNum) || priceNum < 0) {
          errors.push('Price must be a valid non-negative number');
        }
        
        const qtyNum = parseInt(item.quantity, 10);
        if (isNaN(qtyNum) || qtyNum < 0) {
          errors.push('Quantity must be a valid non-negative integer');
        }
        
        if (!item.category) errors.push('Category is required');
        
        if (!item.imageurl) {
          errors.push('Image URL is required');
        } else if (!item.imageurl.startsWith('http')) {
          errors.push('Image URL must start with http/https');
        }

        return {
          id: index,
          name: item.name || `Row ${index + 1}`,
          description: item.description || '',
          price: isNaN(priceNum) ? item.price : priceNum,
          quantity: isNaN(qtyNum) ? item.quantity : qtyNum,
          category: item.category,
          imageUrl: item.imageurl,
          errors,
          isValid: errors.length === 0,
          status: 'pending' // pending, uploading, success, failed
        };
      });

      // Filter out entirely empty rows
      const filteredRows = rows.filter(r => r.name || r.price || r.quantity || r.category || r.imageUrl);
      setParsedRows(filteredRows);
      setUploadResults([]);
      toast.success(`Successfully loaded ${filteredRows.length} products from CSV.`, 'CSV Loaded');
    };
    reader.readAsText(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    const validRows = parsedRows.filter(r => r.isValid);
    if (validRows.length === 0) {
      toast.error('No valid rows to upload. Please correct errors in your CSV.', 'Cannot Upload');
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: validRows.length });
    
    // Set status of valid rows to pending, and clear results
    const results = [];
    const updatedRows = [...parsedRows];
    
    for (let i = 0; i < updatedRows.length; i++) {
      if (updatedRows[i].isValid) {
        updatedRows[i].status = 'pending';
      }
    }
    setParsedRows(updatedRows);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      if (!row.isValid) continue;

      // Update current row to uploading
      setParsedRows(prev => {
        const copy = [...prev];
        copy[i].status = 'uploading';
        return copy;
      });

      try {
        const formData = new FormData();
        formData.append('name', row.name);
        formData.append('description', row.description);
        formData.append('price', row.price);
        formData.append('quantity', row.quantity);
        formData.append('category', row.category);
        formData.append('imageUrl', row.imageUrl); // Sent directly as imageUrl text

        await axios.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        successCount++;
        setParsedRows(prev => {
          const copy = [...prev];
          copy[i].status = 'success';
          return copy;
        });
        results.push({ name: row.name, status: 'success' });
      } catch (error) {
        failCount++;
        const errMsg = error.response?.data?.message || 'Server error';
        setParsedRows(prev => {
          const copy = [...prev];
          copy[i].status = 'failed';
          copy[i].errors = [...copy[i].errors, errMsg];
          return copy;
        });
        results.push({ name: row.name, status: 'failed', error: errMsg });
      }

      setUploadProgress(prev => ({ ...prev, current: prev.current + 1 }));
    }

    setUploading(false);
    setUploadResults(results);

    if (failCount === 0) {
      toast.success(`Successfully uploaded all ${successCount} products.`, 'Bulk Upload Complete');
    } else {
      toast.warn(`Uploaded ${successCount} successfully, ${failCount} failed.`, 'Partial Success');
    }
  };

  const clearRows = () => {
    setParsedRows([]);
    setUploadResults([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bulk Product Upload</h2>
          <p className="text-sm text-gray-500 mt-1">Upload multiple products at once using a CSV template.</p>
        </div>
        <button 
          onClick={downloadSampleCSV}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
        >
          <Download className="h-4 w-4" /> Download CSV Template
        </button>
      </div>

      {/* CSV Guidelines Alert */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-amber-800 text-xs">
        <FileText className="h-5 w-5 text-amber-600 shrink-0" />
        <div className="space-y-1">
          <p className="font-bold">Guidelines for image URLs:</p>
          <p>Because CSV uploading doesn't support local image uploads, you must host your product images publicly (e.g., on Unsplash, Imgur, or your cloud storage) and use their full URLs in the `imageUrl` column. Categories should match existing category names in your store.</p>
        </div>
      </div>

      {/* Upload Drag and Drop Zone */}
      {parsedRows.length === 0 ? (
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
            dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-300 hover:border-indigo-400 bg-gray-50/50'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden" 
          />
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <p className="font-bold text-gray-700">Drag & drop your CSV file here, or <span className="text-indigo-600">browse</span></p>
          <p className="text-xs text-gray-500 mt-1">Only .csv files are supported</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 bg-gray-50 p-4 rounded-2xl">
            <div className="text-sm text-gray-600 font-medium">
              Loaded <span className="font-bold text-gray-900">{parsedRows.length}</span> rows from CSV file.
              {parsedRows.some(r => !r.isValid) && (
                <span className="text-red-500 ml-2 font-semibold">({parsedRows.filter(r => !r.isValid).length} invalid)</span>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={clearRows}
                disabled={uploading}
                className="px-4 py-2 border rounded-xl hover:bg-gray-100 text-gray-700 font-semibold text-sm transition-all disabled:opacity-50"
              >
                Clear File
              </button>
              <button 
                onClick={handleUpload}
                disabled={uploading || parsedRows.filter(r => r.isValid).length === 0}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
              >
                {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {uploading ? `Uploading (${uploadProgress.current}/${uploadProgress.total})` : 'Start Upload'}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-indigo-600">
                <span>Uploading Products...</span>
                <span>{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-350"
                  style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Preview Table */}
          <div className="overflow-x-auto border border-gray-100 rounded-2xl max-h-[350px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-bold text-gray-500">Status</th>
                  <th className="py-3 px-4 font-bold text-gray-500">Product Name</th>
                  <th className="py-3 px-4 font-bold text-gray-500">Category</th>
                  <th className="py-3 px-4 font-bold text-gray-500">Price</th>
                  <th className="py-3 px-4 font-bold text-gray-500">Stock</th>
                  <th className="py-3 px-4 font-bold text-gray-500">Image Preview</th>
                  <th className="py-3 px-4 font-bold text-gray-500">Validation / Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {parsedRows.map((row) => (
                  <tr 
                    key={row.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      !row.isValid ? 'bg-red-50/20' : 
                      row.status === 'success' ? 'bg-emerald-50/10' : 
                      row.status === 'failed' ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-medium">
                      {row.status === 'pending' && <span className="text-gray-400 font-semibold">Pending</span>}
                      {row.status === 'uploading' && <span className="text-indigo-600 font-bold flex items-center gap-1"><RefreshCw className="h-3 w-3 animate-spin" /> Working</span>}
                      {row.status === 'success' && <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Done</span>}
                      {row.status === 'failed' && <span className="text-red-600 font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> Failed</span>}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 truncate max-w-[120px]">{row.name}</td>
                    <td className="py-3 px-4 text-gray-600">{row.category}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">₹{row.price}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{row.quantity}</td>
                    <td className="py-3 px-4">
                      {row.imageUrl && row.imageUrl.startsWith('http') ? (
                        <img 
                          src={row.imageUrl} 
                          alt="preview" 
                          className="w-7 h-7 rounded object-cover border bg-gray-50"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Invalid'; }}
                        />
                      ) : (
                        <span className="text-red-500">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {row.isValid ? (
                        row.status === 'failed' ? (
                          <span className="text-red-600 font-medium flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                            {row.errors[row.errors.length - 1]}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                          </span>
                        )
                      ) : (
                        <div className="space-y-0.5">
                          {row.errors.map((err, i) => (
                            <span key={i} className="text-red-500 font-semibold block flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 shrink-0" /> {err}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUploadTab;
