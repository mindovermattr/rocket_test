import { NestFactory } from '@nestjs/core';
import { Command } from 'commander';
import { AppModule } from '../../app.module';
import { LeadsService } from '../../leads/leads.service';
import { PipelinesService } from '../../pipelines/pipelines.service';

interface PipelineStatus {
  id: number;
  name: string;
}

interface Pipeline {
  id: number;
  pipelineName: string;
  statuses: PipelineStatus[];
}

function randomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function seedLeadsCommand(program: Command) {
  program
    .command('seed-leads')
    .description('Create 1 lead in each pipeline status (distributed evenly across stages)')
    .option('-d, --dry-run', 'Show what would be created without sending requests', false)
    .action(async (opts: { dryRun: boolean }) => {
      const app = await NestFactory.createApplicationContext(AppModule, {});

      try {
        const pipelinesService = app.get(PipelinesService);
        const leadsService = app.get(LeadsService);

        const pipelinesRaw = await pipelinesService.findAll();
        const pipelines = pipelinesRaw;

        if (!pipelines || pipelines.length === 0) {
          console.log('No pipelines found');
          return;
        }

        const leadsToCreate: Array<{ name: string; pipeline_id: number; status_id: number }> = [];

        for (const pipeline of pipelines) {
          const statuses = pipeline.statuses || [];
          if (statuses.length === 0) {
            continue;
          }
          for (let i = 0; i < statuses.length; i++) {
            const status = statuses[i];
            const id = randomId();
            leadsToCreate.push({
              name: `Тестовый лид [${pipeline.pipelineName}] ${id}`,
              pipeline_id: pipeline.id,
              status_id: status.id,
            });
          }
        }

        if (leadsToCreate.length === 0) {
          console.log('No statuses found to create leads in');
          return;
        }

        console.log(
          `Planned: ${leadsToCreate.length} leads (1 per status across ${pipelines.length} pipeline(s))`,
        );
        if (opts.dryRun) {
          for (const l of leadsToCreate) {
            console.log(`- ${l.name} | pipeline:${l.pipeline_id} status:${l.status_id}`);
          }
          return;
        }

        let totalCreated = 0;
        for (const pipeline of pipelines) {
          const statuses = pipeline.statuses || [];
          if (statuses.length === 0) continue;

          const batch: Array<{ name: string; pipeline_id: number; status_id: number }> = [];

          for (let i = 0; i < statuses.length; i++) {
            const status = statuses[i];
            const id = randomId();
            batch.push({
              name: `Тестовый лид [${pipeline.pipelineName}] ${id}`,
              pipeline_id: pipeline.id,
              status_id: status.id,
            });
          }

          const res = await leadsService.createMany(batch);
          const created = res?._embedded?.leads?.length || batch.length;
          totalCreated += Number(created);
          console.log(
            `Pipeline "${pipeline.pipelineName}" (${pipeline.id}): created ${created} lead(s)`,
          );
        }

        console.log(`Done. Total created: ${totalCreated}`);
      } catch (e) {
        console.log(e);
      } finally {
        await app.close();
      }
    });
}
