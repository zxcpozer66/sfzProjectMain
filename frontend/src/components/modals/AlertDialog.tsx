import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

interface AlertDialogProps {
	open: boolean
	onClose: () => void
	onConfirm: () => void
	textMessage: string
}

export default function AlertDialog({
	open,
	onClose,
	onConfirm,
	textMessage,
}: AlertDialogProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description" 
		>
			<DialogTitle id="alert-dialog-title">Удалить запись?</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{textMessage}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Отмена</Button>
				<Button onClick={onConfirm} color="error">
					Удалить
				</Button>
			</DialogActions>
		</Dialog>
	)
}
