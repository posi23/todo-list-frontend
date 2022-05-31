import { ActivityArray, getMonths, sendNewActivity, TodoState } from '../utils/utils'
import { FiCalendar } from "react-icons/fi"
import { BsPerson, BsDot, BsCheckLg, BsTrash } from "react-icons/bs"
import { useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

interface IProps {
      todosObject: {
            todos: TodoState["type"],
            setTodos: React.Dispatch<React.SetStateAction<TodoState["type"]>>
      },
      setActivities: React.Dispatch<React.SetStateAction<ActivityArray["activities"]>>,
      setCurrentTab: React.Dispatch<React.SetStateAction<string>>
}

function Todo({ todosObject, setActivities, setCurrentTab }: IProps) {

      const location = useLocation()

      const { todos, setTodos } = todosObject

      const deleteTodo = (id: number) => {
            setTodos(prev => prev.filter(each => each.id !== id))

            let deletedTodo = todos.filter(each => each.id === id)[0]

            let activity = sendNewActivity(3, null, deletedTodo.taskName)
            setActivities(prev => [...prev, { activityString: activity, read: false }])
      }

      const updateCompleteUncomplete = (id: number) => {
            let activity = ""
            setTodos(prev =>
                  prev.map(each => {
                        if (each.id === id) {
                              activity = sendNewActivity(each.completed === false ? 1 : 4, each.assignee, each.taskName)
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

      return (
            <>
                  {todos.length > 0 ? todos.map((todo) => (
                        <div className='main-display' key={todo.id}>
                              <div className='completed-circle' onClick={() => updateCompleteUncomplete(todo.id)}>
                                    {todo.completed && <BsCheckLg color="green" />}
                              </div>

                              <div className='todoItem'>
                                    <p className='taskName'>{todo.taskName}</p>
                                    <p className='task-description'>{todo.description}</p>
                                    <div className='completion-time'>
                                          <p className='due-date'>
                                                <span>
                                                      <FiCalendar size={18} />
                                                </span>
                                                {`${todo.dueDate.getDate()} ${getMonths(todo.dueDate.getMonth())} ${todo.dueDate.getFullYear()}`}
                                          </p>
                                          <p className='splitting-dot'>
                                                <BsDot color='rgb(162, 156, 168)' />
                                          </p>
                                          <p className='assignee'>
                                                <span>
                                                      <BsPerson size={18} />
                                                </span>
                                                {todo.assignee}
                                          </p>
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