import axios, { AxiosError } from "axios"
import authServices from "../services/auth.services"

export type TodoItem = {
      id: number
      taskName: string,
      description?: string,
      dueDate: Date,
      assignee: string[],
      completed: boolean,
      updatedAt: string | null,
      createdAt: string | null,
}


export type ActivityItem = {
      activityString: string,
      read: boolean
}



export type ResultType = {
      message: any,
      status: number
}

export const getErrorMessage = (err: unknown): string => {
      if (err instanceof Error) return err.message
      return String(err)
}

export const getAmountOfUncompletedTodos = (todos: TodoItem[]): number => {
      const uncompletedTodosArray = todos.filter(each => each.completed === false)
      return uncompletedTodosArray.length
}

export const getAmountOfUnreadActivities = (activities: ActivityItem[]): number => {
      const unreadActivitiesArray = activities.filter(activity => activity.read === false)
      return unreadActivitiesArray.length
}

export const determineTheNextId = (array: TodoItem[]): number => {
      const ids = array.map(each => each.id)
      return Math.max(...ids) + 1
}

export const sendNewActivity = (activityType: number, nameOfActivator: string | null, objectOfActivity: string | null): string => {

      let newActivity = ""
      switch (activityType) {
            case 1:
                  newActivity = `${nameOfActivator} has set task "${objectOfActivity}" to complete`
                  break
            case 2:
                  newActivity = `A new task has been added: ${objectOfActivity}, by ${nameOfActivator}`
                  break
            case 3:
                  newActivity = `${nameOfActivator} has deleted task "${objectOfActivity}"`
                  break
            case 4:
                  newActivity = `${nameOfActivator} has set task "${objectOfActivity}" to uncomplete`
                  break
            default:
                  return ""
      }
      return newActivity
}

export const getMonths = (monthInNumber: number): string => {
      const arrayOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      return arrayOfMonths[monthInNumber - 1]
}

export const deleteTask = async (id: number) => {
      try {
            const response = await axios.delete(`${authServices.API_URL}task/delete?taskId=${id}`);
            const status = response.status;
            const data = response.data
            const returnData = { message: data, status };
            return returnData;
      }
      catch (error: any | AxiosError) {
            if (axios.isAxiosError(error)) {
                  console.log(error.message, error.status);
            }
            else {
                  console.log(error);
            }
      }
}