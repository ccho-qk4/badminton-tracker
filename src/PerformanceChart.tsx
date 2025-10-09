import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  match: string;
  yourScore: number;
  opponentScore: number;
}

interface PerformanceChartProps {
  data: ChartData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="match" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="yourScore" fill="#10b981" name="Your Score" />
        <Bar dataKey="opponentScore" fill="#6b7280" name="Opponent" />
      </BarChart>
    </ResponsiveContainer>
  );
}
