import React, { useEffect, useRef } from 'react'
import useFetchAllUsers, { UserType } from '../hooks/useFetchAllUsers'

interface IProps {
      isModalOpen: boolean,
      setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
      assignees: UserType[],
      setAssignees: React.Dispatch<React.SetStateAction<UserType[]>>
}

function Modal({ isModalOpen, setIsModalOpen, assignees, setAssignees }: IProps) {

      const [possibleAssignees, setPossibleAssignees] = useFetchAllUsers();
      // const [newAssignee, setNewAssignee] = useState<string[]>([])


      const modalRef = useRef<HTMLDivElement | null>(null)

      // const updateAssigneeList = (e: React.FormEvent<HTMLFormElement>) => {
      //       e.preventDefault()
      //       if (newAssignee[0] !== null) {
      //             setPossibleAssignees(prev => [...prev, newAssignee])
      //             setAssignee(newAssignee)
      //             setNewAssignee("")
      //       }
      // }

      const updateAssignees = (uid: number) => {

            let addOrRemove: number = 0 // specifies whether we are adding a new assignee or removing a previously selected one
            assignees.forEach((each, idx) => {
                  if (each.uid === uid) {
                        addOrRemove = 1;
                  }
            })

            if (addOrRemove === 1) {
                  setAssignees(prev => prev.filter(each => each.uid !== uid))
            }
            else {
                  setAssignees(prev => [...prev, possibleAssignees[uid - 1]])
            }

            // setAssignees(prev => {
            //       const temp = [...prev]
            //       temp.forEach((each, idx) => {
            //             if (each.uid === uid) {
            //                   delete temp[idx];
            //             }
            //             return;
            //       })

            //       return [...temp, possibleAssignees[uid - 1]];
            // })
      }

      const checkIfAssigned = (uid: number) => {
            assignees.forEach(each => {
                  if (each.uid === uid) return true;
            })
            return false;
      }

      useEffect(() => {
            if (modalRef.current) {
                  modalRef.current.style.display = isModalOpen ? "block" : "none"
            }
      }, [isModalOpen])

      return (
            <div className="modal" ref={modalRef}>
                  <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <p className="modal-header"> Choose an Assignee</p>
                        <ul>
                              {
                                    possibleAssignees.map((each, idx) => (
                                          <li
                                                key={idx}
                                                onClick={() => updateAssignees(each.uid)}
                                                className={checkIfAssigned(each.uid) ? "selected" : ""}
                                          >
                                                {each.fullname}
                                          </li>
                                    )
                                    )}
                        </ul>

                        <div className="modal-footer">

                              {/* <form onSubmit={(e) => updateAssigneeList(e)}>
                                    <input
                                          type="text"
                                          className='add-new-assignee'
                                          value={newAssignee}
                                          onChange={(e) => setNewAssignee(e.target.value)}
                                          placeholder='New assignee...'
                                    />
                              </form> */}

                              <div className='modal-action-buttons'>
                                    <button className='reset-assignee-btn' onClick={() => setAssignees([])}>
                                          Reset
                                    </button>
                                    <button className='confirm-assignee-btn' onClick={() => setIsModalOpen(false)}>
                                          Confirm
                                    </button>
                              </div>

                        </div>

                  </div>

            </div>
      )
}

export default Modal