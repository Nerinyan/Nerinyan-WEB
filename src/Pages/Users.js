import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Popover } from 'antd';

function Users() {
  const [beatmaps, setBeatmaps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setError(null);
      setBeatmaps(null);
      setLoading(null);

      const response = await axios.get(
        "https://api.nerina.pw/search"
      );
      setBeatmaps(response.data);
    }
    catch(e) {
      setError(e)
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!beatmaps) return <div>?</div>;
  return (
    <>
      <ul>
        {beatmaps.map(beatmap => (
          <li key={beatmap.id}>
            <Popover placement="top" title={beatmap.title} content={beatmap.id} trigger="click">
              <Button>{beatmap.id}</Button>
            </Popover>
          </li>
        ))}
      </ul>
      <button onClick={fetchUsers}>다시 불러오기</button>
    </>
  );
}

export default Users;
