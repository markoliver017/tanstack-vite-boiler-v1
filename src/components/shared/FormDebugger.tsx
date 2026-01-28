// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FormDebugger({ form }: { form: any }) {
    return (
        <div className="p-5 border border-dotted mt-4 border-destructive">
            <label>FORM VALUES</label>
            <pre className="mt-8 p-4 bg-slate-100 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(form.watch(), null, 2)}
            </pre>
            <div className="my-8 border-t"></div>
            <label className="text-destructive">FORM ERRORS</label>
            <pre className="mt-8 p-4 bg-slate-100 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(form.formState.errors, null, 2)}
            </pre>
        </div>
    );
}
