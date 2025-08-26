import { useEffect, useState } from "react";


export default function Dashboard() {
const [stats, setStats] = useState({
total_records: 0,
total_parts: 0,
todays_records: 0,
recent_records: []
});


useEffect(() => {
fetch("http://localhost/backend/api/dashboard.php")
.then(res => res.json())
.then(data => setStats(data))
.catch(err => console.error("Error fetching dashboard data:", err));
}, []);


return (
<div className="p-6">
<h1 className="text-2xl font-bold text-blue-700 mb-6">Dashboard</h1>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="bg-blue-100 p-4 rounded-xl shadow">
<h2 className="text-lg font-semibold">Total Records</h2>
<p className="text-3xl font-bold">{stats.total_records}</p>
</div>
<div className="bg-blue-100 p-4 rounded-xl shadow">
<h2 className="text-lg font-semibold">Total Parts</h2>
<p className="text-3xl font-bold">{stats.total_parts}</p>
</div>
<div className="bg-blue-100 p-4 rounded-xl shadow">
<h2 className="text-lg font-semibold">Today's Records</h2>
<p className="text-3xl font-bold">{stats.todays_records}</p>
</div>
</div>


<div className="mt-8">
<h2 className="text-xl font-semibold mb-4">Recent Records</h2>
<table className="w-full border border-gray-300 rounded-xl overflow-hidden">
<thead className="bg-blue-200">
<tr>
<th className="p-2">ID</th>
<th className="p-2">Tool</th>
<th className="p-2">Machine</th>
<th className="p-2">Parts</th>
<th className="p-2">Entry</th>
<th className="p-2">Exit</th>
</tr>
</thead>
<tbody>
{stats.recent_records.map((rec) => (
<tr key={rec.id} className="text-center border-t">
<td className="p-2">{rec.id}</td>
<td className="p-2">{rec.tool}</td>
<td className="p-2">{rec.machine}</td>
<td className="p-2">{rec.parts_produced}</td>
<td className="p-2">{rec.entry_date} {rec.entry_time}</td>
<td className="p-2">{rec.exit_date} {rec.exit_time}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}