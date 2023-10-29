import {createStaticBucket} from "./resources/static";
import {createApiPulumiUser} from "./users/api-pulumi";

createStaticBucket();
createApiPulumiUser();
