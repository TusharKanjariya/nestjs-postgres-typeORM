import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
    constructor(@InjectRepository(TasksRepository) private tasksRepository: TasksRepository) { }

    getTasks(filterDto: GetTasksFilterDto, user: User) {
        return this.tasksRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: string, user: User) {
        const found = await this.tasksRepository.findOne({ where: { id, user } });
        if (!found) {
            throw new NotFoundException(`Task with ID ${id} Not Found`);
        }
        return found;
    }

    createTask(createTask: CreateTaskDto, user: User) {
        return this.tasksRepository.createTask(createTask, user);
    }

    async deleteTask(id: string, user: User) {
        const result = await this.tasksRepository.delete({ id, user });
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} Not Found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User) {
        const task = await this.getTaskById(id, user);
        task.status = status;
        this.tasksRepository.save(task);
        return task;
    }
}
