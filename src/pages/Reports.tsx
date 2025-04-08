import React from 'react';
import { Download, LineChart, FileJson, FileSpreadsheet } from 'lucide-react';
import { useAppStore } from '../store';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import PerformanceChart from '../components/charts/PerformanceChart';
import { downloadFile, generateCsv } from '../utils';

const Reports: React.FC = () => {
  const { exportData, getAllWeeklySummaries } = useAppStore();
  const summaries = getAllWeeklySummaries();
  
  const handleExportJSON = () => {
    const jsonData = exportData();
    downloadFile(jsonData, 'tradetrackr-data.json', 'application/json');
  };
  
  const handleExportCSV = () => {
    const csvData = generateCsv(summaries);
    downloadFile(csvData, 'tradetrackr-report.csv', 'text/csv');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reports & Exports</h1>
        <p className="text-white/70">
          View performance reports and export your data
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader 
              title="Performance History" 
              icon={<LineChart className="w-5 h-5 text-white" />}
            />
            <CardContent>
              <PerformanceChart height={400} />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader title="Export Options" />
            <CardContent className="space-y-6">
              <div className="bg-tradeBg/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-tradeLight/20 p-2 rounded-lg">
                    <FileJson className="w-5 h-5 text-tradeHighlight" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Full Data (JSON)</h3>
                </div>
                <p className="text-sm text-white/70 mb-4">
                  Export complete data in JSON format. Use this for backups or transferring data
                  to another device.
                </p>
                <button
                  className="btn-secondary w-full flex items-center justify-center"
                  onClick={handleExportJSON}
                  disabled={summaries.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </button>
              </div>
              
              <div className="bg-tradeBg/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-tradeLight/20 p-2 rounded-lg">
                    <FileSpreadsheet className="w-5 h-5 text-tradeHighlight" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Report (CSV)</h3>
                </div>
                <p className="text-sm text-white/70 mb-4">
                  Export a CSV report of your weekly summaries. Ideal for importing into
                  spreadsheet applications.
                </p>
                <button
                  className="btn-secondary w-full flex items-center justify-center"
                  onClick={handleExportCSV}
                  disabled={summaries.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {summaries.length > 0 ? (
        <Card>
          <CardHeader title="Weekly Performance Summary" />
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-tradeDark text-left">
                    <th className="px-4 py-3 text-white/90">Week</th>
                    <th className="px-4 py-3 text-white/90">Start Value</th>
                    <th className="px-4 py-3 text-white/90">End Value</th>
                    <th className="px-4 py-3 text-white/90">Net Gain</th>
                    <th className="px-4 py-3 text-white/90">Trade Count</th>
                    <th className="px-4 py-3 text-white/90">Avg Per Trade</th>
                  </tr>
                </thead>
                <tbody>
                  {summaries.map((summary) => (
                    <tr 
                      key={summary.weekId} 
                      className="border-b border-tradeDark/30 hover:bg-tradeDark/20"
                    >
                      <td className="px-4 py-3">
                        {new Date(summary.startDate).toLocaleDateString()} - {new Date(summary.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">${summary.startValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3">${summary.endValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className={`px-4 py-3 ${summary.netGain >= 0 ? 'text-green-400' : 'text-tradeError'}`}>
                        ${Math.abs(summary.netGain).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {summary.netGain < 0 ? ' (Loss)' : ''}
                      </td>
                      <td className="px-4 py-3">{summary.tradeCount}</td>
                      <td className={`px-4 py-3 ${summary.stats.avgPerTrade >= 0 ? 'text-green-400' : 'text-tradeError'}`}>
                        ${Math.abs(summary.stats.avgPerTrade).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {summary.stats.avgPerTrade < 0 ? ' (Loss)' : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12 px-6 border border-dashed border-tradeLight/20 rounded-lg">
          <h3 className="text-xl font-medium text-white mb-3">No Data Available</h3>
          <p className="text-white/70">
            Add weeks and trades to generate reports
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports; 