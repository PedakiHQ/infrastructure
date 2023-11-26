import { createStaticBucket } from './resources/static';
import { createSharedParameters } from './secrets/parameters';
import { createApiPulumiUser } from './users/api-pulumi';
import {createRdsParameterGroup} from "./resources/rds-group";

createStaticBucket();
createApiPulumiUser();
createSharedParameters();
createRdsParameterGroup();
