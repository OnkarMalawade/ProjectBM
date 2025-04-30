import React, { useState } from "react";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";

const MessagePanel = ({ projectId, currentUserId, receiverId }) => {
    const [refreshToggle, setRefreshToggle] = useState(false);

    const handleRefresh = () => setRefreshToggle((prev) => !prev);

    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "1rem",
                marginTop: "1rem",
            }}
        >
            <h2>Project Chat</h2>
            <MessageList
                key={refreshToggle}
                projectId={projectId}
                currentUserId={currentUserId}
            />
            <MessageForm
                projectId={projectId}
                receiverId={receiverId}
                onMessageSent={handleRefresh}
            />
        </div>
    );
};

export default MessagePanel;
