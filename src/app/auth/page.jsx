'use client';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { tokenizer } from "@/lib/tokenizer";

export default function Auth() {
  const [payload, setPayload] = useState(null);
  const token = useSearchParams().get("token");

  useEffect(() => {
    if (!token) return;

    tokenizer(token).then((result) => {
      setPayload(result);
    });
  }, [token]);

  if (!payload) return <div>Loading...</div>;

  const isError = typeof payload === "string";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        padding: "20px",
      }}
    >
      <div style={{ textAlign: isError ? "center" : "left", maxWidth: "600px" }}>
        {isError ? (
          <div style={{ color: "red", fontWeight: "bold" }}>{payload}</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Object.entries(payload).map(([key, value]) => (
              <li key={key} style={{ margin: "5px 0" }}>
                <strong>{key}:</strong> {JSON.stringify(value)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
