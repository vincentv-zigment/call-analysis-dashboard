
import { useState, useEffect } from "react";
import { parseCSV, CallRecord } from "@/utils/csvParser";
import { calculateDashboardMetrics, DashboardMetrics } from "@/utils/dataAnalysis";
import FileUploader from "@/components/FileUploader";
import SummaryCards from "@/components/SummaryCards";
import AgentPerformanceCharts from "@/components/AgentPerformance";
import CallDataTable from "@/components/CallDataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { FiSave } from "react-icons/fi";
import { AiOutlineEdit } from "react-icons/ai";
import { MdSave } from "react-icons/md";

const Index = () => {
  const [callRecords, setCallRecords] = useState<CallRecord[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title,setTitle] = useState('Call Analysis Dashboard')
  const [isEditing, setIsEditing] = useState(false);

  const handleDataLoaded = async (csvData: string, append: boolean) => {
    setIsLoading(true);
    try {
      const newRecords = await parseCSV(csvData);
      console.log(newRecords, 'newRecords');
      setCallRecords(prev => {
        const updatedRecords = append ? [...prev, ...newRecords] : newRecords;
        return updatedRecords;
      });
    } catch (error) {
      console.error("Error parsing CSV:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (callRecords.length > 0) {
      const calculatedMetrics = calculateDashboardMetrics(callRecords);
      setMetrics(calculatedMetrics);
    }
  }, [callRecords]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 border-b">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center w-full justify-between">
            <img 
              src="/lovable-uploads/a2a3af31-a4c3-40f4-96ae-4b9c73169fc7.png" 
              alt="Zigment Logo" 
              className="h-10"
            />
            <div className="flex items-center relative">
              <input disabled={!isEditing} value={title} className="p-1 px-2 pr-6 text-lg font-medium" onChange={(e)=>setTitle(e.target.value)}/>
              <button className="ml-2 p-1 text-lg font-medium absolute right-0" onClick={()=>setIsEditing(!isEditing)}>
                {isEditing ? <MdSave className="text-green-500 w-4 h-4" /> : <AiOutlineEdit className="text-blue-500 w-4 h-4" />}
              </button>
            </div>
             
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* File Uploader */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Call Data</h2>
          <FileUploader onDataLoaded={handleDataLoaded} isLoading={isLoading} />
        </div>

        {isLoading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        ) : metrics ? (
          <>
            {/* Summary Cards */}
            <SummaryCards metrics={metrics} />

            {/* Agent Performance Charts */}
            <h2 className="text-xl font-semibold mb-4">Agent Performance</h2>
            <AgentPerformanceCharts agentPerformance={metrics.agentPerformance} />
 
            <CallDataTable callRecords={callRecords} metrics={metrics} />
          </>
        ) : (
          <div className="bg-white p-8 rounded-lg border text-center">
            <h3 className="text-xl font-medium mb-2">No Data Available</h3>
            <p className="text-gray-500">
              Upload a CSV file to view call analytics.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
