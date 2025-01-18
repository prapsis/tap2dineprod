import React from "react";

export default function PageHeader({ title,description }: { title: string,description?:React.ReactNode }) {
    return (
        <div className="mt-4 mb-4">
            <h1 className="text-xl font-semibold">{title}</h1>
            <div>
                {description}
            </div>
        </div>
    )
}
