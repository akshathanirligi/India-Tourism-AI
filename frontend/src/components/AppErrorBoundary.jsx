import { Component } from "react";

class AppErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-slate-800">
          <section className="max-w-lg rounded-2xl bg-white p-6 shadow">
            <h1 className="text-xl font-bold">This screen hit an error</h1>
            <p className="mt-3 text-slate-600">
              {this.state.error.message || "An unexpected error occurred."}
            </p>
            <button
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
              onClick={() => window.location.assign("/")}
            >
              Return to trip planner
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
