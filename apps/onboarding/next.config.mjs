import path from 'node:path';
import {fileURLToPath} from 'node:url';
export default {assetPrefix:'/onboarding-static',turbopack:{root:path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..')}};
