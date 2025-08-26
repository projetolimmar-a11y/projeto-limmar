import { useEffect, useState } from "react";


export default function Records() {
const [records, setRecords] = useState([]);
const [form, setForm] = useState({
id: "",
tool: "",
machine: "",
parts_produced: "",
entry_date: "",
exit_date: "",
entry_time: "",
exit_time: ""
});

const [search, setSearch] = useState("");


const fetchRecords = () => {
fetch("http://localhost/backend/api/records.php")
.then(res => res.json())
.then(data => setRecords(data))
.catch(err => console.error("Error fetching records:", err));
};


useEffect(() => {
fetchRecords();
}, []);


const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};


const handleClear = () => {
setForm({ id: "", tool: "", machine: "", parts_produced: "", entry_date: "", exit_date: "", entry_time: "", exit_time: "" });
};


const handleSave = () => {
const method = form.id ? "PUT" : "POST";
fetch("http://localhost/backend/api/records.php", {
method,
headers: { "Content-Type": "application/json" },
body: JSON.stringify(form)
})