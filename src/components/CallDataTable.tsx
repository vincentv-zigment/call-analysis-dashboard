
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CallRecord } from "@/utils/csvParser";
import { DashboardMetrics } from "@/utils/dataAnalysis";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface CallDataTableProps {
  callRecords: CallRecord[];
  metrics: DashboardMetrics;
}

const CallDataTable = ({ callRecords, metrics }: CallDataTableProps) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "MMM d, yyyy");
    } catch (e) {
      return dateStr;
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0 ? `${hrs}h ${mins}m ${secs}s` : mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score > metrics.medianTotalScore) {
      return "text-green-600 font-medium";
    } else if (score < metrics.lowScoreThreshold) {
      return "text-red-600 font-medium";
    }
    return "";
  };

  // Helper function to safely format numerical values
  const safeFixed = (value: number | undefined, decimals: number = 1) => {
    return value !== undefined ? value.toFixed(decimals) : "N/A";
  };

  console.log(callRecords, 'callRecords');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Details</CardTitle>
        <CardDescription>
          Complete call records with performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto max-h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-secondary">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead>Script</TableHead>
                <TableHead>Opening</TableHead>
                <TableHead>Empathy</TableHead>
                <TableHead>Closing</TableHead>
                <TableHead className="text-right">Total Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{record.call_id}</TableCell>
                  <TableCell>{record.agent_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                      {formatDate(record.call_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      {formatDuration(record.talk_time_seconds)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.converted ? (
                      <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" /> Yes
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                        <XCircle className="mr-1 h-3 w-3" /> No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{safeFixed(record.script_adherence_score)}</TableCell>
                  <TableCell>{safeFixed(record.call_opening_score)}</TableCell>
                  <TableCell>{safeFixed(record.empathy_score)}</TableCell>
                  <TableCell>{safeFixed(record.call_closing_score)}</TableCell>
                  <TableCell className={`text-right ${getScoreColor(record.total_score || 0)}`}>
                    {safeFixed(record.total_score)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallDataTable;
