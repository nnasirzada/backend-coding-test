import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Represents an error of API',
  name: 'API Error',
})
class ApiError extends Error {
  public static readonly VALIDATION_ERROR: string = 'VALIDATION_ERROR';

  public static readonly RIDES_NOT_FOUND_ERROR: string = 'RIDES_NOT_FOUND_ERROR';

  public static readonly SERVER_ERROR: string = 'SERVER_ERROR';

  @ApiModelProperty({
    description: 'Code of API error',
    required: true,
    example: 'VALIDATION_ERROR',
    enum: ['VALIDATION_ERROR', 'RIDES_NOT_FOUND_ERROR', 'SERVER_ERROR'],
  })
  error_code: string;

  @ApiModelProperty({
    description: 'Message of API error',
    required: true,
    example: 'Rider name must be a non empty string',
  })
  error_message: string;

  constructor(error_code: string, error_message: string) {
    super(error_message);
    this.error_code = error_code;
    this.error_message = error_message;
  }
}

export default ApiError;
