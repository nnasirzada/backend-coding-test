export default class ApiError {
  public static readonly VALIDATION_ERROR: string = 'VALIDATION_ERROR';

  public static readonly RIDES_NOT_FOUND_ERROR: string = 'RIDES_NOT_FOUND_ERROR';

  public static readonly SERVER_ERROR: string = 'SERVER_ERROR';

  constructor(public readonly error_code: string, public readonly error_message: string) {
  }
}
