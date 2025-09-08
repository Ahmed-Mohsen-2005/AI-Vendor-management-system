// // "use client";

// // import { useState } from "react";
// // import { DashboardLayout } from "@/components/dashboard-layout";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Upload, FileCheck, Loader2 } from "lucide-react";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";

// // export default function ContractsPage() {
// //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
// //   const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
// //   const [allTableData, setAllTableData] = useState<any[]>([]);
// //   const [isUploading, setIsUploading] = useState(false);
// //   const [isProcessing, setIsProcessing] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = event.target.files?.[0];
// //     if (file) {
// //       setSelectedFile(file);
// //       setError(null);
// //     }
// //   };

// //   const handleUpload = async () => {
// //     if (!selectedFile) return;

// //     setIsUploading(true);
// //     setError(null);

// //     const formData = new FormData();
// //     formData.append("file", selectedFile);

// //     try {
// //       const res = await fetch("http://127.0.0.1:8000/upload-contract/", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       if (!res.ok) throw new Error(`Upload failed: ${res.status} ${res.statusText}`);

// //       const data = await res.json();
// //       setUploadedFileName(data.filename);
// //       alert("File uploaded successfully!");
// //     } catch (error) {
// //       console.error("Upload failed:", error);
// //       setError(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
// //     } finally {
// //       setIsUploading(false);
// //     }
// //   };

// //   const handleProcess = async () => {
// //     if (!uploadedFileName) {
// //       alert("Please upload a file first!");
// //       return;
// //     }

// //     setIsProcessing(true);
// //     setError(null);

// //     try {
// //       const res = await fetch("http://127.0.0.1:8000/process-contract/", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ filename: uploadedFileName }),
// //       });

// //       if (!res.ok) throw new Error(`Processing failed: ${res.status} ${res.statusText}`);

// //       const data = await res.json();
// //       if (data.error) throw new Error(data.error);

// //       // Merge existingMissingData + contractContentData into one
// //       const mergedData = [
// //         ...(data.existing_missing || []).map((row: any) => ({
// //           section: row.section || "-",
// //           item: row.item || "-",
// //           status: row.status || "-",
// //           detail: row.detail || "-",
// //         })),
// //         ...(data.contract_content || []).map((row: any) => ({
// //           section: row.section || "-",
// //           item: row.item || "-",
// //           status: row.status || "-",
// //           detail: row.detail || "-",
// //         })),
// //       ];

// //       setAllTableData(mergedData);
// //     } catch (error) {
// //       console.error("Processing failed:", error);
// //       setError(`Processing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   const getStatusColor = (status: string) => {
// //     return status?.toLowerCase() === "exists"
// //       ? "text-green-600 bg-green-100"
// //       : status?.toLowerCase() === "missing"
// //       ? "text-red-600 bg-red-100"
// //       : "text-gray-600 bg-gray-100";
// //   };

// //   return (
// //     <DashboardLayout>
// //       <div className="space-y-6">
// //         {/* Header */}
// //         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
// //           <div>
// //             <h1 className="text-3xl font-bold tracking-tight">
// //               Contract Management
// //             </h1>
// //             <p className="text-muted-foreground mt-1">
// //               Upload and process your contracts
// //             </p>
// //           </div>
// //         </div>

// //         {/* Error Display */}
// //         {error && (
// //           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
// //             {error}
// //           </div>
// //         )}

// //         {/* Upload + Process Controls */}
// //         <div className="flex gap-3">
// //           <input
// //             type="file"
// //             id="fileInput"
// //             accept=".pdf"
// //             className="hidden"
// //             onChange={handleFileChange}
// //           />
// //           <Button
// //             onClick={() => document.getElementById("fileInput")?.click()}
// //             className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
// //             disabled={isUploading || isProcessing}
// //           >
// //             <Upload className="h-4 w-4 mr-2" />
// //             Choose File
// //           </Button>
// //           <Button
// //             onClick={handleUpload}
// //             disabled={!selectedFile || isUploading || isProcessing}
// //           >
// //             {isUploading ? (
// //               <>
// //                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
// //                 Uploading...
// //               </>
// //             ) : (
// //               "Upload Contract"
// //             )}
// //           </Button>
// //           <Button
// //             onClick={handleProcess}
// //             disabled={!uploadedFileName || isUploading || isProcessing}
// //           >
// //             {isProcessing ? (
// //               <>
// //                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
// //                 Processing...
// //               </>
// //             ) : (
// //               <>
// //                 <FileCheck className="h-4 w-4 mr-2" />
// //                 Process Contract
// //               </>
// //             )}
// //           </Button>
// //         </div>

// //         {/* Unified Table */}
// //         <Card className="w-full">
// //           <CardHeader>
// //             <CardTitle>Contract Overview</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             {allTableData.length > 0 ? (
// //               <div className="overflow-x-auto w-full">
// //                 <Table className="min-w-full">
// //                   <TableHeader>
// //                     <TableRow>
// //                       <TableHead>Section</TableHead>
// //                       <TableHead>Item</TableHead>
// //                       <TableHead>Status</TableHead>
// //                       <TableHead>Detail</TableHead>
// //                     </TableRow>
// //                   </TableHeader>
// //                   <TableBody>
// //                     {allTableData.map((row, index) => (
// //                       <TableRow key={index}>
// //                         <TableCell className="font-medium">{row.section}</TableCell>
// //                         <TableCell>{row.item}</TableCell>
// //                         <TableCell>
// //                           <span className={`px-2 py-1 rounded ${getStatusColor(row.status)}`}>
// //                             {row.status}
// //                           </span>
// //                         </TableCell>
// //                         <TableCell>{row.detail}</TableCell>
// //                       </TableRow>
// //                     ))}
// //                   </TableBody>
// //                 </Table>
// //               </div>
// //             ) : (
// //               <p className="text-muted-foreground text-sm">
// //                 {isProcessing ? "Processing contract..." : "Process a contract to see results."}
// //               </p>
// //             )}
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </DashboardLayout>
// //   );
// // }
// "use client";

// import { useState } from "react";
// import { DashboardLayout } from "@/components/dashboard-layout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Upload, FileCheck, Loader2 } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// export default function ContractsPage() {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
//   const [allTableData, setAllTableData] = useState<any[]>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setError(null);
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     setIsUploading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const res = await fetch("http://127.0.0.1:8000/upload-contract/", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error(`Upload failed: ${res.status} ${res.statusText}`);

//       const data = await res.json();
//       setUploadedFileName(data.filename);
//       alert("File uploaded successfully!");
//     } catch (error) {
//       console.error("Upload failed:", error);
//       setError(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleProcess = async () => {
//     if (!uploadedFileName) {
//       alert("Please upload a file first!");
//       return;
//     }

//     setIsProcessing(true);
//     setError(null);

//     try {
//       const res = await fetch("http://127.0.0.1:8000/process-contract/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ filename: uploadedFileName }),
//       });

//       if (!res.ok) throw new Error(`Processing failed: ${res.status} ${res.statusText}`);

//       const data = await res.json();
//       if (data.error) throw new Error(data.error);

//       // Merge into a map keyed by item to avoid duplicates
//       const mergedMap: Record<string, any> = {};

//       // First: existing/missing
//       (data.existing_missing || []).forEach((row: any) => {
//         const key = row.item || row.section || "-";
//         mergedMap[key] = {
//           section: row.section || "-",
//           item: row.item || "-",
//           status: row.status || "-",
//           detail: row.detail || "-",
//         };
//       });

//       // Then: contract content (overrides/extends if exists)
//       (data.contract_content || []).forEach((row: any) => {
//         const key = row.item || row.section || "-";
//         if (mergedMap[key]) {
//           // Merge into existing
//           mergedMap[key] = {
//             ...mergedMap[key],
//             section: row.section || mergedMap[key].section,
//             detail: row.detail || mergedMap[key].detail,
//             // keep status if already present
//           };
//         } else {
//           mergedMap[key] = {
//             section: row.section || "-",
//             item: row.item || "-",
//             status: row.status || "-",
//             detail: row.detail || "-",
//           };
//         }
//       });

//       // Convert back to array
//       setAllTableData(Object.values(mergedMap));
//     } catch (error) {
//       console.error("Processing failed:", error);
//       setError(`Processing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     return status?.toLowerCase() === "exists"
//       ? "text-green-600 bg-green-100"
//       : status?.toLowerCase() === "missing"
//       ? "text-red-600 bg-red-100"
//       : "text-gray-600 bg-gray-100";
//   };

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">
//               Contract Management
//             </h1>
//             <p className="text-muted-foreground mt-1">
//               Upload and process your contracts
//             </p>
//           </div>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//             {error}
//           </div>
//         )}

//         {/* Upload + Process Controls */}
//         <div className="flex gap-3">
//           <input
//             type="file"
//             id="fileInput"
//             accept=".pdf"
//             className="hidden"
//             onChange={handleFileChange}
//           />
//           <Button
//             onClick={() => document.getElementById("fileInput")?.click()}
//             className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
//             disabled={isUploading || isProcessing}
//           >
//             <Upload className="h-4 w-4 mr-2" />
//             Choose File
//           </Button>
//           <Button
//             onClick={handleUpload}
//             disabled={!selectedFile || isUploading || isProcessing}
//           >
//             {isUploading ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 Uploading...
//               </>
//             ) : (
//               "Upload Contract"
//             )}
//           </Button>
//           <Button
//             onClick={handleProcess}
//             disabled={!uploadedFileName || isUploading || isProcessing}
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <FileCheck className="h-4 w-4 mr-2" />
//                 Process Contract
//               </>
//             )}
//           </Button>
//         </div>

//         {/* Unified Table */}
//         <Card className="w-full">
//           <CardHeader>
//             <CardTitle>Contract Overview</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {allTableData.length > 0 ? (
//               <div className="overflow-x-auto w-full">
//                 <Table className="min-w-full">
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="w-[15%]">Section</TableHead>
//                       <TableHead className="w-[10%]">Status</TableHead>
//                       <TableHead className="w-[60%]">Detail</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {allTableData.map((row, index) => (
//                       <TableRow key={index}>
//                         <TableCell className="font-medium">{row.section}</TableCell>
                        
//                         <TableCell>
//                           <span className={`px-2 py-1 rounded ${getStatusColor(row.status)}`}>
//                             {row.status}
//                           </span>
//                         </TableCell>
//                         <TableCell className="break-words max-w-[300px]">
//                           {row.detail}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             ) : (
//               <p className="text-muted-foreground text-sm">
//                 {isProcessing ? "Processing contract..." : "Process a contract to see results."}
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// }


"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck, Loader2, Calendar, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ContractsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [allTableData, setAllTableData] = useState<any[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<any>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/upload-contract/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.status} ${res.statusText}`);

      const data = await res.json();
      setUploadedFileName(data.filename);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      setError(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProcess = async () => {
    if (!uploadedFileName) {
      alert("Please upload a file first!");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/process-contract/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: uploadedFileName }),
      });

      if (!res.ok) throw new Error(`Processing failed: ${res.status} ${res.statusText}`);

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Merge into a map keyed by item to avoid duplicates
      const mergedMap: Record<string, any> = {};

      // First: existing/missing
      (data.existing_missing || []).forEach((row: any) => {
        const key = row.item || row.section || "-";
        mergedMap[key] = {
          section: row.section || "-",
          item: row.item || "-",
          status: row.status || "-",
          detail: row.detail || "-",
        };
      });

      // Then: contract content (overrides/extends if exists)
      (data.contract_content || []).forEach((row: any) => {
        const key = row.item || row.section || "-";
        if (mergedMap[key]) {
          // Merge into existing
          mergedMap[key] = {
            ...mergedMap[key],
            section: row.section || mergedMap[key].section,
            detail: row.detail || mergedMap[key].detail,
            // keep status if already present
          };
        } else {
          mergedMap[key] = {
            section: row.section || "-",
            item: row.item || "-",
            status: row.status || "-",
            detail: row.detail || "-",
          };
        }
      });

      // Convert back to array
      setAllTableData(Object.values(mergedMap));
      
      // Set additional info
      setAdditionalInfo(data.additional_info || {});
    } catch (error) {
      console.error("Processing failed:", error);
      setError(`Processing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status?.toLowerCase() === "exists"
      ? "text-green-600 bg-green-100"
      : status?.toLowerCase() === "missing"
      ? "text-red-600 bg-red-100"
      : "text-gray-600 bg-gray-100";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Contract Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload and process your contracts
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {/* Upload + Process Controls */}
        <div className="flex gap-3">
          <input
            type="file"
            id="fileInput"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            onClick={() => document.getElementById("fileInput")?.click()}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
            disabled={isUploading || isProcessing}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || isProcessing}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Contract"
            )}
          </Button>
          <Button
            onClick={handleProcess}
            disabled={!uploadedFileName || isUploading || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileCheck className="h-4 w-4 mr-2" />
                Process Contract
              </>
            )}
          </Button>
        </div>

        {/* Additional Information */}
        {(additionalInfo.expiry_date || additionalInfo.contract_value) && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionalInfo.expiry_date && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Expiry Date</p>
                      <p className="text-lg">{additionalInfo.expiry_date}</p>
                    </div>
                  </div>
                )}
                {additionalInfo.contract_value && (
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Contract Value</p>
                      <p className="text-lg">{additionalInfo.contract_value}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Unified Table */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Contract Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {allTableData.length > 0 ? (
              <div className="overflow-x-auto w-full">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[15%]">Section</TableHead>
                      <TableHead className="w-[15%]">Item</TableHead>
                      <TableHead className="w-[10%]">Status</TableHead>
                      <TableHead className="w-[60%]">Detail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTableData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.section}</TableCell>
                        <TableCell>{row.item}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded ${getStatusColor(row.status)}`}>
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell className="break-words max-w-[300px]">
                          {row.detail}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {isProcessing ? "Processing contract..." : "Process a contract to see results."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}