import React from "react";

function NotFound() {
    return (
        <div>
            <h1 className="text-4xl font-bold text-center mt-20">
                404 - Page Not Found
            </h1>
            <p className="text-center mt-4">
                Sorry, the page you are looking for does not exist.
            </p>
            <p className="text-center mt-2">
                You can go back to the{" "}
                <a href="/" className="text-blue-500">
                    homepage
                </a>
                .
            </p>
        </div>
    );
}

export default NotFound;
