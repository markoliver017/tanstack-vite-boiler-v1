export default function PageErrorComponent({ error }: { error: Error }) {
    console.log(error);
    return (
        <div className="bg-yellow-50 p-4">
            <h3 className="font-bold">ERROR</h3>
            <p>
                We couldn't load your data right now.{" "}
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </p>
        </div>
    );
}
