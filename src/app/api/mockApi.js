import { delay } from "../common/util/util";
import { sampleData } from "./sampleData";

export const fetchSampleData = async () => {
    await delay(1000);
    return new Promise.resolve(sampleData);
}
