import {TaskMiscVariableConfig} from './tasks/MiscConfigTask';
import {TaskConfig} from './tasks/BaseTask';
import {TaskFrontendImageConfig} from './tasks/FrontendImageTask';
import {TaskFrontendJsConfig} from './tasks/FrontendJsTask';
import {TaskFrontendScssConfig} from './tasks/FrontendScssTask';

export interface DefaultTasks {
    'FRONTEND:SCSS': TaskFrontendScssConfig,
    'FRONTEND:JS': TaskFrontendJsConfig,
    'FRONTEND:IMAGES': TaskFrontendImageConfig,
    'FRONTEND:FONTS': TaskConfig,
    'BACKEND:JS': TaskConfig,
    'BACKEND:SCSS': TaskConfig,
    'MISC:CLEAN': { },
    'MISC:CONFIG': TaskMiscVariableConfig
}
