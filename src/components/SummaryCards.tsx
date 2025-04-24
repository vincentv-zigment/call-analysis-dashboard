
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardMetrics } from "@/utils/dataAnalysis";
import { Phone, Clock, LineChart, UserCheck } from "lucide-react";

interface SummaryCardsProps {
  metrics: DashboardMetrics;
}

const SummaryCards = ({ metrics }: SummaryCardsProps) => {
  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hrs}h ${mins}m`;
  };

  // Helper function to safely format numerical values
  const safeFixed = (value: number | undefined, decimals: number = 1) => {
    return value !== undefined ? value.toFixed(decimals) : "N/A";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription>Total Calls</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            <Phone className="h-5 w-5 mr-2 text-blue-500" />
            {metrics.totalCalls.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          All recorded calls in dataset
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription>Average Call Duration</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            <Clock className="h-5 w-5 mr-2 text-amber-500" />
            {Math.abs(metrics.averageCallDuration/60).toFixed(2)} minutes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Average time spent on calls
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription>Average Call Score</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-emerald-500" />
            {safeFixed(metrics.averageCallScore)}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Average performance score
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription>Total Conversions</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-purple-500" />
            {metrics.totalConversions.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {safeFixed(metrics.subscriptionRate)}% subscription rate
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
