import React, { useEffect, useState } from "react";
import axios from "axios";

function Preview() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setUsers(response.data);
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (users.length === 0) {
    return <div>No user data available</div>;
  }

  return (
    <div>
      <h1>User Data</h1>
      <div className="user-details">
        {users.map((user) => (
          <div
            key={user.id}
            className="user-container w-full flex flex-col mt-20"
          >
            <div className="h-[151.875rem] flex flex-row w-full">
              <div className="h-full flex flex-col w-[52.313rem] ml-12">
                <div className="flex flex-row w-full justify-between mt-10 h-[6.5rem] mt-4">
                  <div className="w-[44.813rem]">
                    <h1 className="font-MerriweatherSans font-normal text-[26px]">
                      {user.bhktype} {user.propertysubtype} FOR{" "}
                      {user.propertyfor} in {user.building} (545 Sq. Ft)
                    </h1>
                    <div className="flex flex-row">
                      <img
                        src="loc.png"
                        className="h-[22px] w-[22px]"
                        alt="location icon"
                      />
                      <p className="font-Inter text-[16px] font-normal">
                        {user.building} {user.locality} {user.landmark}{" "}
                        {user.city}
                      </p>
                    </div>
                  </div>
                  <div className="w-[5.75rem] h-[5rem] flex flex-row bg-white justify-between items-end">
                    <img
                      className="w-[43.4px] h-[43.4px]"
                      src="like.png"
                      alt="like icon"
                    />
                    <img
                      className="w-[43.4px] h-[43.4px]"
                      src="share.png"
                      alt="share icon"
                    />
                  </div>
                </div>
                <div className="h-[25.313rem] w-full">
                  <div className="h-[23.5rem] flex items-center bg-[#C4C4C4] justify-between flex flex-row">
                    <img src="Frame.png" alt="frame" />
                    <img src="Frame 666.png" alt="frame 666" />
                    <img src="Frame2.png" alt="frame2" />
                  </div>
                  <div className="w-[2rem] bg-black"></div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Preview;
