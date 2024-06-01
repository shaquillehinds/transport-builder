#!/usr/bin/env node

import { program } from "commander";
import * as commands from "./commands";

program.version("1.0.0").description("Create or modify transports");

// Adding commands to program
for (let command in commands) {
  const commandKey = command as keyof typeof commands;
  commands[commandKey](program);
}

program.parse(process.argv);
