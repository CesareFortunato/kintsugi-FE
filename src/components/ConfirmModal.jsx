export default function ConfirmModal({
    id,
    title,
    message,
    confirmText = "Conferma",
    cancelText = "Annulla",
    onConfirm,
    confirmButtonClass = "btn-danger",
}) {
    return (
        <div
            className="modal fade"
            id={id}
            tabIndex="-1"
            aria-labelledby={`${id}Label`}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${id}Label`}>
                            {title}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Chiudi"
                        ></button>
                    </div>

                    <div className="modal-body">
                        <p className="mb-0">{message}</p>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            data-bs-dismiss="modal"
                        >
                            {cancelText}
                        </button>

                        <button
                            type="button"
                            className={`btn ${confirmButtonClass}`}
                            data-bs-dismiss="modal"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}