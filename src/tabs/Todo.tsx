import { ActivityItem, deleteTask, getMonths, sendNewActivity, TodoItem, } from '../utils/utils'
import { FiCalendar } from "react-icons/fi"
import { BsPerson, BsDot, BsCheckLg, BsTrash } from "react-icons/bs"
import { useEffect, useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthServices } from '../services'
import { useAxios } from '../hooks/useAxios'

type IProps = {
      todosObject: {
            todos: TodoItem[],
            setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>
            // addTodo: (task: TodoItem) => void,
      },
      setActivities: React.Dispatch<React.SetStateAction<ActivityItem[]>>,
      setCurrentTab: React.Dispatch<React.SetStateAction<string>>
}

const options: Intl.DateTimeFormatOptions = { weekday: undefined, year: 'numeric', month: 'long', day: 'numeric' };

function Todo({ todosObject, setActivities, setCurrentTab }: IProps) {

      const location = useLocation()

      const { todos, setTodos } = todosObject

      const [currentUser, setCurrentUser] = useState<string>("Posi");

      const deleteTodo = (id: number) => {
            let deletedTodo = todos.filter(each => each.id === id)[0]
            setTodos(prev => prev.filter(each => each.id !== id))
            const response = deleteTask(id);
            console.log(response);

            let activity = sendNewActivity(3, currentUser, deletedTodo.taskName)
            setActivities(prev => [...prev, { activityString: activity, read: false }])
      }

      const updateCompleteUncomplete = (id: number) => {
            let activity = ""
            setTodos(prev =>
                  prev.map(each => {
                        if (each.id === id) {
                              activity = sendNewActivity(each.completed === false ? 1 : 4, currentUser, each.taskName)
                              return { ...each, completed: !each.completed }
                        }
                        return each
                  })
            )
            setActivities(prev => [...prev, { activityString: activity, read: false }])
      }

      const updateViewStatusForActivities = useCallback(() => {
            setActivities(prev =>
                  prev.map(activity => {
                        if (activity.read) return activity
                        const updatedActivity = { ...activity, read: true }
                        return updatedActivity
                  })
            )
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
                                    <p className='taskName'>{todo.taskName}</p>
                                    <p className='task-description'>{todo.description}</p>
                                    <div className='completion-time'>
                                          <p className='due-date'>
                                                <span>
                                                      <FiCalendar size={18} />
                                                </span>
                                                {`${todo.dueDate.toLocaleString("en-CA", options)}`}
                                          </p>
                                          <p className='splitting-dot'>
                                                <BsDot color='rgb(162, 156, 168)' />
                                          </p>
                                          <div className='assignee'>
                                                {todo.assignee && todo.assignee.map((each, idx) => (
                                                      <>
                                                            <p key={idx}>
                                                                  {each}
                                                            </p>
                                                            <span>
                                                                  <BsPerson size={18} />
                                                            </span>
                                                      </>

                                                ))}
                                          </div>
                                    </div>
                                    <p className='completed'>{todo.completed}</p>

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