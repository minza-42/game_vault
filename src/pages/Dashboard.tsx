function Dashboard() {
  return (
    <main className="dashboard">
      <section className="dashboard__welcome">
        <h2>Welcome to GameVault</h2>
        <p>Your personal gaming library.</p>
      </section>

      <section className="dashboard__stats">
        <article className="stat-card">
          <h3>Total Games</h3>
          <p>0</p>
        </article>

        <article className="stat-card">
          <h3>Currently Playing</h3>
          <p>0</p>
        </article>

        <article className="stat-card">
          <h3>Completed</h3>
          <p>0</p>
        </article>
      </section>
    </main>
  );
}

export default Dashboard;
