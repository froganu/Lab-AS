import { useEffect, useState } from "react";

export default function Forum() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users`)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h2>Usuaris registrats:</h2>
      <ul>
        {users.map(u => <li key={u.id}>{u.username} ({u.role})</li>)}
      </ul>
    </div>
  );
}
