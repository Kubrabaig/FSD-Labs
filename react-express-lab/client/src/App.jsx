import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export default function App() {

  const [count, setCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/hello`)
      .then(res => setApiMessage(res.data.message))
      .catch(() => setApiMessage('Could not reach API'));
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/tasks`);
      setTasks(res.data);
    } catch (err) {
      alert('Server not running');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!newTitle.trim()) return;

    const res = await axios.post(`${API_BASE}/tasks`, {
      title: newTitle
    });

    setTasks([...tasks, res.data]);
    setNewTitle('');
  };

  const toggleTask = async (id) => {
    const res = await axios.patch(`${API_BASE}/tasks/${id}/toggle`);

    setTasks(tasks.map(t =>
      t.id === id ? res.data : t
    ));
  };

  return (
    <div style={{padding:30,fontFamily:"Arial"}}>

      <h1>React + Express Lab</h1>

      <p>{apiMessage}</p>

      <h2>Counter</h2>

      <h3>{count}</h3>

      <button onClick={()=>setCount(count+1)}>Increment</button>
      <button onClick={()=>setCount(0)}>Reset</button>

      <hr/>

      <h2>Task App</h2>

      <form onSubmit={addTask}>
        <input
          value={newTitle}
          onChange={(e)=>setNewTitle(e.target.value)}
          placeholder="Enter task"
        />
        <button>Add</button>
      </form>

      <button onClick={loadTasks}>
        {loading ? "Loading..." : "Reload Tasks"}
      </button>

      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={()=>toggleTask(t.id)}
            />

            <span style={{
              textDecoration: t.done ? "line-through" : "none"
            }}>
              {t.title}
            </span>
          </li>
        ))}
      </ul>

    </div>
  );
}