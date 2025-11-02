import { Link } from "react-router-dom";
import { LoginButton } from "./LoginAuth";
import { LogoutButton } from "./LogOut";
import { Profile } from "./Profile";
import { useAuth0 } from "@auth0/auth0-react";

export default function Home() {

  const { isAuthenticated } = useAuth0();

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

        {isAuthenticated ? (
          <div>
            <Profile />
            <LogoutButton style={{ marginLeft: "30px" }} />
          </div>
        ) : (
          <LoginButton style={{ marginLeft: "30px" }} />
        )}

      </div>
    </div >
  );
}
