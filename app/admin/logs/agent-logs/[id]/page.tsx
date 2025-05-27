'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

interface Log {
   id: string;
   agent_email: string;
   action: string;
   created_at: string;
}

interface Session {
   id: string;
   login_time: string;
   logout_time: string | null;
   date: string;
}

interface Agent {
   full_name: string;
   email: string;
   created_at: string;
}

export default function AgentLogDetailPage() {
   const params = useParams() ?? {};
   const rawId = params.id;
   const id = Array.isArray(rawId) ? rawId[0] : rawId;
   const router = useRouter();

   const [agent, setAgent] = useState<Agent | null>(null);
   const [logs, setLogs] = useState<Log[]>([]);
   const [sessions, setSessions] = useState<Session[]>([]);
   const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
   const [fromDate, setFromDate] = useState<Date>(new Date());
   const [toDate, setToDate] = useState<Date>(new Date());

   useEffect(() => {
      if (id) {
         fetchAgentInfo(id);
         fetchAgentLogs(id);
         fetchAgentSessions(id);
      }
   }, [id]);

   const fetchAgentInfo = async (agentId: string) => {
      const { data, error } = await supabase
         .from('service_agents')
         .select('full_name, email, created_at')
         .eq('id', agentId)
         .single();

      if (!error) setAgent(data as Agent);
   };

   const fetchAgentLogs = async (agentId: string) => {
      const { data, error } = await supabase
         .from('service_agent_logs')
         .select('id, agent_email, action, created_at')
         .eq('agent_id', agentId)
         .order('created_at', { ascending: false });

      if (!error) setLogs(data as Log[]);
   };

   const fetchAgentSessions = async (agentId: string) => {
  const { data, error } = await supabase
    .from('agent_login_sessions')
    .select('id, login_time, logout_time, date')
    .eq('agent_id', agentId)
    .order('login_time', { ascending: false });

  if (!error) {
    const sessionList = data as Session[];
    setSessions(sessionList);
    setFilteredSessions(sessionList.filter((s) => {
      const d = new Date(s.date);
      return d >= fromDate && d <= toDate;
    }));
  }
};


   const handleFilter = () => {
      const filtered = sessions.filter((s) => {
         const d = new Date(s.date);
         return d >= fromDate && d <= toDate;
      });
      setFilteredSessions(filtered);
   };

   const downloadCSV = () => {
      if (!agent) return;

      const agentName = agent.full_name.replace(/\s+/g, "_").toLowerCase(); // clean filename
      const fromStr = fromDate.toISOString().slice(0, 10);
      const toStr = toDate.toISOString().slice(0, 10);
      const todayStr = new Date().toISOString().slice(0, 10);

      const isTodayOnly = fromStr === toStr && toStr === todayStr;

      const fileName = isTodayOnly
         ? `${agentName}_${todayStr}.csv`
         : `${agentName}_${fromStr}_to_${toStr}.csv`;

      const rows = [
         ["Date", "Login Time", "Logout Time", "Duration (hrs)"],
         ...filteredSessions.map((s) => {
            const login = new Date(s.login_time);
            const logout = s.logout_time ? new Date(s.logout_time) : null;
            const duration = logout
               ? ((logout.getTime() - login.getTime()) / 3600000).toFixed(2)
               : "Ongoing";
            return [
               s.date,
               login.toLocaleTimeString(),
               logout ? logout.toLocaleTimeString() : "Still Active",
               duration,
            ];
         }),
      ];

      const csvContent = rows.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
   };

   return (
      <div className="p-6 space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-xl text-highlight font-bold">{agent?.full_name || 'Service Agent'}</h2>
               <p className="text-muted-foreground text-sm">{agent?.email}</p>
            </div>
            <Button variant="default" className='bg-orange-500 hover:bg-orange-600 text-foreground' onClick={() => router.back()}>
               ← Back
            </Button>
         </div>

         {/* Filters */}
         <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2">
               <label className="text-sm text-foreground font-medium">From:</label>
               <input
                  type="date"
                  value={fromDate.toISOString().slice(0, 10)}
                  min={agent?.created_at?.slice(0, 10)}
                  onChange={(e) => setFromDate(new Date(e.target.value))}
                  className="border bg-gray text-foreground rounded px-2 py-1 text-sm"
               />

               <label className="text-sm text-foreground font-medium">To:</label>
               <input
                  type="date"
                  value={toDate.toISOString().slice(0, 10)}
                  min={fromDate.toISOString().slice(0, 10)}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setToDate(new Date(e.target.value))}
                  className="border bg-gray text-foreground rounded px-2 py-1 text-sm"
               />

            </div>
            <div className="flex items-center gap-2 text-foreground">
               <Button variant="default" className='bg-yellow-500 hover:bg-yellow-600 text-foreground' onClick={handleFilter}>View</Button>
               <Button variant="default" className='bg-blue-500 hover:bg-blue-600 text-foreground' onClick={downloadCSV}>Download CSV</Button>
            </div>
         </div>

         {/* Agent Action Logs */}
         <div>
            <h3 className="text-lg text-foreground font-semibold mb-2">Recent Activity</h3>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
               {logs.length === 0 ? (
                  <p className="text-sm text-foreground text-muted-foreground">No activity found.</p>
               ) : (
                  logs.map((log) => (
                     <div
                        key={log.id}
                        className="border p-4 rounded-lg bg-gray text-foreground shadow-sm"
                     >
                        <p className="font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                           {formatDistanceToNow(new Date(log.created_at), {
                              addSuffix: true,
                           })}
                        </p>
                     </div>
                  ))
               )}
            </div>
         </div>

         {/* Session History */}
         <div className="space-y-4">
            <h3 className="text-lg text-foreground font-semibold">Session History</h3>
            {filteredSessions.length === 0 ? (
               <p className="text-sm text-foreground text-muted-foreground">No sessions found for selected range.</p>
            ) : (
               filteredSessions.map((session) => {
                  const login = new Date(session.login_time);
                  const logout = session.logout_time
                     ? new Date(session.logout_time)
                     : null;

                  const duration = logout
                     ? ((logout.getTime() - login.getTime()) / (1000 * 60 * 60)).toFixed(2)
                     : 'Ongoing';

                  return (
                     <div
                        key={session.id}
                        className="border p-4 text-foreground bg-gray rounded-lg bg-muted shadow-sm space-y-1"
                     >
                        <p className="text-sm text-foreground">
                           <strong>Date:</strong> {session.date}
                        </p>
                        <p className="text-sm text-foreground">
                           <strong>Login:</strong>{' '}
                           {login.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-foreground">
                           <strong>Logout:</strong>{' '}
                           {logout
                              ? logout.toLocaleTimeString([], {
                                 hour: '2-digit',
                                 minute: '2-digit',
                              })
                              : 'Still Active'}
                        </p>
                        <p className="text-sm text-foreground">
                           <strong>Duration:</strong>{' '}
                           {duration === 'Ongoing' ? (
                              <span className="text-yellow-600">Ongoing</span>
                           ) : (
                              `${duration} hrs`
                           )}
                        </p>
                     </div>
                  );
               })
            )}
         </div>
      </div>
   );
}
