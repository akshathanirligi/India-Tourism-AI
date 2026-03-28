import Footer from "./Footer";
import Navbar from "./Navbar";

function SiteLayout({ children }) {
  return <div className="flex min-h-screen flex-col bg-slate-50"><Navbar /><div className="flex-1">{children}</div><Footer /></div>;
}

export default SiteLayout;
