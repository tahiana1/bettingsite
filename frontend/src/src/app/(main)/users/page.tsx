"use client";
import { GET_USERS } from "@/actions/user";
import client from "@/api/apollo-client-ws";
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import Image from "next/image";
import LoadingGIF from '@/assets/img/loading.gif'
import { usePageTitle } from "@/hooks/usePageTitle";

export default function UsersPage() {
  usePageTitle("TOTOCLUB - Users Page");
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
  if (loading) return <Image src={LoadingGIF} alt="loading" width={100} height={100} />;
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
