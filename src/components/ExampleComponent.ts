/**
 * ExampleComponent
 * 
 * Een voorbeeld component om de structuur te demonstreren.
 */

export interface ExampleComponentConfig {
  name: string;
  enabled: boolean;
  options?: string[];
}

export class ExampleComponent {
  private config: ExampleComponentConfig;

  constructor(config: ExampleComponentConfig) {
    this.config = config;
  }

  public getName(): string {
    return this.config.name;
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  public getOptions(): string[] {
    return this.config.options || [];
  }

  public execute(): void {
    if (!this.isEnabled()) {
      console.log(`Component ${this.getName()} is uitgeschakeld`);
      return;
    }

    console.log(`Component ${this.getName()} wordt uitgevoerd`);
    console.log(`Opties: ${this.getOptions().join(', ')}`);
  }
}
