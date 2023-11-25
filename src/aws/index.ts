import { createStaticBucket } from './resources/static';
import { createSharedParameters } from './secrets/parameters';
import { createApiPulumiUser } from './users/api-pulumi';

createStaticBucket();
createApiPulumiUser();
createSharedParameters();
