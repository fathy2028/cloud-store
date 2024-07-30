import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function PrivateRoutes() {
    const [Ok, setOK] = useState(false);
    const [auth, setAuth] = useAuth();
    const backendUrl = process.env.BACKEND_URL || "https://cloud-pharmacy-api.vercel.app"

    useEffect(() => {
        const authCheck = async () => {
            const res = await axios.get(`${backendUrl}/api/v1/auth/user-auth`);
            if (res.data.ok) {
                setOK(true);
            } else {
                setOK(false);
            }
        };
        if (auth?.token) {
            authCheck();
        }
    }, [auth?.token, backendUrl]);

    return Ok ? <Outlet /> : <Spinner />;
}
