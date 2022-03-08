import { User } from "src/auth/user.entity";
import { Entity, EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task>{
    async createTask(createTask: CreateTaskDto, user: User) {
        const task = this.create({
            title: createTask.title,
            description: createTask.description,
            status: TaskStatus.OPEN,
            user
        })
        await this.save(task);
        return task;
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User) {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where({ user });
        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)', { search: `%${search}%)` })
        }
        const tasks = await query.getMany();
        return tasks;
    }
}