import React from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const SuccessMessage = ({ open, setOpen, message }) => {
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};
	const action = (
		<React.Fragment>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleClose}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</React.Fragment>
	);
	return (
		<Snackbar
			open={open}
			autoHideDuration={6000}
			onClose={handleClose}
			message={message}
			action={action}
			sx={{
				marginLeft: "50px",
				div: { fontWeight: "600", fontFamily: "montserrat" },
			}}
		/>
	);
};

export default SuccessMessage;
