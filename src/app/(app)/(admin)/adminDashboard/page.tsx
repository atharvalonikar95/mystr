'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';



const AdminDashboardPage = () => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await axios.get('/api/adminDashboard');
        console.log(res)
        setCount(res.data.userCount);
      } catch (err: any) {
        console.error(err);
        setError("You are not allowed to access this page.");
      } finally {
        setLoading(false);
      }
    };

    getInfo();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Welcome to Admin Dashboard</h1>
      <p>Number of admins: {count}</p>
      {/* <ul>
        {admins?.map(a => (
          <li key={a._id}>{a.username} ({a.email})</li>
        ))}
      </ul> */}
    </div>
  );
};

export default AdminDashboardPage;
