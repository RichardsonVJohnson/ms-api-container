// src/scylladb/scylladb.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Client, ClientOptions } from "cassandra-driver";

@Injectable()
export class ScyllaDbService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  constructor() {
    const options: ClientOptions = {
      contactPoints: ["127.0.0.1"], // Replace with your ScyllaDB cluster IPs
      localDataCenter: "datacenter1", // Replace with your data center name
      keyspace: "youtube_comments", // Replace with your keyspace
      credentials: { username: "your_username", password: "your_password" }, // Optional, only if authentication is enabled
    };

    this.client = new Client(options);
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log("Connected to ScyllaDB");
    } catch (err) {
      console.error("Failed to connect to ScyllaDB", err);
    }
  }

  async onModuleDestroy() {
    await this.client.shutdown();
    console.log("ScyllaDB client disconnected");
  }

  getClient(): Client {
    return this.client;
  }
}
