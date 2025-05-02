"use client";
import client from "@/api/apollo-client-ws";
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
    }
  }
`;

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
