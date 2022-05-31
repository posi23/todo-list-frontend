import React, { useEffect, useRef, useState } from 'react'

interface IProps {
      isModalOpen: boolean,
      setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
      setAssignee: React.Dispatch<React.SetStateAction<string>>
}

function Modal({ isModalOpen, setIsModalOpen, setAssignee }: IProps) {

      const [possibleAssignees, setPossibleAssignees] = useState<string[]>(["Esther Howard", "Brooklyn Simmons", "M-Jay"])
      const [newAssignee, setNewAssignee] = useState<string>("")


      const modalRef = useRef<HTMLDivElement | null>(null)

      const updateAssigneeList = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            if (newAssignee !== "") {
                  setPossibleAssignees(prev => [...prev, newAssignee])
                  setAssignee(newAssignee)
                  setNewAssignee("")
            }
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
                                          <li key={idx} onClick={() => setAssignee(each)}>{each}</li>
                                    )
                                    )}
                        </ul>

                        <div className="modal-footer">

                              <form onSubmit={(e) => updateAssigneeList(e)}>
                                    <input
                                          type="text"
                                          className='add-new-assignee'
                                          value={newAssignee}
                                          onChange={(e) => setNewAssignee(e.target.value)}
                                          placeholder='New assignee...'
                                    />
                              </form>

                              <div className='modal-action-buttons'>
                                    <button className='reset-assignee-btn' onClick={() => setAssignee("")}>
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