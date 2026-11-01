#!/usr/bin/env node
import { Command } from 'commander';
import { seedLeadsCommand } from './commands/seed-leads.command';

const program = new Command();

program.name('cli').description('Rocket test CLI').version('1.0.0');

seedLeadsCommand(program);

program.parseAsync(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
