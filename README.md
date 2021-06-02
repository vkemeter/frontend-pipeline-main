# Frontend Pipeline Main

## Environment Variables

| NAME | DEFAULT VALUE | DESCRIPTION |
| --- | --- | --- |
| `PIPELINE_CONTEXT_PATH` | `process.cwd()` | Absolute path of origin of all other context-sensitive paths |
| `PIPELINE_CONFIG_FILENAME` | `pipeline.config.js` |  Filename of the pipeline-configuration |
| `PIPELINE_VARIABLES_FILENAME` | `variables.config.js` | Variables to be exported |
| `PIPELINE_SRC_FOLDER` | `Src/` | Base directory for source-files (relative to execution path) |
| `PIPELINE_DEST_FOLDER` | `../Resources/Public/` | Base directory for dest-files (relative to execution path) |
| `NODE_EMV` | `development` | Defines wether to create builds for development or production |
| `PIPELINE_TASK_PATH` | `./tasks/` | Path to the directory where the tasks are located (absolute path) |
| `PIPELINE_TASK_FILE_EXTENSION` | `.ts` | File extension of task files |

## TODOs

- AspectRatio Preset with aspect-ratio-property
- FavIcon Task
