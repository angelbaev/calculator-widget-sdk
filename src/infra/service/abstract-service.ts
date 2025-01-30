export default abstract class AbstractService<T> {
    private data: T | null = null;
    abstract init(): void;

    public setData(data: T): void {
        this.data = data;
    }

    public getData(): T | null {
        return this.data;
    }
}