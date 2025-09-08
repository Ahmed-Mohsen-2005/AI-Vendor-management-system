"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download } from "lucide-react";

export default function NDAManagementPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze-nda", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Error uploading NDA:", err);
    } finally {
      setLoading(false);
    }
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
            <CardDescription>Upload signed NDA documents for compliance validation</CardDescription>
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
          </CardContent>
        </Card>

        {/* Results */}
        {loading && <p>Processing NDA... please wait.</p>}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>Automated checks for this NDA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Extracted Entities</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm">
                  {JSON.stringify(results.entities, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold">Stamps</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm">
                  {JSON.stringify(results.stamps, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold">Annotated NDA</h3>
                <a
                  href={`http://127.0.0.1:8000${results.annotated_pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:underline"
                >
                  <Download className="w-4 h-4" /> <span>Download Annotated PDF</span>
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
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

