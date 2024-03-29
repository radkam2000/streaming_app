"use client";
import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import { Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddForm from "./AddForm";
import { useSeries } from "./SeriesContext";

const steps = ["Dodaj szczegóły serii", "Dodaj obsadę", "Dodaj odcinki"];

const StepForm = () => {
	const [activeStep, setActiveStep] = useState(0);
	const [completed, setCompleted] = useState({});
	const [areErrors, setAreErrors] = useState(false);

	const totalSteps = () => {
		return steps.length;
	};

	const completedSteps = () => {
		return Object.keys(completed).length;
	};

	const isLastStep = () => {
		return activeStep === totalSteps() - 1;
	};

	const allStepsCompleted = () => {
		return completedSteps() === totalSteps();
	};

	const handleNext = () => {
		const newActiveStep =
			isLastStep() && !allStepsCompleted()
				? steps.findIndex((step, i) => !(i in completed))
				: activeStep + 1;
		setActiveStep(newActiveStep);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleStep = (step) => () => {
		setActiveStep(step);
	};
	const { addStatus, isLoading } = useSeries();
	const [open, setOpen] = useState(false);
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
	const handleComplete = () => {
		if (areErrors) {
			setOpen(true);
		} else {
			setOpen(false);
			const newCompleted = completed;
			newCompleted[activeStep] = true;
			setCompleted(newCompleted);
			handleNext();
		}
	};
	const handleReset = () => {
		setOpen(false);
		setActiveStep(0);
		setCompleted({});
	};
	return (
		<div className="w-full mt-8">
			<Stepper nonLinear activeStep={activeStep}>
				{steps.map((label, index) => (
					<Step key={label} completed={completed[index]}>
						<StepButton
							color="inherit"
							onClick={handleStep(index)}
							sx={{ circle: { color: "#404040" } }}
						>
							{label}
						</StepButton>
					</Step>
				))}
			</Stepper>
			<div>
				{allStepsCompleted() ? (
					<React.Fragment>
						{isLoading ? (
							<div className="mt-8">Dodawanie...</div>
						) : (
							<>
								<p className="mt-8">{addStatus}</p>
								<div className="flex mt-16 mb-[46px]">
									<div className="flex flex-auto" />
									<Button
										onClick={handleReset}
										sx={{
											color: "#ff9900",
											fontWeight: "500",
										}}
									>
										{addStatus === "Udało się dodać serię"
											? "Dodaj kolejną serię"
											: "Spróbuj jeszcze raz"}
									</Button>
								</div>
							</>
						)}
					</React.Fragment>
				) : (
					<AddForm
						activeStep={activeStep}
						handleBack={handleBack}
						steps={steps}
						handleComplete={handleComplete}
						totalSteps={totalSteps()}
					/>
				)}
				<Snackbar
					open={open}
					autoHideDuration={6000}
					onClose={handleClose}
					message="Uzupełnij pola lub napraw błędy!"
					action={action}
					sx={{
						marginLeft: "50px",
						borderRadius: "4px",
						border: "2.5px solid rgb(153 27 27)",
						div: {
							fontWeight: "600",
							fontFamily: "montserrat",
							color: "rgb(239 68 68)",
							backgroundColor: "#101010",
						},
						svg: { path: { color: "rgb(239 68 68)" } },
					}}
				/>
			</div>
		</div>
	);
};

export default StepForm;
