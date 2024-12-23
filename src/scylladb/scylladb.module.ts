// src/scylladb/scylladb.module.ts
import { Module } from "@nestjs/common";
import { ScyllaDbService } from "./scylladb.service";

@Module({
  providers: [ScyllaDbService],
  exports: [ScyllaDbService],
})
export class ScyllaDbModule {}
