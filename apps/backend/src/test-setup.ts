import { Logger } from '@nestjs/common';

// Services log every rejected request; keep test output readable.
Logger.overrideLogger(false);
