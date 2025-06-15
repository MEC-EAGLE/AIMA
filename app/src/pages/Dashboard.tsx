import SearchBar from "../components/SearchBar";

function Dashboard() {
  return (
    <div className="container mt-5">
      <SearchBar />
      <h2 className="mt-4">Welcome to your Dashboard</h2>
      <p>Select options from the navigation bar.</p>
    </div>
  );
}

export default Dashboard;
