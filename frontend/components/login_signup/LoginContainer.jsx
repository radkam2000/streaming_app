"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Alert } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { Button } from "../buttons";
import Input from "./Input";
import PasswordInput from "./PasswordInput";

export const LoginContainer = () => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [data, setData] = useState({ email: "", password: "" });
	const [rememberMe, setRememberMe] = useState(false);
	useEffect(() => {
		const savedData = localStorage.getItem("loginData");
		if (savedData) {
			setData(JSON.parse(savedData));
		}
	}, []);
	const [error, setError] = useState("");
	const handleChange = ({ currentTarget: input }) => {
		const updatedData = { ...data, [input.name]: input.value };
		setData(updatedData);
		localStorage.setItem("loginData", JSON.stringify(updatedData));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:5000/api/auth/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...data }),
			});
			if (response.status == 200) {
				const res = await response.json();
				if (rememberMe == false) localStorage.removeItem("loginData");
				localStorage.setItem("token", res.data.token);
				localStorage.setItem("role", res.role);
				document.cookie = `token=${res.data.token}; path=/; Secure; SameSite=None`;
				document.cookie = `role=${res.role}; path=/; Secure; SameSite=None`;
				router.push(`/${res.role}`); //role: user/admin
			} else {
				setError("Podano nieprawidłowe dane");
				console.error("Authentication failed");
			}
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError("Błąd serwera");
				console.error(error);
			}
		}
	};
	return (
		<div className="flex flex-col items-center py-12 px-10 bg-grey-200 rounded-lg w-fit h-fit mt-32">
			<h1 className="font-bold text-2xl text-primary-orange mb-6">
				Witaj ponownie!
			</h1>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<Input
					label="Adres Email"
					id="email"
					type="email"
					name="email"
					value={data.email}
					handleChange={handleChange}
					icon={
						<AlternateEmailIcon
							fontSize="28px"
							className="text-lg"
						/>
					}
				/>
				<PasswordInput
					label="Hasło"
					id="password"
					name="password"
					value={data.password}
					handleChange={handleChange}
					handleClickShowPassword={() =>
						setShowPassword((show) => !show)
					}
					showPassword={showPassword}
				/>
				<div className="flex justify-between items-center px-2 mb-8">
					<FormControlLabel
						control={
							<Checkbox
								className="h-3 pl-4"
								sx={{
									svg: {
										fontSize: "16px",
									},
								}}
								onChange={(e) =>
									setRememberMe(e.target.checked)
								}
							/>
						}
						label="Zapamiętaj mnie"
						sx={{
							span: {
								fontSize: "12px",
								fontFamily: "Montserrat",
							},
						}}
					/>
				</div>
				<Button variant="filled" type="submit">
					Zaloguj się
				</Button>
				{error !== "" ? (
					<span className="mt-2">
						<Alert variant="outlined" severity="error">
							{error}
						</Alert>
					</span>
				) : (
					""
				)}
			</form>
		</div>
	);
};
