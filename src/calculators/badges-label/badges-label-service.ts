import AbstractService from "../../infra/service/abstract-service";

export default class BadgesLabelService extends AbstractService {
    // Реализация на init метода, която извършва конкретна инициализация за баджовете
    init(): void {
        console.log('Initializing BadgesLabelService...');
    }
}
