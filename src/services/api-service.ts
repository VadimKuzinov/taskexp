import type {
    GetTaskByNumberReq,
    GetTaskByNumberResp,
    CreateTaskReq,
    CreateProjectReq,
    DeleteTaskReq,
    GetTasksByProjectReq,
    GetTasksByProjectResp,
    AuthenticateReq,
    AuthenticateResp,
    ListProjectsResp,
    ListAvailableStatusesResp,
    ListAvailableStatusesReq,
    UpdateTaskReq,
    RegisterReq,
    UserDto
} from '../models/myApi'

import {TaskExplorerService} from "../services/myApi";

export class ApiService {
    constructor(private httpClient: TaskExplorerService) {
    }

    async register(request: RegisterReq) {
        await this.httpClient.auth.registerCreate(request, {});
    }

    async authenticate(request: AuthenticateReq): Promise<AuthenticateResp> {
        const {data} = await this.httpClient.auth.authenticateCreate(request, {});
        return data;
    }

    async getTaskStatuses() {
        const {data} = await this.httpClient.task.statusesList({});
        return data;
    }

    async getAvailableStatuses(request: ListAvailableStatusesReq): Promise<ListAvailableStatusesResp> {
        const {data} = await this.httpClient.task.availableStatusesCreate(request, {});
        return data;
    }

    async getTaskByNumber(request: GetTaskByNumberReq): Promise<GetTaskByNumberResp> {
        const {data} = await this.httpClient.task.byNumberCreate(request, {})
        return data;
    }

    async getTasksByProject(request: GetTasksByProjectReq): Promise<GetTasksByProjectResp> {
        const {data} = await this.httpClient.task.byProjectCreate(request, {});
        return data;
    }

    async getProjects(): Promise<ListProjectsResp> {
        const {data} = await this.httpClient.project.listList({
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        });
        return data;
    }

    async updateTask(request: UpdateTaskReq) {
        await this.httpClient.task.updateUpdate(request, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        });
    }

    async createTask(request: CreateTaskReq) {
        await this.httpClient.task.createCreate(request, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        });
    }

    async deleteTask(request: DeleteTaskReq) {
        await this.httpClient.task.deleteDelete(request, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        });
    }

    async getCurrentUser(): Promise<UserDto> {
        const {data} = await this.httpClient.auth.authInfoList({
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        });
        return data;
    }

    async createProject(request: CreateProjectReq) {
        await this.httpClient.project.createCreate(request, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        });
    }

    async getAllUsers(): Promise<UserDto[]> {
        const {data} = await this.httpClient.auth.authList({
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        });
        return data;
    }
}

export default ApiService;
