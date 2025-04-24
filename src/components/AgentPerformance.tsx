
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AgentPerformance } from "@/utils/dataAnalysis";
import { BarChart, PieChart } from "recharts";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Pie, Cell } from "recharts";

interface AgentPerformanceProps {
  agentPerformance: AgentPerformance[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const AgentPerformanceCharts = ({ agentPerformance }: AgentPerformanceProps) => {
  // Prepare data for average score chart
  const averageScoreData = agentPerformance.map(agent => ({
    name: agent.agentId,
    score: parseFloat(agent.averageScore.toFixed(1)),
    calls: agent.totalCalls,
  }));

  // Prepare data for script adherence chart
  const scriptAdherenceData = agentPerformance.map(agent => ({
    name: agent.agentId,
    score: parseFloat(agent.scriptAdherenceScore.toFixed(1)),
  }));

  // Prepare data for conversion rate pie chart
  const conversionData = agentPerformance.map((agent, index) => ({
    name: agent.agentId,
    value: agent.conversions,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Average Scores</CardTitle>
          <CardDescription>
            Overall performance by agent
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 ">
          <div className="flex items-center justify-end gap-4 mb-4 ">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#8884d8] rounded-full mr-2"></div>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#82ca9d] rounded-full mr-2"></div>
              <p className="text-sm text-gray-500">Total Calls</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={averageScoreData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score"  name="Average Score" fill="#8884d8" />
              <Bar dataKey="calls"  name="Total Calls" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Best Script Adherence Scores</CardTitle>
          <CardDescription>
            Highest script adherence score by agent
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <div className="flex items-center justify-end gap-4 mb-4 ">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#ff7300] rounded-full mr-2"></div>
              <p className="text-sm text-gray-500">Script Adherence</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={scriptAdherenceData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" name="Script Adherence" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentPerformanceCharts;
