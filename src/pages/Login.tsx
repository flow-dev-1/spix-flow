import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/navbar/Navbar";
import "@/styles/onboarding.css";
import heroBg from "@/assets/course2.png";

export default function Login() {
  const navigate = useNavigate();

  const handleRespectSignIn = () => {
    // TODO (Phase 3): trigger libRESPECT SSO flow
    navigate("/courses");
  };

  return (
    <div className="root-layout">
      <Navbar />

      <div
        style={{
          minHeight: "calc(100vh - 70px)",
          marginTop: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          background: "#f8f8f8",
        }}
      >
        <div
          className="registration-page sign-in"
          style={{ maxWidth: "420px", width: "100%", borderRadius: "15px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden", padding: 0 }}
        >
          {/* Generic hero banner */}
          <img
            src={heroBg}
            alt="Flow courses"
            style={{
              width: "100%",
              height: "140px",
              objectFit: "cover",
              display: "block",
            }}
          />

          <div style={{ padding: "1.5rem" }}>
            <h2 className="text-center" style={{ color: "#275DAD", fontSize: "26px", fontWeight: 700, marginBottom: "0.4rem" }}>
              Welcome to Flow TEST
            </h2>

            <p className="text-center" style={{ color: "#5b616a", fontSize: "14px", marginBottom: "0.4rem" }}>
              Your professional learning platform
            </p>
            <p className="text-center" style={{ color: "#00BCC3", fontWeight: 600, fontSize: "14px", marginBottom: "1.5rem" }}>
              Leaving no learner behind.
            </p>

            <hr style={{ borderColor: "#ecedf0", margin: "0 0 1.5rem 0" }} />

            {/* RESPECT Sign In */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <button
                className="btn submit-btn"
                style={{ width: "100%", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "15px", padding: "12px" }}
                onClick={handleRespectSignIn}
              >
                <Icon icon="mdi:shield-account" width={22} />
                Sign in with RESPECT
              </button>

              <p style={{ color: "#5b616a", fontSize: "12px", textAlign: "center", marginTop: "0.5rem" }}>
                This app uses the RESPECT Launcher for single sign‑on.
                <br />Install the RESPECT Launcher to access your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
