import React, { useEffect, useRef } from 'react'

interface IProps {
      errorMessage: string,
      setError: React.Dispatch<React.SetStateAction<string>>
}
function ErrorModal({ errorMessage, setError }: IProps) {

      const modalRef = useRef<HTMLDivElement | null>(null)

      useEffect(() => {
            if (modalRef.current) {
                  modalRef.current.style.display = errorMessage !== "" ? "block" : "none"
            }
      })

      return (
            <div id="myModal" className="modal" ref={modalRef}>
                  <div className="modal-content">
                        <span className="close" onClick={() => setError("")}>&times;</span>
                        <p>{errorMessage}</p>

                        <div className='error-modal-footer'>
                              <button className='ok-close-btn' onClick={() => setError("")}>
                                    OK
                              </button>
                        </div>
                  </div>
            </div>
      )
}

export default ErrorModal