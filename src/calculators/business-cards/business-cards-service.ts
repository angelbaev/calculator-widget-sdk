import AbstractService from "../../infra/service/abstract-service";
import schema from "./schema.json";
import {BusinessCardCollectionInterface} from "../../infra/interface";

export default class BusinessCardsService extends AbstractService<BusinessCardCollectionInterface> {

    constructor() {
        super();
        this.init();
    }

    init(): void {
        console.log('Initializing BusinessCardsService...');
        this.setData(schema as BusinessCardCollectionInterface);
    }

    getPrintedSideCollection(): Record<string, Record<string, number>> {
        const data = this.getData();
        return data ? data.printedSide : {};
    }

    getPaperTypeCollection(): Record<string, Record<string, number>> {
        const data = this.getData();
        return data ? data.paperType : {};
    }

    getTurnaroundCollection(): Record<string, Record<string, number>> {
        const data = this.getData();
        return data ? data.turnaround : {};
    }
}
