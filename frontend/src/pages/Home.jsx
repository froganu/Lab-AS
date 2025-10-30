import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Benvingut al Forum</h1>
      <div style={{ marginTop: "20px" }}>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register" style={{ marginLeft: "10px" }}>
          <button>Registrar-se</button>
        </Link>
      </div>
    </div>
  );
}
