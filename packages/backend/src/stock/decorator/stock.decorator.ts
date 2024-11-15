/* eslint-disable @typescript-eslint/naming-convention */
import { Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';

export function LimitQuery(defaultValue = 5): ParameterDecorator {
  return Query('limit', new DefaultValuePipe(defaultValue), ParseIntPipe);
}
