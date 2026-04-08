import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiMail } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import SiteLayout from "../components/SiteLayout";
import { AuthShell, Input, PasswordInput, Submit } from "./Signup";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" }); const [remember, setRemember] = useState(true); const [showPassword, setShowPassword] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const navigate = useNavigate(); const location = useLocation(); const { setAuth } = useAuth();
  const submit = async (event) => { event.preventDefault(); setError(""); setLoading(true); try { const { data } = await api.post("/auth/login", form); setAuth(data, remember); navigate(location.state?.from || "/", { replace: true }); } catch (requestError) { setError(requestError.response?.data?.message || "Unable to sign in."); } finally { setLoading(false); } };
  return <SiteLayout><AuthShell title="Welcome back, traveler" subtitle="Sign in to keep your travel profile close at hand."><form onSubmit={submit} className="mt-6 space-y-4"><Input icon={FiMail} name="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email address" autoComplete="email" /><PasswordInput name="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" show={showPassword} toggle={() => setShowPassword(!showPassword)} autoComplete="current-password" /><div className="flex items-center justify-between gap-3 text-sm"><label className="flex cursor-pointer items-center gap-2 text-slate-600"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 rounded accent-sky-600" />Remember me</label><button type="button" className="font-semibold text-sky-700 hover:text-sky-900">Forgot password?</button></div>{error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}<Submit loading={loading}>Sign in <FiArrowRight /></Submit></form><p className="mt-6 text-center text-sm text-slate-600">New to India Tourism AI? <Link className="font-bold text-sky-700 hover:text-sky-900" to="/signup">Create an account</Link></p></AuthShell></SiteLayout>;
}

export default Login;
