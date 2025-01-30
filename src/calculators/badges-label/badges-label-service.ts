import AbstractService from "../../infra/service/abstract-service";

export default class BadgesLabelService extends AbstractService<any> {
    init(): void {
        console.log('Initializing BadgesLabelService...');
    }
}
