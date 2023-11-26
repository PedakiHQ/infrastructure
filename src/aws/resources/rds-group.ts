import * as aws from '@pulumi/aws';


export const createRdsParameterGroup = () => {
    const group = new aws.rds.ParameterGroup('rds-pedaki', {
        family: 'mysql8.0',
        description: "Shared parameter group",
        name: 'rds-pedaki',
        parameters: [
            {name: "require_secure_transport", value: "1"}
        ]
    });
}