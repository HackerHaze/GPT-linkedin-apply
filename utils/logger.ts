import fs from "fs";
import chalk from "chalk";
import path from "path";
import util from "util";
import { LogLevel as LOG_LEVELS } from "../constants/logger-constants";

type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

interface LogEntry {
  level: LogLevel;
  formattedMessage: string;
}

abstract class LogOutput {
  abstract write(logEntry: LogEntry): Promise<void>;
}

class ConsoleOutput extends LogOutput {
  private colors: Record<LogLevel, (message: string) => string>;

  constructor(colors: Record<LogLevel, (message: string) => string>) {
    super();
    this.colors = colors;
  }

  async write(logEntry: LogEntry): Promise<void> {
    console.log(this.colors[logEntry.level](logEntry.formattedMessage));
  }
}

class FileOutput extends LogOutput {
  private filePath: string | null = null;

  async setFilePath(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    try {
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises
        .access(filePath, fs.constants.F_OK)
        .catch(() => fs.promises.writeFile(filePath, ""));
      this.filePath = filePath;
    } catch (err) {
      throw new Error(`Failed to set output file: ${err as string}`);
    }
  }

  async write(logEntry: LogEntry): Promise<void> {
    if (!this.filePath) {
      throw new Error("File path not set for FileOutput");
    }
    try {
      await fs.promises.appendFile(
        this.filePath,
        logEntry.formattedMessage + "\n"
      );
    } catch (err) {
      console.error("Failed to write to log file:", err);
    }
  }

  hasFilePath(): boolean {
    return this.filePath !== null;
  }
}

export class CircularBuffer {
  private buffer: LogEntry[];
  private head: number;
  private tail: number;
  private count: number;

  constructor(private size: number) {
    this.buffer = new Array(size);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }

  push(item: LogEntry): void {
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.size;
    if (this.count < this.size) {
      this.count++;
    } else {
      this.head = (this.head + 1) % this.size;
    }
  }

  getItems(): LogEntry[] {
    if (this.count === 0) return [];
    const items: LogEntry[] = [];
    let index = this.head;
    for (let i = 0; i < this.count; i++) {
      items.push(this.buffer[index]);
      index = (index + 1) % this.size;
    }
    return items;
  }
}

class Logger {
  private static _instance: Logger | null = null;
  private level: LogLevel;
  private consoleOutput: ConsoleOutput;
  private fileOutput: FileOutput;
  private buffer: CircularBuffer;

  private constructor(bufferSize = 1000) {
    this.level = LOG_LEVELS.INFO;
    this.consoleOutput = new ConsoleOutput({
      [LOG_LEVELS.DEBUG]: chalk.gray,
      [LOG_LEVELS.INFO]: chalk.blue,
      [LOG_LEVELS.WARN]: chalk.yellow,
      [LOG_LEVELS.ERROR]: chalk.red,
    });
    this.fileOutput = new FileOutput();
    this.buffer = new CircularBuffer(bufferSize);
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  async setOutputFile(filePath: string): Promise<void> {
    await this.fileOutput.setFilePath(filePath);
  }

  async log(
    level: LogLevel,
    message: string,
    context: Record<string, unknown> = {}
  ): Promise<void> {
    if (this.shouldLog(level)) {
      const logEntry = this.formatLogEntry(level, message, context);
      this.buffer.push(logEntry);
      await this.processLog(logEntry);
    }
  }

  private async processLog(logEntry: LogEntry): Promise<void> {
    await this.consoleOutput.write(logEntry);
    if (this.fileOutput.hasFilePath()) {
      await this.fileOutput.write(logEntry);
    } else {
      console.log(logEntry.formattedMessage);
    }
  }

  private shouldLog(messageLevel: LogLevel): boolean {
    const levels = [
      LOG_LEVELS.DEBUG,
      LOG_LEVELS.INFO,
      LOG_LEVELS.WARN,
      LOG_LEVELS.ERROR,
    ];
    return levels.indexOf(messageLevel) >= levels.indexOf(this.level);
  }

  async debug(
    message: string,
    context?: Record<string, unknown>
  ): Promise<void> {
    await this.log(LOG_LEVELS.DEBUG, message, context);
  }

  async info(
    message: string,
    context?: Record<string, unknown>
  ): Promise<void> {
    await this.log(LOG_LEVELS.INFO, message, context);
  }

  async warn(
    message: string,
    context?: Record<string, unknown>
  ): Promise<void> {
    await this.log(LOG_LEVELS.WARN, message, context);
  }

  async error(
    message: string,
    context?: Record<string, unknown>
  ): Promise<void> {
    await this.log(LOG_LEVELS.ERROR, message, context);
  }

  getRecentLogs(): LogEntry[] {
    return this.buffer.getItems();
  }

  private formatLogEntry(
    level: LogLevel,
    message: string,
    context: Record<string, unknown>
  ): LogEntry {
    const timestamp = new Date().toISOString();
    const metaString = Object.entries(context)
      .map(
        ([key, value]) =>
          `${key}=${util.inspect(value, { depth: 2, breakLength: Infinity })}`
      )
      .join(" ");
    return {
      level,
      formattedMessage:
        `[${timestamp}] [${level}] ${message} ${metaString}`.trim(),
    };
  }

  static getInstance(): Logger {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }
    return Logger._instance;
  }
}

export const getLogger = (): Logger => Logger.getInstance();
