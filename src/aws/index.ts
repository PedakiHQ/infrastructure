import { createFilesBucket } from './resources/files-bucket';
import { createRdsParameterGroup } from './resources/rds-group';
import { createStaticBucket } from './resources/static-bucket';
import { createSharedParameters } from './secrets/parameters';
import { createApiPulumiUser } from './users/api-pulumi';

createFilesBucket();
createStaticBucket();
createApiPulumiUser();
createSharedParameters();
createRdsParameterGroup();
