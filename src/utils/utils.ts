
export interface TodoItem {
      value: {
            id: number
            taskName: string,
            description?: string,
            dueDate: Date,
            assignee: string,
            completed: boolean
      }
}

export interface TodoState {
      type: TodoItem["value"][]
}

export interface ActivityItem {
      activity: {
            activityString: string,
            read: boolean
      }
}

export interface ActivityArray {
      activities: ActivityItem["activity"][]
}

export const getErrorMessage = (err: unknown): string => {
      if (err instanceof Error) return err.message
      return String(err)
}

export const getAmountOfUncompletedTodos = (todos: TodoState["type"]): number => {
      const uncompletedTodosArray = todos.filter(each => each.completed === false)
      return uncompletedTodosArray.length
}

export const getAmountOfUnreadActivities = (activities: ActivityArray["activities"]): number => {
      const unreadActivitiesArray = activities.filter(activity => activity.read === false)
      return unreadActivitiesArray.length
}

export const determineTheNextId = (array: TodoState["type"]): number => {
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
                  newActivity = `A new task has been added: ${objectOfActivity}`
                  break
            case 3:
                  newActivity = `Task "${objectOfActivity}" has been deleted`
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