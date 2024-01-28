import * as aws from '@pulumi/aws';
import { TAGS } from '../constants';

export const createRdsParameterGroup = () => {
  const group = new aws.rds.ParameterGroup('rds-pedaki', {
    family: 'postgres16',
    description: 'Shared parameter group',
    name: 'rds-pedaki',
    parameters: [],
    tags: TAGS,
  });
};
