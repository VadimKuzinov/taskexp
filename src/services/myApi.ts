import { Api } from '../models/myApi'
import {ApiService} from "./api-service";

export class TaskExplorerService extends Api<any> {
    public api = new ApiService(this);
}