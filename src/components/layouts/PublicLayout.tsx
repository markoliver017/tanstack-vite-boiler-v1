import Header from "@/components/public/Header";

export function PublicLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}
