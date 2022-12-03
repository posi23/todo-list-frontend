import { deleteTask, editTask, formattedDateString, getMonths, readAllActivities, sendNewActivity, TodoItem, } from '../utils/utils'
import { FiCalendar } from "react-icons/fi"
import { BsPerson, BsDot, BsCheckLg, BsTrash } from "react-icons/bs"
import { useEffect, useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useFetchAllUsers from '../hooks/useFetchAllUsers'
import { ActivityType } from '../hooks/useFetchActivities'

type IProps = {
      todosObject: {
            todos: TodoItem[],
            setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>
            // addTodo: (task: TodoItem) => void,
      },
      setActivities: React.Dispatch<React.SetStateAction<ActivityType[]>>,
      setCurrentTab: React.Dispatch<React.SetStateAction<string>>
}

function Todo({ todosObject, setActivities, setCurrentTab }: IProps) {

      const location = useLocation()

      const { todos, setTodos } = todosObject

      const [currentUser, setCurrentUser] = useState<string>("Posi");

      const [allUsers, setAllUsers] = useFetchAllUsers();

      const deleteTodo = async (id: number) => {
            let deletedTodo = todos.filter(each => each.id === id)[0]
            setTodos(prev => prev.filter(each => each.id !== id))
            const response = await deleteTask(id);
            console.log(response);

            let activity = await sendNewActivity(3, currentUser, deletedTodo.taskName)
            setActivities(prev => [...prev, { activity: activity, read: false }])
      }

      const updateCompleteUncomplete = async (id: number) => {
            let activityType: number = 0;
            let task: TodoItem = todos.filter(each => each.id === id)[0];
            let updatedTask = { ...task, completed: !task.completed };
            await editTask(updatedTask);

            const temp = [...todos]
            const updatedTodos = temp.map(each => {
                  if (each.id === id) {
                        activityType = each.completed === false ? 1 : 4;
                        // activity = await sendNewActivity(each.completed === false ? 1 : 4, currentUser, each.taskName)
                        return { ...each, completed: !each.completed }
                  }
                  return each
            })

            setTodos(updatedTodos);

            let activity = await sendNewActivity(activityType, currentUser, task.taskName)

            setActivities(prev => [...prev, { activity: activity, read: false }])
      }

      const updateViewStatusForActivities = useCallback(async () => {
            setActivities(prev =>
                  prev.map(activity => {
                        if (activity.read) return activity
                        const updatedActivity = { ...activity, read: true }
                        return updatedActivity
                  })
            )
            await readAllActivities();
      }, [setActivities])



      useEffect(() => {
            let state = location.state as any
            let locationState = state?.prevPath
            if (locationState === "/activity") updateViewStatusForActivities()
      }, [updateViewStatusForActivities, location])

      useEffect(() => {
            setCurrentTab("todo")
      }, [setCurrentTab])

      // useEffect(() => {
      //       setCurrentUser(AuthServices.getCurrentUser().fullname);
      // })

      return (
            <>
                  {todos.length > 0 ? todos.map((todo) => (
                        <div className='main-display' key={todo.id}>
                              <div className='completed-circle' onClick={() => updateCompleteUncomplete(todo.id)}>
                                    {todo.completed && <BsCheckLg style={{ alignSelf: "center" }} color="green" />}
                              </div>

                              <div className='todoItem'>
                                    <div className='title'>
                                          <p className='taskName'>{todo.taskName}</p>
                                          <p className='task-description'>{todo.description}</p>
                                    </div>

                                    <div className='completion-time'>

                                          <div className='assignee'>
                                                {allUsers.map(user => (
                                                      todo.assignees !== undefined ? (todo.assignees.includes(user.uid) &&
                                                            <div className='each-assignee'>
                                                                  <span>
                                                                        <BsPerson size={18} />
                                                                  </span>
                                                                  <p key={user.uid}>
                                                                        {user.fullname}
                                                                  </p>
                                                            </div>) : ""
                                                ))}
                                          </div>

                                          <p className='splitting-dot'>
                                                <BsDot color='rgb(162, 156, 168)' size={30} />
                                          </p>

                                          <p className='due-date'>
                                                <span>
                                                      <FiCalendar size={18} />
                                                </span>
                                                {formattedDateString(todo.dueDate, { time: false })}
                                          </p>

                                    </div>
                                    {/* <p className='completed'>{todo.completed}</p> */}

                              </div>

                              <div className='delete-icon' onClick={() => deleteTodo(todo.id)}>
                                    <BsTrash size={25} />
                              </div>
                        </div>
                  )) :
                        <div className='empty-content'>List is empty...</div>
                  }
            </>
      )
}

export default Todo