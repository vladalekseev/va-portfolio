// Vercel's function bundler doesn't resolve tsconfig path aliases.
import { handleApiRequest } from '../../libs/api/src/server';

export default { fetch: handleApiRequest };
