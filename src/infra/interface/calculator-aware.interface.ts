export interface CalculatorAwareInterface {
    name: string;
    uuid: string;
    validator(container: HTMLElement): boolean;
    render(container: HTMLElement): void;
}
