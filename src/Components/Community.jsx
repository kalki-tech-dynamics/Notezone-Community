import React, { useEffect, useState } from "react";
import BASE_URL from "../Services/Base_URL.jsx";
import './c.css'
const Community = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${BASE_URL}/decode`, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (res.ok && data.noteuser) {
                    setUser(data.noteuser);
                    localStorage.setItem("noteuser", JSON.stringify(data.noteuser));
                } 
            } catch (err) {
                console.error(err);
                setTimeout(() => {
                    localStorage.removeItem("noteuser");
                    window.location.href = "https://notezone.in/login";
                }, 1000000);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);
    return (
        <div>Community <br />
            Welcome{" "}
            {loading ? (
                <span className="loader"></span>
            ) : (
                <span>{user?.name}</span>
            )}
        </div>

    )
}

export default Community