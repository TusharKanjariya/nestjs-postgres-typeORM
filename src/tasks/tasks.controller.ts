import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService: TasksService) { }
    private logger = new Logger('TasksController');
    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User) {
        this.logger.verbose(`User ${user.username} retriving all tasks`);
        return this.taskService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string, @GetUser() user: User) {
        return this.taskService.getTaskById(id, user);
    }

    @Post()
    createTask(@Body() createTask: CreateTaskDto, @GetUser() user: User) {
        return this.taskService.createTask(createTask, user);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string, @GetUser() user: User) {
        return this.taskService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body() updateTaskstatus: UpdateTaskStatusDto, @GetUser() user: User) {
        const { status } = updateTaskstatus;
        return this.taskService.updateTaskStatus(id, status, user);
    }
}
