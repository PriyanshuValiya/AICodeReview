"use client";

import { useEffect, useState } from "react";
import {
  addClient,
  addRepoClient,
  getRepoClientMap,
  sendEmail,
} from "@/module/repo-client/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Client = {
  id: string;
  name: string;
  email: string;
};

type Repo = {
  id: string;
  name: string;
  fullName: string;
  url: string;
  repositoryClients: {
    client: Client;
  }[];
};

export default function ClientsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [repoId, setRepoId] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  async function loadData() {
    try {
      const data = await getRepoClientMap();
      setRepos(data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load repositories");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const client = await addClient(name, email);
      await addRepoClient(repoId, client.id);

      toast.success("Client mapped to repository successfully");

      setName("");
      setEmail("");
      setRepoId("");

      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add client");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendEmail(repoIdToSend: string) {
    setSendingEmail(repoIdToSend);
    
    try {
      const result = await sendEmail(repoIdToSend);
      
      if (result.success) {
        toast.success("Email queued successfully! Clients will receive it shortly.");
      } else {
        toast.error("Failed to send email");
      }
    } catch (error: any) {
      console.error("Can't send email:", error);
      toast.error(error.message || "Failed to send email");
    } finally {
      setSendingEmail(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">Add Client</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Client Name"
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Client Email"
            className="w-full border p-2 rounded"
            required
          />

          <select
            value={repoId}
            onChange={(e) => setRepoId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Repository</option>
            {repos.map((repo) => (
              <option key={repo.id} value={repo.id}>
                {repo.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Client"}
          </button>
        </form>
      </div>

      {/* Repository - Client Mapping */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Repository - Client Mapping
        </h2>

        {repos.length === 0 && (
          <p className="text-sm text-gray-500">No repositories found.</p>
        )}

        <div className="space-y-6">
          {repos.map((repo) => (
            <div key={repo.id} className="border rounded p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{repo.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{repo.fullName}</p>
                </div>
                
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSendEmail(repo.id);
                  }}
                  disabled={sendingEmail === repo.id || repo.repositoryClients.length === 0}
                  size="sm"
                  type="button"
                >
                  {sendingEmail === repo.id ? "Sending..." : "Send Email"}
                </Button>
              </div>

              {repo.repositoryClients.length === 0 ? (
                <p className="text-sm text-gray-500">No clients mapped</p>
              ) : (
                <div>
                  <p className="text-sm font-medium mb-2">Mapped Clients:</p>
                  <ul className="text-sm space-y-1">
                    {repo.repositoryClients.map(({ client }) => (
                      <li key={client.id} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <b>{client.name}</b> — {client.email}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}