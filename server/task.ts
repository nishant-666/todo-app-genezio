import mongoose from "mongoose";
import { MONGO_DB_URI } from "./helper";
import { TaskModel } from "./models/task";
import { GenezioDeploy } from "@genezio/types";

export type Task = {
  id: string;
  token: string;
  title: string;
  url: string;
  solved: boolean;
  date: Date;
};

export type GetTasksResponse = {
  success: boolean;
  tasks: Task[];
};

export type GetTaskResponse = {
  success: boolean;
  task?: Task;
};

export type UpdateTaskResponse = {
  success: boolean;
};

export type DeleteTaskResponse = {
  success: boolean;
};

@GenezioDeploy()
export class TaskService {
  constructor() {
    this.#connect();
  }

  #connect() {
    mongoose.set("strictQuery", false);
    mongoose.connect(MONGO_DB_URI);
  }

  async getAllTasksByUser(token: string): Promise<GetTasksResponse> {
    const tasks = (await TaskModel.find({ token: token })).map((task) => {
      return {
        id: task._id.toString(),
        token: task.token,
        title: task.title,
        url: task.url,
        solved: task.solved,
        date: task.date,
      };
    });

    return { success: true, tasks: tasks };
  }

  async createTask(token: string, title: string): Promise<GetTaskResponse> {
    const task = await TaskModel.create({
      title: title,
      url: "",
      token: token,
    });

    return {
      success: true,
      task: {
        title: title,
        url: "",
        token: token,
        id: task._id.toString(),
        solved: false,
        date: new Date(),
      },
    };
  }

  async updateTask(
    token: string,
    id: string,
    title: string,
    solved: boolean
  ): Promise<UpdateTaskResponse> {
    await TaskModel.updateOne(
      { _id: id, token: token },
      {
        title: title,
        solved: solved,
      }
    );

    return { success: true };
  }

  async deleteTask(id: string): Promise<DeleteTaskResponse> {
    await TaskModel.deleteOne({ _id: id });

    return { success: true };
  }
}
