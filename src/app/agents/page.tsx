"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AgentsDashboard() {
  const [agents, setAgents] = useState([
    { id: "cio", name: "CIO Agent", status: "active", tasks: 42 },
    { id: "scaling", name: "Scaling Agent", status: "active", tasks: 18 },
    { id: "customer", name: "Customer Agent", status: "active", tasks: 156 },
  ]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Paperclip Agent Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader>
              <CardTitle>{agent.name}</CardTitle>
              <CardDescription>Agent ID: {agent.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                  {agent.status}
                </Badge>
                <p className="text-sm text-muted-foreground">Tasks: {agent.tasks}</p>
                <Button size="sm" className="w-full">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
