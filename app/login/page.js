import React from "react";
import { Nav, LoginContainer } from "@/components";
import Link from "next/link";

export default function Login() {
	return (
		<main className="overflow-hidden flex flex-col items-center">
			<Nav main={false} />
			<LoginContainer />
			<p className="mt-4 font-medium text-[16px]">
				Nie posiadasz jeszcze konta?{" "}
				<Link href="signup" className="text-primary-orange pl-1">
					Zarejestruj się
				</Link>
			</p>
		</main>
	);
}
