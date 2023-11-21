import React from "react";
import Form from "./Form";
import Button from "@mui/material/Button";
import { useSeries } from "./SeriesContext";

const AddForm = ({
	activeStep,
	handleBack,
	steps,
	handleComplete,
	totalSteps,
}) => {
	const { handleAddSeries } = useSeries();
	return (
		<form
			// action="http://localhost:5000/api/series"
			method="POST"
			encType="multipart/form-data"
			onSubmit={(e) => {
				e.preventDefault();
				handleComplete();
				handleAddSeries(e);
			}}
		>
			<p className="py-4 pl-2">Krok {activeStep + 1}</p>
			<Form part={activeStep} />
			<div className="flex mt-20">
				<Button
					color="inherit"
					disabled={activeStep === 0}
					onClick={handleBack}
					sx={{ mr: 1 }}
				>
					Powrót
				</Button>
				<div className="flex flex-auto" />
				{activeStep !== steps.length &&
				activeStep === totalSteps - 1 ? (
					<button
						type="submit"
						className="text-primary-orange uppercase font-medium"
					>
						Dodaj serię
					</button>
				) : (
					<Button onClick={handleComplete} sx={{ color: "#ff9900" }}>
						Przejdź dalej
					</Button>
				)}
			</div>
		</form>
	);
};

export default AddForm;
