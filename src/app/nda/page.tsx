"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";


export default function NDAManagementPage() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setUploadedFile(file.name);
    setLoading(true);

    // Simulate API call (replace with your actual API request)
    setTimeout(() => {
      setResults(randomNDA()); // generate random NDA data
      setLoading(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      {/* Main Content */}
      <main style={{ flex: 1, padding: '30px' }}>
        
        {/* Header */}
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>NDA Management</h1>
          <p style={{ color: '#64748b' }}>Track, manage, and store all Non-Disclosure Agreements securely</p>
        </header>

        {/* Metrics */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Total NDAs', value: '128' },
            { label: 'Active NDAs', value: '94' },
            { label: 'Expired NDAs', value: '18' },
            { label: 'Pending Signatures', value: '16' },
          ].map((m, i) => (
            <div key={i} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>{m.label}</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{m.value}</p>
            </div>
          ))}
        </section>
        <div className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload NDA</CardTitle>
                <CardDescription>
                  Upload signed NDA documents for compliance validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Upload className="w-5 h-5" />
                  <span>Choose NDA file</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleUpload}
                  />
                </label>
                {uploadedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    📄 Uploaded: <span className="font-medium">{uploadedFile}</span>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            {loading && <p>Processing NDA... please wait.</p>}
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>Generated NDA details</CardDescription>
                </CardHeader>
                <CardContent>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <thead style={{ backgroundColor: "#f1f5f9" }}>
                      <tr>
                        {[
                          "Vendor",
                          "Agreement Title",
                          "Effective Date",
                          "Expiration Date",
                          "Status",
                          "Action",
                        ].map((h, i) => (
                          <th
                            key={i}
                            style={{
                              textAlign: "left",
                              padding: "12px 16px",
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#475569",
                              borderBottom: "1px solid #e2e8f0",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
                          {results.vendor}
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
                          {results.title}
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
                          {results.start}
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
                          {results.end}
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              color:
                                results.status === "Active"
                                  ? "#16a34a"
                                  : results.status === "Expired"
                                  ? "#dc2626"
                                  : "#ca8a04",
                              backgroundColor:
                                results.status === "Active"
                                  ? "#dcfce7"
                                  : results.status === "Expired"
                                  ? "#fee2e2"
                                  : "#fef9c3",
                            }}
                          >
                            {results.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
                          <button
                            style={{
                              color: "#2563eb",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </div>        
        <br></br>
        {/* NDA Registry */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>NDA Registry</h2>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }}>🔍</span>
              <input
                type="text"
                placeholder="Search NDAs..."
                style={{
                  padding: '8px 12px 8px 36px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  width: '280px'
                }}
              />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
            <thead style={{ backgroundColor: '#f1f5f9' }}>
              <tr>
                {['Vendor', 'Agreement Title', 'Effective Date', 'Expiration Date', 'Status', 'Action'].map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { vendor: 'TechCorp Ltd', title: 'NDA for Cloud Services', start: '01/15/2023', end: '01/15/2025', status: 'Active' },
                { vendor: 'MediHealth Inc', title: 'Confidentiality Agreement', start: '06/10/2022', end: '06/10/2023', status: 'Expired' },
                { vendor: 'FinServe Group', title: 'Data Protection NDA', start: '09/01/2023', end: '09/01/2024', status: 'Pending Signature' },
              ].map((nda, i) => (
                <tr key={i}>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>{nda.vendor}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>{nda.title}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>{nda.start}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>{nda.end}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: nda.status === 'Active' ? '#16a34a' : nda.status === 'Expired' ? '#dc2626' : '#ca8a04',
                      backgroundColor: nda.status === 'Active' ? '#dcfce7' : nda.status === 'Expired' ? '#fee2e2' : '#fef9c3'
                    }}>{nda.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
                    <button style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Signatures */}
        <section>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Signature Management</h2>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
          }}>
            <p style={{ marginBottom: '10px' }}>Track pending signatures and send reminders</p>
            <ul style={{ listStyle: 'disc', marginLeft: '20px' }}>
              <li>3 NDAs awaiting vendor signatures</li>
              <li>2 NDAs awaiting internal approval</li>
              <li>Send automated reminders every 7 days</li>
            </ul>
          </div>
        </section>

      </main>
    </div>
    </DashboardLayout>
  );
}





// Utility function to generate random NDA data
const randomNDA = () => {
  const vendors = ["TechCorp Ltd", "MediHealth Inc", "FinServe Group", "DataSys Co.", "AlphaTech"];
  const titles = ["Confidentiality Agreement", "Data Protection NDA", "NDA for Services", "Partnership NDA"];
  const statuses = ["Active", "Expired", "Pending Signature"];

  const vendor = vendors[Math.floor(Math.random() * vendors.length)];
  const title = titles[Math.floor(Math.random() * titles.length)];

  // random dates
  const startDate = new Date(
    2023 + Math.floor(Math.random() * 2),
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  );
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  const status = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    vendor,
    title,
    start: startDate.toLocaleDateString(),
    end: endDate.toLocaleDateString(),
    status,
  };
};

