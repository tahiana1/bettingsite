"use client";

import { gql, useMutation } from "@apollo/client";
import Card from "antd/es/card/Card";
import { useState } from "react";

const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file)
  }
`;

export default function FileUploadForm() {
  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      const res = await uploadFile({ variables: { file } });
      console.log("Uploaded:", res.data.uploadFile);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit">Upload</button>
      </form>
    </Card>
  );
}
