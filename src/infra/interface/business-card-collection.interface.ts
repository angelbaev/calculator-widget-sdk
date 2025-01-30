import {CollectionAwareInterface} from "./collection-aware.interface";

export interface BusinessCardCollectionInterface  extends CollectionAwareInterface {
    printedSide: Record<string, Record<string, number>>;
    paperType: Record<string, Record<string, number>>;
    turnaround: Record<string, Record<string, number>>;
}