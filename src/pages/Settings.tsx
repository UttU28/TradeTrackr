import React, { useState, useRef } from 'react';
import { Save, UploadCloud, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import { downloadFile } from '../utils';

const Settings: React.FC = () => {
  const { exportData, importData } = useAppStore();
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExportData = () => {
    const jsonData = exportData();
    downloadFile(jsonData, 'tradetrackr-backup.json', 'application/json');
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        
        // Validate JSON structure
        const data = JSON.parse(jsonData);
        if (!data.users || !data.weeks || !data.weeklyRatios) {
          throw new Error('Invalid data format. The file must contain users, weeks, and weeklyRatios.');
        }
        
        importData(jsonData);
        setImportSuccess(true);
        setImportError(null);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setImportSuccess(false);
        }, 3000);
      } catch (error) {
        let message = 'Failed to import data';
        if (error instanceof Error) {
          message = error.message;
        }
        setImportError(message);
        setImportSuccess(false);
      }
    };
    
    reader.onerror = () => {
      setImportError('Error reading file');
      setImportSuccess(false);
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/70">
          Configure application settings and manage your data
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader 
              title="Data Management" 
              description="Backup and restore your data"
            />
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Backup Data</h3>
                <p className="text-sm text-white/70">
                  Export all your data to a JSON file. This file can be used to restore your data later.
                </p>
                <button
                  className="btn-primary flex items-center"
                  onClick={handleExportData}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Export Backup
                </button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Restore Data</h3>
                <p className="text-sm text-white/70">
                  Import data from a previously exported JSON file. This will replace all current data.
                </p>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    className="btn-secondary flex items-center"
                    onClick={handleImportClick}
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Import Data
                  </button>
                </div>
                
                {importError && (
                  <div className="mt-3 p-3 bg-tradeError/20 border border-tradeError/30 rounded-lg flex items-start">
                    <AlertTriangle className="w-5 h-5 text-tradeError mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-white/90">{importError}</p>
                  </div>
                )}
                
                {importSuccess && (
                  <div className="mt-3 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-white/90">Data imported successfully!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader 
              title="About TradeTrackr" 
              description="Version and information"
            />
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Version</h3>
                  <p className="text-white/70">1.0.0</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Storage</h3>
                  <p className="text-white/70">
                    TradeTrackr uses your browser's local storage to save data.
                    This means your data stays on your device and is not sent to any server.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Data Privacy</h3>
                  <p className="text-white/70">
                    All your trading data is stored locally on your device.
                    Make regular backups to prevent data loss when clearing browser data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings; 