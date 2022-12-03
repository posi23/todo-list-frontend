import React, { useEffect, useRef, useState } from 'react'
import { BsPerson } from 'react-icons/bs'
import { FiCalendar } from 'react-icons/fi'
import { getErrorMessage, sendNewActivity, TodoItem } from '../utils/utils'
import ErrorModal from './ErrorModal'
import Modal from './Modal'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { AuthServices } from '../services'
import { newTodoType } from '../hooks/useFetchTasks'
import { UserType } from '../hooks/useFetchAllUsers'
import { ActivityType } from '../hooks/useFetchActivities'

interface IProps {
      todosObject: {
            todos: TodoItem[],
            addTodo: (task: newTodoType) => void
      }
      newTodoCardOpen: {
            isNewTodoCardOpen: boolean,
            setIsNewTodoCardOpen: React.Dispatch<React.SetStateAction<boolean>>
      },
      setActivities: React.Dispatch<React.SetStateAction<ActivityType[]>>
}

function AddNewTodo({ todosObject, newTodoCardOpen, setActivities }: IProps) {

      const { todos, addTodo } = todosObject
      const { isNewTodoCardOpen, setIsNewTodoCardOpen } = newTodoCardOpen

      const [taskName, setTaskName] = useState<string>("")
      const [description, setDescription] = useState<string>("")
      const [dueDate, setDueDate] = useState<Date>(new Date())
      const [assignees, setAssignees] = useState<UserType[]>([])
      const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
      const [error, setError] = useState<string>("")

      const [user, setUser] = useState("Posi"); // temporary value until log in functionality is implemented

      const newTodoCardRef = useRef<HTMLDivElement | null>(null)

      const CustomInput = (props: React.HTMLProps<HTMLInputElement>, ref: React.Ref<HTMLInputElement>) => {
            return (
                  <button className="date-btn">
                        <span><FiCalendar size={20} /></span>
                        <input {...props} className='date-input' />
                  </button>


            );
      };

      const addNewTodoToTheList = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault()

            const assigneeIds: number[] = assignees.map(each => {
                  return each.uid;
            })

            try {
                  validateFields()
                  const newTodo: newTodoType = {
                        taskName,
                        description,
                        dueDate,
                        assignees: assigneeIds,
                  }

                  if (newTodo) {
                        addTodo(newTodo)
                        let activity = await sendNewActivity(2, user, newTodo.taskName)
                        setActivities(prev => [...prev, { activity: activity, read: false }])
                  }
                  clearStateToInitialState()
            }
            catch (err) {
                  setError(getErrorMessage(err))
            }
      }

      const clearStateToInitialState = () => {
            setTaskName("")
            setDescription("")
            setDueDate(new Date())
            setAssignees([])
      }

      const validateFields = () => {
            if (taskName === "" || assignees[0] === null) throw new Error("'Task name' or 'Assign To' field needs to filled")
      }

      useEffect(() => {
            if (newTodoCardRef.current) {
                  newTodoCardRef.current.style.display = isNewTodoCardOpen ? 'flex' : 'none'
            }
      }, [isNewTodoCardOpen])

      return (
            <div className='add-task-card' ref={newTodoCardRef}>

                  <input
                        type="text"
                        className='task-name-input'
                        placeholder='Task name here...'
                        value={taskName}
                        onChange={e => setTaskName(e.target.value)} />

                  <input
                        type="text"
                        className='description-input'
                        placeholder='Description'
                        value={description}
                        onChange={e => setDescription(e.target.value)} />

                  <div className='button-container'>
                        <div className='completion-time-buttons'>
                              <div>
                                    <DatePicker selected={dueDate} onChange={date => date && setDueDate(date)} customInput={React.createElement(React.forwardRef(CustomInput))} />
                              </div>

                              <button className='assignee-btn' onClick={() => setIsModalOpen(true)}>
                                    <span><BsPerson size={20} /></span>
                                    {assignees[0] === undefined && "Assign To"}
                                    {assignees.length === 1 && assignees[0].fullname}
                                    {assignees.length > 1 && `${assignees[0].fullname} +  ${assignees.length - 1}`}
                              </button>
                        </div>

                        <div className="card-action-buttons">
                              <button className="cancel-btn" onClick={e => setIsNewTodoCardOpen(false)}>
                                    Cancel
                              </button>
                              <button className="add-btn" onClick={e => addNewTodoToTheList(e)}>
                                    Add Task
                              </button>
                        </div>

                  </div>

                  <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} assignees={assignees} setAssignees={setAssignees} />

                  <ErrorModal errorMessage={error} setError={setError} />

            </div>
      )
}

export default AddNewTodo