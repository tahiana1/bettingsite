"use client";
import { GET_USERS } from "@/actions/user";
import client from "@/api/apollo-client-ws";
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";

export default function UsersPage() {
  const { loading, error, data } = useQuery(GET_USERS);
  useEffect(() => {
    client
      .subscribe({
        query: gql`
          subscription {
            time
          }
        `,
      })
      .subscribe({
        next({ data }) {
          console.log("Received:", data.time);
        },
      });
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {data.users.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
