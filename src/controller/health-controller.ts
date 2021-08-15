import { Request, Response } from 'express';
import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { Service } from 'typedi';

@Service()
@ApiPath({
  path: '/health',
  name: 'Health',
})
class HealthController {
  @ApiOperationGet({
    description: 'Dummy endpoint to retrieve health status of the API',
    summary: 'Get health',
    responses: {
      200: { description: 'Success', type: SwaggerDefinitionConstant.Response.Type.STRING },
    },
  })
  getHealth(req: Request, res: Response) { // eslint-disable-line class-methods-use-this
    return res.send('Healthy');
  }
}

export default HealthController;
