import { type Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Relative path of the page, e.g. `/inventory.html` */
  protected abstract readonly path: string;

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }

  async currentUrl(): Promise<string> {
    return this.page.url();
  }
}
