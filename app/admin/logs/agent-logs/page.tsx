'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Agent {
  id: string;
  name: string;
  email: string;
  last_active: string | null;
  logged_in: boolean;
  loggedInToday?: boolean;
  totalHoursToday?: number;
}

export default function AgentLogsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const { data: agentsData, error } = await supabase
      .from('service_agents')
      .select('id, name, email, last_active, logged_in');
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!agentsData || error) return;

    const { data: sessionsData } = await supabase
      .from('agent_login_sessions')
      .select('agent_id, login_time, logout_time, date');

    const today = new Date().toISOString().slice(0, 10);

    const merged = agentsData.map((agent) => {
      const todaySessions = sessionsData?.filter(
        (s) =>
          s.agent_id === agent.id &&
          new Date(s.date).toISOString().slice(0, 10) === today
      ) || [];

      const totalDurationToday = todaySessions.reduce((acc, session) => {
        const start = new Date(session.login_time).getTime();
        const end = session.logout_time
          ? new Date(session.logout_time).getTime()
          : Date.now();
        return acc + (end - start);
      }, 0);

      return {
        ...agent,
        loggedInToday: todaySessions.length > 0,
        totalHoursToday: +(totalDurationToday / (1000 * 60 * 60)).toFixed(2),
      };
    });

    setAgents(merged);
  };

  return (
    <div className="p-6 h-[calc(100vh-100px)] flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-highlight">Service Agent Logs</h2>
      <Table className='bg-transparent text-foreground rounded-md'>
        <TableHeader className="sticky top-0 z-10 bg-muted/30 backdrop-blur text-highlight">
          <TableRow className='rounded-md'>
            <TableHead className="whitespace-nowrap text-highlight">Agent</TableHead>
            <TableHead className="whitespace-nowrap text-highlight">Email</TableHead>
            <TableHead className="whitespace-nowrap text-highlight">Last Active</TableHead>
            <TableHead className="whitespace-nowrap text-highlight">Logged in Time Today</TableHead>
            <TableHead className="whitespace-nowrap text-highlight">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow
              key={agent.id}
              className="cursor-pointer hover:bg-muted transition"
              onClick={() => router.push(`/admin/logs/agent-logs/${agent.id}`)}
            >

              <TableCell>{agent.name}</TableCell>
              <TableCell>{agent.email}</TableCell>
              <TableCell>
                {agent.last_active
                  ? formatDistanceToNow(new Date(agent.last_active), {
                    addSuffix: true,
                  })
                  : "Never"}
              </TableCell>
              <TableCell>
                {agent.loggedInToday ? (
                  <span className="text-green-600 font-medium">
                    {Math.floor(agent.totalHoursToday || 0)} hrs and{' '}
                    {Math.round(((agent.totalHoursToday || 0) % 1) * 60)} mins
                  </span>
                ) : (
                  <span className="text-red-500">Not logged in today</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant="default"
                  className={
                    agent.logged_in
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }
                >
                  {agent.logged_in ? "Online" : "Offline"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}